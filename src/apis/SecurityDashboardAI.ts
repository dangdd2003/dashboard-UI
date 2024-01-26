import axios from "axios";

// const BASE_URL_SECURITY = "http://146.190.100.81:8080/";
const BASE_URL_SECURITY = "http://localhost:8080/";
const SecurityDashboardAI = axios.create({
  baseURL: BASE_URL_SECURITY,
});

export default SecurityDashboardAI;
