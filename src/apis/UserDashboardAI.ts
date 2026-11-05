import axios from "axios";
import { BASE_URL_USER } from "./config";

const UserDashboardAI = axios.create({
  baseURL: BASE_URL_USER,
});

export default UserDashboardAI;
