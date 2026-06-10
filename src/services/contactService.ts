import api from "./api";

export const getContacts = () => api.get("/contacts");
export const createContact = (data: { name: string; email: string; company?: string }) =>
  api.post("/contacts", data);
export const updateContact = (
  id: string,
  data: { name?: string; email?: string; company?: string },
) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id: string) => api.delete(`/contacts/${id}`);

export const importContactsCsv = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/contacts/import", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
