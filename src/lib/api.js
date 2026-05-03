const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const API_ROOTS = [
  configuredBaseUrl || "/api/v1",
  "http://127.0.0.1:8000/api/v1",
].filter((root, index, roots) => root && roots.indexOf(root) === index);

const RETRYABLE_STATUSES = new Set([502, 503, 504]);

/**
 * Fetches from the API and auto-parses JSON.
 * - Returns parsed JSON data for successful responses.
 * - Throws an Error with the server message for non-2xx responses.
 * - Pass `{ raw: true }` in options to get the raw Response object (used by stores that check response.ok themselves).
 */
export async function fetchApi(path, options = {}) {
  const { raw, ...fetchOptions } = options;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let lastError = null;

  // Attach Content-Type header for requests with a body if not already set
  if (fetchOptions.body && !fetchOptions.headers?.["Content-Type"]) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    };
  }

  for (const root of API_ROOTS) {
    try {
      const response = await fetch(`${root}${normalizedPath}`, fetchOptions);
      if (RETRYABLE_STATUSES.has(response.status)) {
        lastError = new Error(`API request failed with status ${response.status}`);
        continue;
      }

      // If caller wants raw Response (stores that handle .ok / .json() themselves)
      if (raw) return response;

      // Auto-parse JSON
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          (typeof data === "object" && (data?.detail || data?.message)) ||
          `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Failed to connect to API");
}
