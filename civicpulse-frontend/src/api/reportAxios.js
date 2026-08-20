import axios from "axios";

const reportAxios = axios.create({
  baseURL: "http://localhost:8080/reports",
  headers: {
    "Content-Type": "application/json",
  },
});

reportAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default reportAxios;