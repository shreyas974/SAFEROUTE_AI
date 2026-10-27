import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  saveUserProfile,
  getUserProfile,
  saveUserRoute as dbSaveUserRoute,
  getUserRoutes as dbGetUserRoutes,
} from "../firebase/firebase";

const AuthContext = createContext();

const DEMO_USER = {
  uid: "demo_enterprise_user_01",
  displayName: "Alex Rivera",
  email: "alex.rivera@saferoute.ai",
  role: "Enterprise Safety Lead",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  emergencyContact: "+91 98765 43210 (Security Operations)",
  organization: "SafeRoute Enterprise Global",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("saferoute_current_user");
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      try {
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            const profile = await getUserProfile(fbUser.uid);
            const merged = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || (profile && profile.displayName) || fbUser.email.split("@")[0],
              photoURL: fbUser.photoURL || (profile && profile.photoURL) || null,
              emergencyContact: (profile && profile.emergencyContact) || "",
              organization: (profile && profile.organization) || "Enterprise Member",
            };
            setUser(merged);
            localStorage.setItem("saferoute_current_user", JSON.stringify(merged));
            loadUserRoutes(merged.uid);
          } else {
            // Keep local demo user if active, else clear
            const cached = localStorage.getItem("saferoute_current_user");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed.uid.startsWith("demo_")) {
                setUser(parsed);
                loadUserRoutes(parsed.uid);
                setLoading(false);
                return;
              }
            }
            setUser(null);
            localStorage.removeItem("saferoute_current_user");
            setSavedRoutes([]);
          }
          setLoading(false);
        });
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const loadUserRoutes = async (uid) => {
    try {
      const routes = await dbGetUserRoutes(uid);
      setSavedRoutes(routes);
    } catch (e) {
      console.warn("Failed to load user routes:", e);
    }
  };

  const login = async (email, password) => {
    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await getUserProfile(cred.user.uid);
        const activeUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || (profile && profile.displayName) || email.split("@")[0],
          photoURL: cred.user.photoURL,
          emergencyContact: profile?.emergencyContact || "",
        };
        setUser(activeUser);
        localStorage.setItem("saferoute_current_user", JSON.stringify(activeUser));
        await loadUserRoutes(activeUser.uid);
        return activeUser;
      } catch (err) {
        // Fallback demo/local validation if Firebase project is unset
        if (err.code === "auth/invalid-api-key" || err.code === "auth/network-request-failed") {
          return loginLocally(email, password);
        }
        throw err;
      }
    } else {
      return loginLocally(email, password);
    }
  };

  const loginLocally = async (email, password) => {
    const localUser = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: email.split("@")[0].replace(/[._]/g, " "),
      photoURL: null,
      emergencyContact: "+91 98450 11223",
      organization: "SafeRoute AI Member",
    };
    setUser(localUser);
    localStorage.setItem("saferoute_current_user", JSON.stringify(localUser));
    await saveUserProfile(localUser.uid, localUser);
    await loadUserRoutes(localUser.uid);
    return localUser;
  };

  const signup = async (name, email, password, emergencyContact = "") => {
    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        const newUserData = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: name,
          emergencyContact,
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(cred.user.uid, newUserData);
        setUser(newUserData);
        localStorage.setItem("saferoute_current_user", JSON.stringify(newUserData));
        return newUserData;
      } catch (err) {
        if (err.code === "auth/invalid-api-key" || err.code === "auth/network-request-failed") {
          return signupLocally(name, email, emergencyContact);
        }
        throw err;
      }
    } else {
      return signupLocally(name, email, emergencyContact);
    }
  };

  const signupLocally = async (name, email, emergencyContact) => {
    const newUser = {
      uid: `usr_${Date.now()}`,
      displayName: name,
      email,
      emergencyContact,
      organization: "Enterprise Member",
    };
    setUser(newUser);
    localStorage.setItem("saferoute_current_user", JSON.stringify(newUser));
    await saveUserProfile(newUser.uid, newUser);
    return newUser;
  };

  const loginWithGoogle = async () => {
    if (auth && googleProvider) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const fbUser = res.user;
        const profile = await getUserProfile(fbUser.uid);
        const merged = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          emergencyContact: profile?.emergencyContact || "",
        };
        setUser(merged);
        localStorage.setItem("saferoute_current_user", JSON.stringify(merged));
        await saveUserProfile(fbUser.uid, merged);
        await loadUserRoutes(fbUser.uid);
        return merged;
      } catch (err) {
        if (err.code === "auth/popup-closed-by-user") return;
        return loginAsDemo();
      }
    } else {
      return loginAsDemo();
    }
  };

  const loginAsDemo = async () => {
    setUser(DEMO_USER);
    localStorage.setItem("saferoute_current_user", JSON.stringify(DEMO_USER));
    await saveUserProfile(DEMO_USER.uid, DEMO_USER);
    await loadUserRoutes(DEMO_USER.uid);
    return DEMO_USER;
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {}
    setUser(null);
    setSavedRoutes([]);
    localStorage.removeItem("saferoute_current_user");
  };

  const updateProfileData = async (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("saferoute_current_user", JSON.stringify(updated));
    await saveUserProfile(user.uid, updated);
  };

  const saveRoute = async (routeData) => {
    if (!user) return;
    const saved = await dbSaveUserRoute(user.uid, routeData);
    setSavedRoutes((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
    return saved;
  };

  const resetPassword = async (email) => {
    if (auth) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        loginAsDemo,
        logout,
        updateProfileData,
        saveRoute,
        savedRoutes,
        resetPassword,
        refreshRoutes: () => user && loadUserRoutes(user.uid),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
