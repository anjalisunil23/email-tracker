import api from "./api";

export const register = (userData: { name: string; email: string; password: string }) =>
  api.post("/auth/register", userData);

export const login = (userData: { email: string; password: string; rememberMe?: boolean }) =>
  api.post("/auth/login", userData);

export const getProfile = () => api.get("/auth/profile");

export const updateProfile = (data: { name?: string; email?: string }) =>
  api.put("/auth/profile", data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  api.post("/auth/change-password", data);
