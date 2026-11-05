// Backend base URLs. Override per environment via .env files
// (e.g. VITE_SECURITY_API_URL=http://146.190.100.81:8080/).
export const BASE_URL_SECURITY: string =
  import.meta.env.VITE_SECURITY_API_URL ?? "http://localhost:8080/";

export const BASE_URL_USER: string =
  import.meta.env.VITE_USER_API_URL ?? "http://localhost:8081/";
