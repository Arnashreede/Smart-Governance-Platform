import api from "./axios";

export const getBeneficiaries = () =>
    api.get("/beneficiaries");

export const getCitizenBeneficiaries = (id) =>
    api.get(`/beneficiaries/citizen/${id}`);

export const issueBenefit = (id) =>
    api.put(`/beneficiaries/${id}/issue`);