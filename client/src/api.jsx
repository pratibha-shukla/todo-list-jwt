const BASE_URL = 'http://localhost:3000';

export async function apiFetch(path, options = {}) {
  // This line ensures there is always exactly one slash between URL and Path
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: { 
        'Content-Type': 'application/json', 
        ...(options.headers || {}) 
      },
      body: options.body,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Server Error" }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  } catch (err) {
    // If it's a network error, provide a clearer message
    if (err.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Is your backend running on port 3000?");
    }
    throw err;
  }
}

