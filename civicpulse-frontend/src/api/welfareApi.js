import api from "./axios";

// ==================== Welfare Schemes ====================

export const getAllSchemes = () => {
    return api.get("/welfare");
};

export const getScheme = (id) => {
    return api.get(`/welfare/${id}`);
};

export const createScheme = (data) => {
    return api.post("/welfare", data);
};

export const updateScheme = (id, data) => {
    return api.put(`/welfare/${id}`, data);
};

export const deleteScheme = (id) => {
    return api.delete(`/welfare/${id}`);
};

// ==================== Citizen Applications ====================

export const applyScheme = (formData) => {
    return api.post("/applications", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getCitizenApplications = (citizenId) => {
    return api.get(`/applications/citizen/${citizenId}`);
};

export const getApplicationById = (id) => {
    return api.get(`/applications/${id}`);
};

// ==================== Admin / Officer ====================

// ==================== Admin / Officer ====================

export const getAllApplications = () => {
    return api.get("/applications");
};

export const approveApplication = (id) => {
    return api.put(`/applications/${id}/approve`);
};

export const rejectApplication = (id, reason) => {
    return api.put(`/applications/${id}/reject`, null, {
        params: {
            reason,
        },
    });
};

// ==================== Dashboard ====================

export const getDashboard = () => {
    return api.get("/welfare/dashboard");
};
export const getAllApplications = getApplications;
export const getApplicationsByDepartment = (department) =>
    api.get(
        `/applications/department/${encodeURIComponent(department)}`
    );