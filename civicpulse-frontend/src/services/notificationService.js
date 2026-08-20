import notificationApi from "../api/notificationAxios";

// ============================================================
// GET NOTIFICATIONS FOR LOGGED-IN CITIZEN
// ============================================================

export const getNotifications = async (citizenId) => {
    if (!citizenId) {
        throw new Error("Citizen ID is required.");
    }

    const response = await notificationApi.get(
        `/notifications/citizen/${citizenId}`
    );

    return response.data;
};


// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================

export const markAsRead = async (id) => {
    const response = await notificationApi.put(
        `/notifications/${id}/read`
    );

    return response.data;
};


// ============================================================
// MARK ALL CITIZEN NOTIFICATIONS AS READ
// ============================================================

export const markAllAsRead = async (citizenId) => {
    if (!citizenId) {
        throw new Error("Citizen ID is required.");
    }

    const response = await notificationApi.put(
        `/notifications/citizen/${citizenId}/read-all`
    );

    return response.data;
};