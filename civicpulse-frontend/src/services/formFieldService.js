import api from "../api/axios";

export const getFormFields = async (serviceId) => {
  const response = await api.get(
    `/services/${serviceId}/form-fields`
  );

  return response.data;
};

export const addFormField = async (serviceId, field) => {
  const response = await api.post(
    `/services/${serviceId}/form-fields`,
    field
  );

  return response.data;
};

export const updateFormField = async (fieldId, field) => {
  const response = await api.put(
    `/services/form-fields/${fieldId}`,
    field
  );

  return response.data;
};

export const deleteFormField = async (fieldId) => {
  const response = await api.delete(
    `/services/form-fields/${fieldId}`
  );

  return response.data;
};