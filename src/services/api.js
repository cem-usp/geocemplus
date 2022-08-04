import axios from "axios";

const api = axios.create({
  baseURL: "http://200.144.244.238/api",
});

export default api;
