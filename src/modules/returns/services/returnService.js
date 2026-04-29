// src/modules/returns/services/returnService.js
import { returnAPI } from "../../../services/api";

export async function fetchReturns() {
  return returnAPI.getAll();
}

export async function saveReturn(formData, editId) {
  const payload = { ...formData, status: "draft" };
  if (editId) return returnAPI.update(editId, payload);
  return returnAPI.create(payload);
}

export async function postReturn(formData, editId) {
  const payload = { ...formData, status: "posted" };
  if (editId) {
    await returnAPI.update(editId, payload);
    return returnAPI.post(editId);
  }
  const created = await returnAPI.create(payload);
  return returnAPI.post(created._id);
}
