import api from "./axios";

// ==================== AI Analysis ====================

export const analyzeLiveGrievances = () => {
    return api.post("/ai/analyze/live-grievances");
};

export const analyzeAdministration = () => {
    return api.post("/ai/analyze/administration");
};

// ==================== AI Report ====================

export const downloadGrievanceReport = () => {
    return api.post(
        "/ai/report/grievances",
        {},
        {
            responseType: "blob",
        }
    );
};