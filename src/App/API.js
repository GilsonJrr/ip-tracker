import axios from "axios";

const api = axios.create({
  // baseURL: "http://ip-api.com",
  baseURL: "https://geo.ipify.org/api/v2/"
});

export default api;