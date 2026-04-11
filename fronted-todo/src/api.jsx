const BASE_URL = 'http://localhost:3000';

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  
  // 1. Get the token from storage
  const token = localStorage.getItem('token');

  // 2. Add the token to the Headers
  const headers = { 
    'Content-Type': 'application/json', 
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Adds Bearer token
    ...(options.headers || {}) 
  };

  try {
    const response = await fetch(url, {
      ...options,
      method: options.method || 'GET',
      headers: headers, // Use the new headers with token
      body: options.body,
    });

    // 3. If unauthorized (401), clear the bad token
    if (response.status === 401) {
      localStorage.removeItem('token');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Server Error" }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  } catch (err) {
    if (err.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Is your backend running on port 3000?");
    }
    throw err;
  }
}

