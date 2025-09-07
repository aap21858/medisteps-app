import axios from "axios";
import { clearToken, getToken } from "./authContext";

const apiClient = axios.create({
  baseURL: (typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL) ||
  // default
  "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearToken();
      localStorage.removeItem("token"); // clear invalid token
      // window.location.href = "/login";  // redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
