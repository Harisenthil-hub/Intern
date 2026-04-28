// src/modules/dispatch/services/dispatchService.js
import { dispatchAPI } from "../../../services/api";

export async function fetchDispatches() {
  return dispatchAPI.getAll();
}

export async function saveDispatch(formData, editId) {
  const payload = { ...formData, status: "draft" };
  if (editId) return dispatchAPI.update(editId, payload);
  return dispatchAPI.create(payload);
}

export async function postDispatch(formData, editId) {
  const payload = { ...formData, status: "posted" };
  if (editId) {
    await dispatchAPI.update(editId, payload);
    return dispatchAPI.post(editId);
  }
  const created = await dispatchAPI.create(payload);
  return dispatchAPI.post(created._id);
}
