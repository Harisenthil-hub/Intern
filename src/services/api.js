// src/services/api.js
// All API calls from React → FastAPI → Supabase

const BASE_URL = "http://localhost:8000/api/v1";

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

export const dispatchAPI = {
  getAll: ()         => request("GET",   "/dispatch/"),
  create: (data)     => request("POST",  "/dispatch/", data),
  update: (id, data) => request("PUT",   `/dispatch/${id}`, data),
  post:   (id)       => request("PATCH", `/dispatch/${id}/post`),
};

export const returnAPI = {
  getAll: ()         => request("GET",   "/return/"),
  create: (data)     => request("POST",  "/return/", data),
  update: (id, data) => request("PUT",   `/return/${id}`, data),
  post:   (id)       => request("PATCH", `/return/${id}/post`),
};

export const trackerAPI = {
  getAll: ()         => request("GET",   "/tracker/"),
  create: (data)     => request("POST",  "/tracker/", data),
  update: (id, data) => request("PUT",   `/tracker/${id}`, data),
  post:   (id)       => request("PATCH", `/tracker/${id}/post`),
};