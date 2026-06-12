import "./App.css";
import { Layout } from "./components/Layout";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { BuyerDashboardPage } from "./pages/BuyerDashboardPage";
import { CreateListingPage } from "./pages/CreateListingPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { OtpPage } from "./pages/OtpPage";
import { ProductBrowsePage } from "./pages/ProductBrowsePage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { SellerDashboardPage } from "./pages/SellerDashboardPage";
import { SellerListingsPage } from "./pages/SellerListingsPage";
import { useAppStore } from "./store/useAppStore";

function App() {
  const { notice, setView, view } = useAppStore();

  return (
    <Layout>
      {view === "home" && <HomePage onSignup={() => setView("register")} onLogin={() => setView("login")} />}
      {notice && <div className="notice">{notice}</div>}
      {view === "register" && <RegisterPage />}
      {view === "otp" && <OtpPage />}
      {view === "login" && <LoginPage />}
      {view === "profile" && <ProfilePage />}
      {view === "buyerDashboard" && <BuyerDashboardPage />}
      {view === "sellerDashboard" && <SellerDashboardPage />}
      {view === "adminDashboard" && <AdminDashboardPage />}
      {view === "createListing" && <CreateListingPage />}
      {view === "sellerListings" && <SellerListingsPage />}
      {view === "browseProducts" && <ProductBrowsePage />}
    </Layout>
  );
}

export default App;
