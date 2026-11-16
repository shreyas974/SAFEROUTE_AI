import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  } from "firebase/firestore";

// Firebase is used only when this deployment provides its own project settings. There is no
// fallback project: without VITE_FIREBASE_* the app runs without accounts (routes stay on the device).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app;
let auth;
let db;
let googleProvider;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (err) {
    console.error("[SafeRoute] Firebase could not start:", err.message);
  }
}

// -------------------------------------------------------------
// FULL STORAGE REPOSITORY (Firestore + Automatic Local Storage Fallback)
// -------------------------------------------------------------

const STORAGE_KEYS = {
  USER_PROFILE: "saferoute_user_profile",
  SAVED_ROUTES: "saferoute_saved_routes",
  INCIDENTS: "saferoute_incident_reports",
  EMERGENCY_CONTACTS: "saferoute_emergency_contacts",
};

/**
 * Save user profile to Firestore & LocalStorage
 */
export async function saveUserProfile(uid, profileData) {
  const fullProfile = {
    ...profileData,
    uid,
    updatedAt: new Date().toISOString(),
  };

  // Local sync
  try {
    localStorage.setItem(`${STORAGE_KEYS.USER_PROFILE}_${uid}`, JSON.stringify(fullProfile));
  } catch (e) {
    console.warn("Local storage write error:", e);
  }

  // Firestore sync if connected
  if (db && isFirebaseConfigured) {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, fullProfile, { merge: true });
    } catch (err) {
      console.warn("Firestore user sync error (using local data):", err.message);
    }
  }

  return fullProfile;
}

/**
 * Retrieve user profile from Firestore or LocalStorage
 */
export async function getUserProfile(uid) {
  let localData = null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.USER_PROFILE}_${uid}`);
    if (raw) localData = JSON.parse(raw);
  } catch {
    /* browser storage unavailable: continue without it */
  }

  if (db && isFirebaseConfigured) {
    try {
      const userRef = doc(db, "users", uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const remoteData = snapshot.data();
        localStorage.setItem(`${STORAGE_KEYS.USER_PROFILE}_${uid}`, JSON.stringify(remoteData));
        return remoteData;
      }
    } catch (err) {
      console.warn("Firestore fetch error:", err.message);
    }
  }

  return localData;
}

/**
 * Save a calculated route to user's favorites/history
 */
export async function saveUserRoute(uid, route) {
  const routeRecord = {
    id: `route_${Date.now()}`,
    userId: uid,
    source: route.source || "Current Location",
    destination: route.destination,
    distance_km: route.distance_km,
    duration: route.duration || "15 mins",
    average_risk: route.average_risk,
    risk_level: route.risk_level || (route.average_risk > 35 ? "Moderate" : "Low"),
    savedAt: new Date().toISOString(),
    route_points: route.route_points || (route.coordinates ? route.coordinates.length : 0),
  };

  // Local storage save
  try {
    const existing = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.SAVED_ROUTES}_${uid}`) || "[]");
    const updated = [routeRecord, ...existing.filter((r) => r.id !== routeRecord.id)].slice(0, 50);
    localStorage.setItem(`${STORAGE_KEYS.SAVED_ROUTES}_${uid}`, JSON.stringify(updated));
  } catch {
    /* browser storage unavailable: continue without it */
  }

  // Firestore save
  if (db && isFirebaseConfigured) {
    try {
      const routesCol = collection(db, "users", uid, "saved_routes");
      await addDoc(routesCol, routeRecord);
    } catch (err) {
      console.warn("Firestore route save error:", err.message);
    }
  }

  return routeRecord;
}

/**
 * Retrieve user saved routes
 */
export async function getUserRoutes(uid) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.SAVED_ROUTES}_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch {
    /* browser storage unavailable: continue without it */
  }

  if (db && isFirebaseConfigured) {
    try {
      const routesCol = collection(db, "users", uid, "saved_routes");
      const q = query(routesCol, orderBy("savedAt", "desc"), limit(20));
      const snap = await getDocs(q);
      const results = [];
      snap.forEach((d) => results.push({ id: d.id, ...d.data() }));
      return results;
    } catch {
    /* browser storage unavailable: continue without it */
  }
  }

  // Initial company demo sample routes if empty
  return [
    {
      id: "route_sample_1",
      source: "Koramangala 5th Block",
      destination: "Indiranagar 100ft Rd",
      distance_km: 6.4,
      duration: "18 mins",
      average_risk: 12.4,
      risk_level: "Safe",
      savedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "route_sample_2",
      source: "Whitefield Tech Park",
      destination: "MG Road Metro",
      distance_km: 14.8,
      duration: "34 mins",
      average_risk: 18.2,
      risk_level: "Safe",
      savedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ];
}

/**
 * Submit an incident report to Firebase
 */
export async function submitIncidentReport(report) {
  const incidentRecord = {
    id: `inc_${Date.now()}`,
    ...report,
    status: "Unverified",  // user reports are never verified automatically
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || "[]");
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify([incidentRecord, ...existing]));
  } catch {
    /* browser storage unavailable: continue without it */
  }

  if (db && isFirebaseConfigured) {
    try {
      await addDoc(collection(db, "incidents"), incidentRecord);
    } catch {
    /* browser storage unavailable: continue without it */
  }
  }

  return incidentRecord;
}

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
};
