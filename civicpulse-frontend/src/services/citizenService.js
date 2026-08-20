import citizenApi from "../api/citizenAxios";

// Register Citizen
export const registerCitizen = async (citizen) => {
  const response = await citizenApi.post("/citizens", citizen);
  return response.data;
};

// Get All Citizens
export const getAllCitizens = async () => {
  const response = await citizenApi.get("/citizens");
  return response.data;
};

// Get Citizen By ID
export const getCitizenById = async (id) => {
  const response = await citizenApi.get(`/citizens/${id}`);
  return response.data;
};



// Delete Citizen
export const deleteCitizen = async (id) => {
  const response = await citizenApi.delete(`/citizens/${id}`);
  return response.data;
};