import api from './api';

export const getSettings = () => api.get('/settings');
export const updateSettings = (data: { smtpEmail?: string; smtpPassword?: string }) => api.post('/settings', data);
