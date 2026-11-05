import axios from "axios";
import { BASE_URL_SECURITY } from "./config";

const SecurityDashboardAI = axios.create({
  baseURL: BASE_URL_SECURITY,
});

export default SecurityDashboardAI;
