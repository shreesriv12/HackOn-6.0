import { apiRequest } from "./api";

export function getDashboard(mode, token) {
  return apiRequest(`/dashboard?mode=${mode}`, { token });
}
