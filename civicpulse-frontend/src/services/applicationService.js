import axios from "axios";

const applicationApi = axios.create({
    baseURL: "http://localhost:8088"
    // Change this port if your service is running on another port
});

export const submitApplication = async (application) => {
    const response = await applicationApi.post(
        "/applications",
        application
    );
    return response.data;
};

export const getCitizenApplications = async (citizenId) => {
    const response = await applicationApi.get(
        `/applications/citizen/${citizenId}`
    );
    return response.data;
};

export const getAllApplications = async () => {
    const response = await applicationApi.get("/applications");
    return response.data;
};
export const getDocumentPreviewUrl = (documentId) => {
    return `http://localhost:8088/applications/document/${documentId}`;
};

export const approveApplication = async (id) => {
    const response = await applicationApi.put(
        `/applications/${id}/approve`
    );
    return response.data;
};

export const rejectApplication = async (id, remarks) => {
    const response = await applicationApi.put(
        `/applications/${id}/reject`,
        { remarks }
    );
    return response.data;
};
export const verifyApplication = async (id) => {

    const response = await applicationApi.put(
        `/applications/${id}/verify`
    );

    return response.data;
};
export const getCertificate = async (id) => {

    const response = await applicationApi.get(
        `/applications/${id}/certificate`
    );

    return response.data;
};
export const getApplicationsByStatus = async (status) => {

    const response = await applicationApi.get(
        `/applications/status/${status}`
    );

    return response.data;
};
export const uploadDocument = async (id, file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await applicationApi.post(
        `/applications/${id}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};
export const getApplicationsByCitizen = getCitizenApplications;