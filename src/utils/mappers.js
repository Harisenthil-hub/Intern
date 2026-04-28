// src/utils/mappers.js
export function statusLabel(status) {
  if (status === "posted") return "Posted";
  if (status === "draft")  return "Saved";
  return status;
}

export function statusClass(status) {
  if (status === "posted") return "badge-table-posted";
  if (status === "draft")  return "badge-table-draft";
  return "badge-table-default";
}
