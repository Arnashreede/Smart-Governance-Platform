import api from "../api/certificateAxios";

export const getAllCertificates = async () => {
    const response = await api.get("/certificates");
    return response.data;
};

export const getCertificateById = async (id) => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
};

export const verifyCertificate = async (certificateNumber) => {
    const response = await api.get(`/certificates/verify/${certificateNumber}`);
    return response.data;
};

export const getCertificatesByCitizen = async (citizenId) => {
    const response = await api.get(`/certificates/citizen/${citizenId}`);
    return response.data;
};

export const downloadCertificate = async (id) => {
    const response = await api.get(`/certificates/${id}/download`, {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.download = "certificate.pdf";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};