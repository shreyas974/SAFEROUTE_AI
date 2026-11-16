import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getDeviceRoutes, saveDeviceRoute } from "../storage/deviceRoutes";

const AuthContext = createContext();

// Accounts exist only when this deployment configures its own Firebase project. Without it there is
// no sign-in at all (no local "accounts" that accept any password) and saved routes stay on this device.
// The Firebase SDK (~650 kB) is only downloaded when it is configured.
const accountsAvailable = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
const NO_ACCOUNTS = "Accounts are not set up on this deployment. You can plan and save routes without one.";
let firebase = null;
const fb = () => (firebase ??= import("../firebase/firebase"));

const toUser = (fbUser, profile) => ({
  uid: fbUser.uid,
  email: fbUser.email,
  displayName: fbUser.displayName || profile?.displayName || fbUser.email?.split("@")[0] || "You",
  photoURL: fbUser.photoURL || profile?.photoURL || null,
  emergencyContact: profile?.emergencyContact || "",
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [savedRoutes, setSavedRoutes] = useState(() => (accountsAvailable ? [] : getDeviceRoutes()));
  const [loading, setLoading] = useState(accountsAvailable);

  const loadRoutes = useCallback(async (uid) => {
    try {
      setSavedRoutes(await (await fb()).getUserRoutes(uid));
    } catch (e) {
      console.warn("Could not load saved routes:", e);
    }
  }, []);

  useEffect(() => {
    if (!accountsAvailable) return undefined;
    let unsubscribe = () => {};
    let live = true;
    fb().then((f) => {
      if (!live || !f.auth) return setLoading(false);
      unsubscribe = f.onAuthStateChanged(f.auth, async (fbUser) => {
        if (fbUser) {
          const merged = toUser(fbUser, await f.getUserProfile(fbUser.uid));
          setUser(merged);
          loadRoutes(merged.uid);
        } else {
          setUser(null);
          setSavedRoutes([]);
        }
        setLoading(false);
      });
    });
    return () => {
      live = false;
      unsubscribe();
    };
  }, [loadRoutes]);

  const firebaseOrThrow = async () => {
    if (!accountsAvailable) throw new Error(NO_ACCOUNTS);
    const f = await fb();
    if (!f.auth) throw new Error("Sign-in is unavailable: Firebase could not start.");
    return f;
  };

  const login = async (email, password) => {
    const f = await firebaseOrThrow();
    const cred = await f.signInWithEmailAndPassword(f.auth, email, password);
    return toUser(cred.user, await f.getUserProfile(cred.user.uid));
  };

  const signup = async (name, email, password, emergencyContact = "") => {
    const f = await firebaseOrThrow();
    const cred = await f.createUserWithEmailAndPassword(f.auth, email, password);
    await f.updateProfile(cred.user, { displayName: name });
    const profile = { displayName: name, email, emergencyContact, createdAt: new Date().toISOString() };
    await f.saveUserProfile(cred.user.uid, profile);
    return toUser(cred.user, profile);
  };

  const loginWithGoogle = async () => {
    const f = await firebaseOrThrow();
    try {
      const res = await f.signInWithPopup(f.auth, f.googleProvider);
      const merged = toUser(res.user, await f.getUserProfile(res.user.uid));
      await f.saveUserProfile(res.user.uid, { displayName: merged.displayName, email: merged.email });
      return merged;
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return null;
      throw err;
    }
  };

  const logout = async () => {
    if (accountsAvailable) {
      const f = await fb();
      if (f.auth) await f.signOut(f.auth);
    }
  };

  const updateProfileData = async (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await (await fb()).saveUserProfile(user.uid, updated);
  };

  const saveRoute = async (routeData) => {
    let saved;
    if (user) saved = await (await fb()).saveUserRoute(user.uid, routeData);
    else if (!accountsAvailable) saved = saveDeviceRoute(routeData);
    else throw new Error("Sign in to save routes.");
    setSavedRoutes((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
    return saved;
  };

  const resetPassword = async (email) => {
    const f = await firebaseOrThrow();
    await f.sendPasswordResetEmail(f.auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accountsAvailable,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfileData,
        saveRoute,
        savedRoutes,
        resetPassword,
        refreshRoutes: () => (user ? loadRoutes(user.uid) : setSavedRoutes(getDeviceRoutes())),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
