import api from "./api";

export const sendEmail = (emailData: {
  recipient: string;
  subject: string;
  content: string;
  cc?: string;
  bcc?: string;
  scheduleAt?: string;
}) => api.post("/email/send", emailData);

export const listEmails = (params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => api.get("/email", { params });

export const getEmail = (id: string) => api.get(`/email/${id}`);

export const getScheduledEmails = () => api.get("/email/scheduled");

export const cancelScheduledEmail = (id: string) => api.delete(`/email/scheduled/${id}`);
