import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081", // replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token"); // clear invalid token
      // window.location.href = "/login";  // redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
