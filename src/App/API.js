import axios from "axios";

const api = axios.create({
  baseURL: "http://ip-api.com",
  
});

export default api;