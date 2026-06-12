import { apiRequest } from "./api";

export function registerUser(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyOtp(payload) {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProfile(payload, token) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  return apiRequest("/auth/profile", {
    method: "PATCH",
    body: formData,
    token,
  });
}
