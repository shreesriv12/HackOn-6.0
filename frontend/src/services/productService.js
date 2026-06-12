import { apiRequest } from "./api";

export function createProduct(payload, token) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "images") {
      Array.from(value || []).forEach((file) => formData.append("images", file));
      return;
    }

    if (value) formData.append(key, value);
  });

  return apiRequest("/products", {
    method: "POST",
    body: formData,
    token,
  });
}

export function createListing(productId, payload, token) {
  return apiRequest(`/products/${productId}/list`, {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export function getMyListings(token) {
  return apiRequest("/listings/my", { token });
}

export function getListings() {
  return apiRequest("/listings");
}
