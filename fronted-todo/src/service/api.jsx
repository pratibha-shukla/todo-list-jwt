const BASE_URL = 'http://localhost:3000';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) throw new Error('Action failed');

  // FIX: Check for 204 (No Content) or an empty body to prevent crashes
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null; 
  }

  return response.json();
};

export default apiFetch;

