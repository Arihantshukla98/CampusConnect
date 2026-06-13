import api from './axiosInstance';

export const getMaterials = async (params = {}) => {
  const res = await api.get('/materials', { params });
  return res.data;
};

export const uploadMaterial = async (formData) => {
  const res = await api.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getMaterial = async (id) => {
  const res = await api.get(`/materials/${id}`);
  return res.data;
};

export const downloadMaterial = async (id) => {
  const res = await api.post(`/materials/${id}/download`);
  return res.data;
};

export const deleteMaterial = async (id) => {
  const res = await api.delete(`/materials/${id}`);
  return res.data;
};
