import grievanceApi from "../api/grievanceAxios";

// Register Complaint
export const registerGrievance = async (grievance) => {
  const response = await grievanceApi.post("/grievances", grievance);
  return response.data;
};

// Admin - View All Complaints
export const getAllGrievances = async () => {
  const response = await grievanceApi.get("/grievances");
  return response.data;
};

// Officer - View Assigned Complaints
export const getOfficerGrievances = async (officerId) => {
  const response = await grievanceApi.get(
    `/grievances/officer/${officerId}`
  );
  return response.data;
};

// Citizen - View Own Complaints
export const getCitizenGrievances = async (citizenId) => {
  const response = await grievanceApi.get(
    `/grievances/citizen/${citizenId}`
  );
  return response.data;
};