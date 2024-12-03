import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, remove, get, child } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Check if Firebase is already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

console.log("Firebase initialized:", app.name); // Log app name to confirm initialization

// Authentication functions
export const signup = async (email, password) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

// Firebase database functions for job favorites
export const addFavoriteJob = async (job) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");
  const jobRef = ref(db, `favorites/${userId}/${job.id}`);
  await set(jobRef, job);
};

export const removeFavoriteJob = async (jobId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");
  const jobRef = ref(db, `favorites/${userId}/${jobId}`);
  await remove(jobRef);
};

export const getFavorites = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");
  const snapshot = await get(child(ref(db), `favorites/${userId}`));
  return snapshot.exists() ? snapshot.val() : {};
};

// Export Firebase instances
export const getAuthInstance = () => auth;
export const getDatabaseInstance = () => db;
export const getStorageInstance = () => storage;
