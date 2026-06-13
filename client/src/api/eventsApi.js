import api from './axiosInstance';

export const getEvents = async (params = {}) => {
  const res = await api.get('/events', { params });
  return res.data;
};

export const createEvent = async (formData) => {
  const res = await api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getEvent = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const updateEvent = async (id, formData) => {
  const res = await api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

export const toggleRSVP = async (id) => {
  const res = await api.post(`/events/${id}/rsvp`);
  return res.data;
};

export const getEventAttendees = async (id) => {
  const res = await api.get(`/events/${id}/attendees`);
  return res.data;
};
