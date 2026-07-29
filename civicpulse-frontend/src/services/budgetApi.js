import api from "../api/axios";

export const getAllBudgets = async () => {
    const response = await api.get("/budgets");
    return response.data;
};

export const getBudgetById = async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
};

export const createBudget = async (budget) => {
    const response = await api.post("/budgets", budget);
    return response.data;
};

export const updateBudget = async (id, budget) => {
    const response = await api.put(`/budgets/${id}`, budget);
    return response.data;
};

export const deleteBudget = async (id) => {
    return api.delete(`/budgets/${id}`);
};

export const allocateBudget = async (id, data) => {
    const response = await api.put(`/budgets/${id}/allocate`, data);
    return response.data;
};

export const addExpense = async (id, data) => {
    const response = await api.put(`/budgets/${id}/expense`, data);
    return response.data;
};

export const distributeFunds = async (id, data) => {
    const response = await api.post(`/budgets/${id}/distribute`, data);
    return response.data;
};

export const getDistributions = async (id) => {
    const response = await api.get(`/budgets/${id}/distributions`);
    return response.data;
};

export const getDashboard = async () => {
    const response = await api.get("/budgets/dashboard");
    return response.data;
};