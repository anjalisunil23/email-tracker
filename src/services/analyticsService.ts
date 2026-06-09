import api from "./api";

export const getDashboardStats = () => api.get("/analytics/dashboard");
export const getEmailAnalytics = (id: string) => api.get(`/analytics/email/${id}`);
export const getTimeseries = () => api.get("/analytics/timeseries");
export const getDeviceBreakdown = () => api.get("/analytics/devices");
export const getRecentActivity = () => api.get("/analytics/recent-activity");
export const getTopEmails = () => api.get("/analytics/top-emails");
