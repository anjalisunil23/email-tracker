import api from "./api";

export const getTemplates = () => api.get("/templates");
export const createTemplate = (data: { name: string; subject: string; content: string }) =>
  api.post("/templates", data);
export const updateTemplate = (
  id: string,
  data: { name?: string; subject?: string; content?: string },
) => api.put(`/templates/${id}`, data);
export const deleteTemplate = (id: string) => api.delete(`/templates/${id}`);
