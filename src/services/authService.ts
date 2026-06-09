import api from './api';

export const register = (userData: any) => api.post('/auth/register', userData);
export const login = (userData: any) => api.post('/auth/login', userData);
export const getProfile = () => api.get('/auth/profile');
