import axios from "axios";

// Centralized axios instance so the API base URL and credentials
// behavior are defined once instead of being repeated (and risking
// typos/drift) in every page component.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

export default api;