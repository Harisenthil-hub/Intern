const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const API_ROOTS = [
  configuredBaseUrl || "/api/v1",
  "http://127.0.0.1:8000/api/v1",
].filter((root, index, roots) => root && roots.indexOf(root) === index);

const RETRYABLE_STATUSES = new Set([502, 503, 504]);

export async function fetchApi(path, options) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let lastError = null;

  for (const root of API_ROOTS) {
    try {
      const response = await fetch(`${root}${normalizedPath}`, options);
      if (RETRYABLE_STATUSES.has(response.status)) {
        lastError = new Error(`API request failed with status ${response.status}`);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Failed to connect to API");
}
