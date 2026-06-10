import api from "./api";

export type NotificationPrefs = {
  opens: boolean;
  clicks: boolean;
  digest: boolean;
  product: boolean;
};

export const getSettings = () => api.get("/settings");

export const updateSettings = (data: {
  smtpEmail?: string;
  smtpPassword?: string;
  notificationPrefs?: Partial<NotificationPrefs>;
}) => api.post("/settings", data);
