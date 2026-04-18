import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8080";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true
});

// Axios Interceptor
// Every time an API call is made, this pauses it, grabs the token from local storage, 
// attaches it to the headers, and sends it on its way!
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // auth.ts already saves this!
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_API || "http://localhost:8000"
});