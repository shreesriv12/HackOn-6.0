import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";

export function Layout({ children }) {
  const { token, dashboard, dashboardMode, logout, setView } = useAppStore();

  const navTitle = useMemo(() => {
    if (!token) return "Hello, sign in";
    if (dashboardMode === "admin") return "Admin";
    if (dashboardMode === "seller") return "Seller";
    return "Buyer";
  }, [dashboardMode, token]);

  return (
    <div className="amazon-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")}>
          amazon<span>.in</span>
        </button>
        <div className="location">Delivering to {dashboard?.user.location || "your area"}</div>
        <div className="search">
          <select aria-label="Category">
            <option>All</option>
            <option>Buy Again</option>
            <option>Sell</option>
            <option>Returns</option>
          </select>
          <input placeholder="Search Amazon.in" />
          <button type="button">Search</button>
        </div>
        <button className="nav-action" onClick={() => setView(token ? getDashboardView(dashboardMode) : "login")}>
          {navTitle}
        </button>
        <button className="nav-action" onClick={token ? logout : () => setView("register")}>
          {token ? "Logout" : "Sign up"}
        </button>
      </header>

      <nav className="category-strip">
        <span>All</span>
        <span>Fresh</span>
        <span>Sell</span>
        <span>Bestsellers</span>
        <span>Today's Deals</span>
        <span>Mobiles</span>
        <span>Fashion</span>
        <span>Home & Kitchen</span>
        <span>Returns</span>
      </nav>

      <main>{children}</main>
    </div>
  );
}

function getDashboardView(mode) {
  if (mode === "admin") return "adminDashboard";
  if (mode === "seller") return "sellerDashboard";
  return "buyerDashboard";
}
