import officerApi from "../api/officerAxios";

// Register Officer
export const registerOfficer = async (officer) => {
  const response = await officerApi.post("/officers", officer);
  return response.data;
};

// Get All Officers
export const getAllOfficers = async () => {
  const response = await officerApi.get("/officers");
  return response.data;
};

// Delete Officer
export const deleteOfficer = async (id) => {
  return await officerApi.delete(`/officers/${id}`);
};

// Get Officer By Officer ID
export const getOfficerByOfficerId = async (officerId) => {
  const response = await officerApi.get(
    `/officers/officerId/${officerId}`
  );
  return response.data;
};

// Get Officers By Department
export const getOfficersByDepartment = async (department) => {
  const response = await officerApi.get(
    `/officers/department/${department}`
  );
  return response.data;
};

// Update Officer
export const updateOfficer = async (id, officer) => {
  const response = await officerApi.put(
    `/officers/${id}`,
    officer
  );
  return response.data;
};