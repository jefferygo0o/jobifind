import axios from 'axios';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

// Set up Adzuna API details
const ADZUNA_APP_ID = process.env.REACT_APP_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.REACT_APP_ADZUNA_APP_KEY;
const ADZUNA_API_URL = "https://api.adzuna.com/v1/api/jobs/gb/search/1";

// Initialize Firebase
const db = getDatabase();
const storage = getStorage();

/**
 * Fetch job data from Adzuna API based on filters
 */
export const fetchJobData = async (filters = {}) => {
  try {
    // Prepare query parameters for Adzuna API
    const queryParams = {
      ...filters,
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
    };

    // Request to fetch jobs from Adzuna API
    const response = await axios.get(ADZUNA_API_URL, {
      params: queryParams,
    });

    return response.data.results; // Return the list of job results from the API
  } catch (error) {
    alert(error);
    console.error('Error fetching jobs from Adzuna:', error);
    return [];
  }
};

/**
 * Add a job to the user's applied jobs list in Firebase Realtime Database
 */
export const applyForJob = async (jobId) => {
  const user = getAuth().currentUser;

  if (!user) {
    console.log("User not authenticated.");
    return;
  }

  try {
    const userRef = ref(db, 'users/' + user.uid + '/appliedJobs/' + jobId);
    await set(userRef, {
      jobId,
      appliedAt: Date.now(),
    });

    console.log("Job application recorded.");
  } catch (error) {
    console.error('Error applying for job:', error);
  }
};

/**
 * Get the user's applied jobs from Firebase
 */
export const getAppliedJobs = async () => {
  const user = getAuth().currentUser;

  if (!user) {
    console.log("User not authenticated.");
    return [];
  }

  try {
    const userRef = ref(db, 'users/' + user.uid + '/appliedJobs');
    const snapshot = await get(userRef);
    const appliedJobs = snapshot.val() || {};
    return Object.keys(appliedJobs).map(key => appliedJobs[key]);
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return [];
  }
};

/**
 * Upload a resume to Firebase Storage
 */
export const uploadResume = async (file) => {
  const user = getAuth().currentUser;

  if (!user) {
    console.log("User not authenticated.");
    return;
  }

  try {
    const fileRef = storageRef(storage, 'resumes/' + user.uid + '/' + file.name);
    await uploadBytes(fileRef, file);

    console.log("Resume uploaded successfully.");
  } catch (error) {
    console.error('Error uploading resume:', error);
  }
};

/**
 * Get the user's profile from Firebase Realtime Database
 */
export const getUserProfile = async () => {
  const user = getAuth().currentUser;

  if (!user) {
    console.log("User not authenticated.");
    return null;
  }

  try {
    const userRef = ref(db, 'users/' + user.uid);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Update user profile in Firebase Realtime Database
 */
export const updateUserProfile = async (profileData) => {
  const user = getAuth().currentUser;

  if (!user) {
    console.log("User not authenticated.");
    return;
  }

  try {
    const userRef = ref(db, 'users/' + user.uid);
    await set(userRef, profileData);

    console.log("User profile updated.");
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};
