import axios from "axios";
import { clearStoredAuth, getStoredToken } from "./auth";
import { BASE_URL_USER } from "./config";

const UserDashboardAI = axios.create({
  baseURL: BASE_URL_USER,
});

// dashboard-user identifies the caller from `Authorization: Bearer <jwt>`.
// Attach the stored token to every request that does not set its own header.
UserDashboardAI.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Tokens live for 1 hour (JWT_LIFESPAN). Once the backend rejects the token,
// drop the stored session and go back to the sign-in screen.
UserDashboardAI.interceptors.response.use(undefined, (error) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    getStoredToken()
  ) {
    clearStoredAuth();
    window.location.assign("/authenticate");
  }
  return Promise.reject(error);
});

export default UserDashboardAI;
