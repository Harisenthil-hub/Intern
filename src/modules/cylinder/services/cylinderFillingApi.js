/**
 * API service for Cylinder Filling module.
 * Base URL: /api/v1/cylinder-filling
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const FILLING_URL = `${BASE_URL}/api/v1/cylinder-filling`;

/** Fetch all filling entries */
export async function fetchFillings() {
    const res = await fetch(`${FILLING_URL}/`);
    if (!res.ok) throw new Error('Failed to fetch filling entries.');
    return res.json();
}

/** Create a new filling entry (POST) */
export async function saveFilling(data) {
    const res = await fetch(`${FILLING_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to save filling entry.');
    }
    return res.json();
}

/** Update an existing filling entry (PUT) */
export async function updateFilling(id, data) {
    const res = await fetch(`${FILLING_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update filling entry.');
    }
    return res.json();
}
