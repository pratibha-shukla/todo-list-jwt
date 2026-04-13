

const BASE_URL = 'http://localhost:3000';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Ensure the token is attached if it exists
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Handle Unauthorized (401) specifically
  if (response.status === 401) {
    localStorage.removeItem('token'); // Clear expired token
    window.location.href = '/login';   // Redirect to login
    throw new Error('Session expired. Please login again.');
  }

  // Improved error handling to see the server's error message
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Action failed: ${response.status}`);
  }

  // Handle 204 No Content or empty responses (like on DELETE)
  if (response.status === 204) {
    return null;
  }

  // Safely parse JSON
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export default apiFetch;


