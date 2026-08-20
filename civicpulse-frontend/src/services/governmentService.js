import api from "../api/axios";

// Get all government services
export const getAllServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

// Get active government services
export const getActiveServices = async () => {
  const response = await api.get("/services/active");
  return response.data;
};

// Get services by department
export const getServicesByDepartment = async (departmentId) => {
  const response = await api.get(
    `/services/department/${departmentId}`
  );

  return response.data;
};

// Create service
export const createService = async (service) => {
  const response = await api.post(
    "/services",
    service
  );

  return response.data;
};

// Update service
export const updateService = async (id, service) => {
  const response = await api.put(
    `/services/${id}`,
    service
  );

  return response.data;
};

// Toggle service
export const toggleService = async (id) => {
  const response = await api.put(
    `/services/${id}/toggle`
  );

  return response.data;
};

// Delete service
export const deleteService = async (id) => {
  const response = await api.delete(
    `/services/${id}`
  );

  return response.data;
};

export const getServiceById = async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
};