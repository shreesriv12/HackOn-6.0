export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
