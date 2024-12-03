import axios from "axios";

const BASE_URL = "https://api.adzuna.com/v1/api/jobs/gb/search/1";

const APP_ID = process.env.REACT_APP_ADZUNA_APP_ID; // Loaded from .env
const APP_KEY = process.env.REACT_APP_ADZUNA_APP_KEY; // Loaded from .env

export const searchJobs = async (query, location) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: query, // Job keyword(s)
        where: location, // Location
        results_per_page: 10, // Adjust as needed
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
