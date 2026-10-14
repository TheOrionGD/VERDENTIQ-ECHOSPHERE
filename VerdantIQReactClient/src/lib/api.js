/**
 * Unified API Client connecting to the pure JS Express backend.
 */
export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request error on ${endpoint}:`, error);
    throw error;
  }
}
