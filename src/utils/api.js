/**
 * API Helper for Studegram Portal
 */

export function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('partner_token');
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(endpoint, options = {}) {
  const headers = getAuthHeaders(options.headers || {});
  
  // Detect if body is FormData (e.g. for uploads), in which case we let the browser set the Content-Type with the boundary
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type'] && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'Network response was not ok' };
    }
    
    const error = new Error(errorData.message || 'API request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}
