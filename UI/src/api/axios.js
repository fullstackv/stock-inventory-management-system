import axios from "axios";

// Centralized axios instance so the API base URL and credentials
// behavior are defined once instead of being repeated (and risking
// typos/drift) in every page component.
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default api;
