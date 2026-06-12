import { create } from "zustand";
import { getDashboard } from "../services/dashboardService";
import { loginUser, registerUser, updateProfile, verifyOtp } from "../services/authService";
import { createListing, createProduct, getListings, getMyListings } from "../services/productService";

const storedToken = localStorage.getItem("pwsc_token") || "";
const storedMode = localStorage.getItem("pwsc_mode") || "buyer";

export const useAppStore = create((set, get) => ({
  view: "home",
  token: storedToken,
  user: null,
  dashboard: null,
  listings: [],
  myListings: [],
  createdProduct: null,
  dashboardMode: storedMode,
  pendingEmail: localStorage.getItem("pwsc_pending_email") || "",
  notice: "",
  loading: false,

  setView: (view) => set({ view }),
  setNotice: (notice) => set({ notice }),

  register: async (form) => {
    set({ loading: true, notice: "" });
    try {
      const data = await registerUser(form);
      localStorage.setItem("pwsc_pending_email", form.email);
      set({
        view: "otp",
        pendingEmail: form.email,
        notice: data.demoOtp ? `Verification code: ${data.demoOtp}` : data.message,
      });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  verifyEmailOtp: async ({ email, otp }) => {
    set({ loading: true, notice: "" });
    try {
      const data = await verifyOtp({ email, otp });
      localStorage.removeItem("pwsc_pending_email");
      saveSession(data.token, data.dashboardMode, data.user);
      set({ view: "profile", pendingEmail: "", notice: "Email verified." });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  login: async (form) => {
    set({ loading: true, notice: "" });
    try {
      const data = await loginUser(form);
      saveSession(data.token, data.dashboardMode, data.user);
      await get().loadDashboard(data.dashboardMode, data.token);
      set({ view: getDashboardView(data.dashboardMode) });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  saveProfile: async (form) => {
    set({ loading: true, notice: "" });
    try {
      const { token, dashboardMode } = get();
      const data = await updateProfile(form, token);
      set({ user: data.user });
      await get().loadDashboard(dashboardMode);
      set({ view: getDashboardView(get().dashboardMode) });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  loadDashboard: async (mode = get().dashboardMode, nextToken = get().token) => {
    const data = await getDashboard(mode, nextToken);
    localStorage.setItem("pwsc_mode", data.mode);
    set({ dashboard: data, dashboardMode: data.mode });
  },

  createProduct: async (form) => {
    set({ loading: true, notice: "" });
    try {
      const data = await createProduct(form, get().token);
      set({ createdProduct: data.product, notice: "Product saved. Add price to publish it." });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  publishListing: async (productId, form) => {
    set({ loading: true, notice: "" });
    try {
      await createListing(productId, form, get().token);
      set({ createdProduct: null, notice: "Listing published.", view: "sellerListings" });
      await get().loadMyListings();
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  loadMyListings: async () => {
    set({ loading: true, notice: "" });
    try {
      const data = await getMyListings(get().token);
      set({ myListings: data.listings, view: "sellerListings" });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  loadListings: async () => {
    set({ loading: true, notice: "" });
    try {
      const data = await getListings();
      set({ listings: data.listings, view: "browseProducts" });
    } catch (error) {
      set({ notice: error.message });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("pwsc_token");
    localStorage.removeItem("pwsc_mode");
    localStorage.removeItem("pwsc_pending_email");
    set({
      token: "",
      user: null,
      dashboard: null,
      listings: [],
      myListings: [],
      createdProduct: null,
      dashboardMode: "buyer",
      pendingEmail: "",
      view: "home",
    });
  },
}));

function saveSession(token, mode, user) {
  localStorage.setItem("pwsc_token", token);
  localStorage.setItem("pwsc_mode", mode);
  useAppStore.setState({ token, dashboardMode: mode, user });
}

function getDashboardView(mode) {
  if (mode === "admin") return "adminDashboard";
  if (mode === "seller") return "sellerDashboard";
  return "buyerDashboard";
}
