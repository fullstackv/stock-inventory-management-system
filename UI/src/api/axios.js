import axios from "axios";

// Centralized axios instance so the API base URL and credentials
// behavior are defined once instead of being repeated (and risking
// typos/drift) in every page component.
//
// In production VITE_API_URL should be set to "/api" (a same-origin,
// relative path proxied by netlify.toml to the Vercel backend) rather
// than the backend's own domain directly - see the comment in
// netlify.toml for why. Locally there's no proxy, so it falls back to
// hitting the local backend port directly.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

export default api;