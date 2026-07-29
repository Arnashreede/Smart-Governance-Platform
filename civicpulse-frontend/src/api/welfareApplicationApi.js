import api from "./axios";

export const applyForScheme = (data) =>
    api.post("/applications", data);

export const getApplications = () =>
    api.get("/applications");

export const getCitizenApplications = (id) =>
    api.get(`/applications/citizen/${id}`);

export const approveApplication = (id) =>
    api.put(`/applications/${id}/approve`);

export const rejectApplication = (id) =>
    api.put(`/applications/${id}/reject`);