import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001//",
  //   headers: { Authorization: "Bearer YOUR_TOKEN" },
  timeout: 1000,
});
