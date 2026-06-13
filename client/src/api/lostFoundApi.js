import api from './axiosInstance';

export const getLostFoundItems = async (params = {}) => {
  const res = await api.get('/lostfound', { params });
  return res.data;
};

export const createLostFoundItem = async (formData) => {
  const res = await api.post('/lostfound', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getLostFoundItem = async (id) => {
  const res = await api.get(`/lostfound/${id}`);
  return res.data;
};

export const claimItem = async (id) => {
  const res = await api.put(`/lostfound/${id}/claim`);
  return res.data;
};

export const resolveItem = async (id) => {
  const res = await api.put(`/lostfound/${id}/resolve`);
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await api.delete(`/lostfound/${id}`);
  return res.data;
};
