import axios from "axios";

// const BASE_URL_USER = "http://146.190.100.81:8081/";
const BASE_URL_USER = "http://localhost:8081/";

const UserDashboardAI = axios.create({
  baseURL: BASE_URL_USER,
});

export default UserDashboardAI;
