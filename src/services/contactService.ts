import api from './api';

export const getContacts = () => api.get('/contacts');
export const createContact = (data: { name: string; email: string; company?: string }) => api.post('/contacts', data);
export const deleteContact = (id: string) => api.delete(`/contacts/${id}`);
