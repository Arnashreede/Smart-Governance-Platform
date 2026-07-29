import api from "./axios";

export const getAllSchemes = () => api.get("/welfare");

export const getScheme = (id) => api.get(`/welfare/${id}`);

export const createScheme = (data) => api.post("/welfare", data);

export const updateScheme = (id, data) =>
    api.put(`/welfare/${id}`, data);

export const deleteScheme = (id) =>
    api.delete(`/welfare/${id}`);

export const getDashboard = () =>
    api.get("/welfare/dashboard");

export const getReports = () =>
    api.get("/reports");