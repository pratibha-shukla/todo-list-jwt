
const BASE_URL = 'http://localhost:3000';

// Change 'export default async function' to 'export const apiFetch = async'
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
  return response.json();
};

export default apiFetch;


