import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  saveUserProfile,
  getUserProfile,
} from "../firebase/firebase";

export async function signup(name, email, password, emergencyContact = "") {
  if (auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        emergencyContact,
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(cred.user.uid, user);
      localStorage.setItem("saferoute_current_user", JSON.stringify(user));
      return { user, token: cred.user.accessToken || "token" };
    } catch (err) {
      if (err.code !== "auth/invalid-api-key") throw err;
    }
  }

  // Fallback local storage auth
  const user = {
    uid: `local_${Date.now()}`,
    email,
    displayName: name,
    emergencyContact,
  };
  localStorage.setItem("saferoute_current_user", JSON.stringify(user));
  return { user, token: "local_token" };
}

export async function login(email, password) {
  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(cred.user.uid);
      const user = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || (profile && profile.displayName) || email.split("@")[0],
        photoURL: cred.user.photoURL,
        emergencyContact: profile?.emergencyContact || "",
      };
      localStorage.setItem("saferoute_current_user", JSON.stringify(user));
      return { user, token: cred.user.accessToken || "token" };
    } catch (err) {
      if (err.code !== "auth/invalid-api-key") throw err;
    }
  }

  // Fallback demo/local login
  const user = {
    uid: `local_${Date.now()}`,
    email,
    displayName: email.split("@")[0].replace(/[._]/g, " "),
    emergencyContact: "+91 98450 11223",
  };
  localStorage.setItem("saferoute_current_user", JSON.stringify(user));
  return { user, token: "local_token" };
}

export async function logout() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {}
  }
  localStorage.removeItem("saferoute_current_user");
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("saferoute_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
