/**
 * API service for Cylinder Movement module.
 * Base URL: /api/v1/cylinder-movement
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const MOVEMENT_URL = `${BASE_URL}/api/v1/cylinder-movement`;

/** Fetch all movement entries */
export async function fetchMovements() {
    const res = await fetch(`${MOVEMENT_URL}/`);
    if (!res.ok) throw new Error('Failed to fetch movement entries.');
    return res.json();
}

/** Create a new movement entry (POST) */
export async function saveMovement(data) {
    const res = await fetch(`${MOVEMENT_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to save movement entry.');
    }
    return res.json();
}

/** Update an existing movement entry (PUT) */
export async function updateMovement(id, data) {
    const res = await fetch(`${MOVEMENT_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update movement entry.');
    }
    return res.json();
}
