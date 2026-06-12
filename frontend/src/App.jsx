import { useMemo, useState } from "react";
import "./App.css";

const initialRegisterForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
  adminCode: "",
};

const initialProfileForm = {
  location: "",
  clothingSize: "",
  shoeSize: "",
  preferences: "",
  sustainabilityInterests: "",
  profilePhoto: null,
};

function App() {
  const [view, setView] = useState("home");
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", dashboardMode: "buyer" });
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(localStorage.getItem("pwsc_token") || "");
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardMode, setDashboardMode] = useState(localStorage.getItem("pwsc_mode") || "buyer");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const navTitle = useMemo(() => {
    if (!token) return "Hello, sign in";
    if (dashboardMode === "admin") return "Admin";
    if (dashboardMode === "seller") return "Seller";
    return "Buyer";
  }, [dashboardMode, token]);

  async function api(path, options = {}) {
    const response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(registerForm),
      });
      setNotice(data.demoOtp ? `Verification code: ${data.demoOtp}` : data.message);
      setView("otp");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      const data = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: registerForm.email, otp }),
      });
      saveSession(data.token, data.dashboardMode, data.user);
      setNotice("Email verified.");
      setView("profile");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      saveSession(data.token, data.dashboardMode, data.user);
      await loadDashboard(data.dashboardMode, data.token);
      setView("dashboard");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfile(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      const formData = new FormData();
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      const data = await api("/auth/profile", {
        method: "PATCH",
        body: formData,
      });
      setUser(data.user);
      await loadDashboard(dashboardMode);
      setView("dashboard");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(mode = dashboardMode, nextToken = token) {
    const response = await fetch(`/api/dashboard?mode=${mode}`, {
      headers: { Authorization: `Bearer ${nextToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not load dashboard");
    setDashboard(data);
    setDashboardMode(data.mode);
    localStorage.setItem("pwsc_mode", data.mode);
  }

  async function switchMode(mode) {
    setLoading(true);
    setNotice("");
    try {
      await loadDashboard(mode);
      setView("dashboard");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  function saveSession(nextToken, mode, nextUser) {
    localStorage.setItem("pwsc_token", nextToken);
    localStorage.setItem("pwsc_mode", mode);
    setToken(nextToken);
    setDashboardMode(mode);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem("pwsc_token");
    localStorage.removeItem("pwsc_mode");
    setToken("");
    setUser(null);
    setDashboard(null);
    setDashboardMode("buyer");
    setView("home");
  }

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
        <button className="nav-action" onClick={() => setView(token ? "dashboard" : "login")}>
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

      <main>
        {view === "home" && <Home onSignup={() => setView("register")} onLogin={() => setView("login")} />}
        {notice && <div className="notice">{notice}</div>}
        {view === "register" && (
          <RegisterForm form={registerForm} setForm={setRegisterForm} onSubmit={handleRegister} loading={loading} />
        )}
        {view === "otp" && (
          <OtpForm email={registerForm.email} otp={otp} setOtp={setOtp} onSubmit={handleOtp} loading={loading} />
        )}
        {view === "login" && (
          <LoginForm form={loginForm} setForm={setLoginForm} onSubmit={handleLogin} loading={loading} />
        )}
        {view === "profile" && (
          <ProfileForm form={profileForm} setForm={setProfileForm} onSubmit={handleProfile} loading={loading} />
        )}
        {view === "dashboard" && (
          <Dashboard
            dashboard={dashboard}
            loading={loading}
            mode={dashboardMode}
            onRefresh={() => loadDashboard(dashboardMode)}
            onSwitchMode={switchMode}
          />
        )}
      </main>
    </div>
  );
}

function Home({ onSignup, onLogin }) {
  return (
    <>
      <section className="hero">
        <div>
          <p>Amazon Circular</p>
          <h1>Shop, sell, and return smarter.</h1>
          <span>Use one account for buying and selling. Admins manage operations separately.</span>
        </div>
        <div className="hero-actions">
          <button onClick={onLogin}>Sign in</button>
          <button className="secondary" onClick={onSignup}>Create account</button>
        </div>
      </section>
      <section className="deal-grid">
        <InfoCard title="Buyer dashboard" text="Orders, matches, returns, rewards, and nearby demand." />
        <InfoCard title="Seller dashboard" text="Listings, return reasons, recovered revenue, and insights." />
        <InfoCard title="Admin panel" text="Users, listings, returns, rewards, partners, and reports." />
        <InfoCard title="One email" text="Use the same email to open buyer or seller dashboards." />
      </section>
    </>
  );
}

function InfoCard({ title, text }) {
  return (
    <article className="deal-card">
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

function RegisterForm({ form, setForm, onSubmit, loading }) {
  return (
    <FormShell title="Create account">
      <form onSubmit={onSubmit} className="form-grid">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Customer account</option>
          <option value="admin">Admin account</option>
        </select>
        {form.role === "admin" && (
          <input
            placeholder="Admin code"
            value={form.adminCode}
            onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
          />
        )}
        <button disabled={loading}>{loading ? "Please wait..." : "Continue"}</button>
      </form>
    </FormShell>
  );
}

function OtpForm({ email, otp, setOtp, onSubmit, loading }) {
  return (
    <FormShell title="Verify email">
      <form onSubmit={onSubmit} className="form-grid">
        <input value={email} readOnly />
        <input placeholder="Enter code" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
      </form>
    </FormShell>
  );
}

function LoginForm({ form, setForm, onSubmit, loading }) {
  return (
    <FormShell title="Sign in">
      <form onSubmit={onSubmit} className="form-grid">
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.dashboardMode} onChange={(e) => setForm({ ...form, dashboardMode: e.target.value })}>
          <option value="buyer">Buyer dashboard</option>
          <option value="seller">Seller dashboard</option>
          <option value="admin">Admin panel</option>
        </select>
        <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </FormShell>
  );
}

function ProfileForm({ form, setForm, onSubmit, loading }) {
  return (
    <FormShell title="Profile setup">
      <form onSubmit={onSubmit} className="form-grid">
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, profilePhoto: e.target.files[0] })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Clothing size" value={form.clothingSize} onChange={(e) => setForm({ ...form, clothingSize: e.target.value })} />
        <input placeholder="Shoe size" value={form.shoeSize} onChange={(e) => setForm({ ...form, shoeSize: e.target.value })} />
        <input placeholder="Preferences" value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} />
        <input placeholder="Sustainability interests" value={form.sustainabilityInterests} onChange={(e) => setForm({ ...form, sustainabilityInterests: e.target.value })} />
        <button disabled={loading}>{loading ? "Saving..." : "Save profile"}</button>
      </form>
    </FormShell>
  );
}

function FormShell({ title, children }) {
  return (
    <section className="form-shell">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Dashboard({ dashboard, loading, mode, onRefresh, onSwitchMode }) {
  if (!dashboard) {
    return (
      <section className="form-shell">
        <h2>Dashboard</h2>
        <button onClick={onRefresh} disabled={loading}>Load dashboard</button>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <div>
          <p>{dashboard.dashboardTitle}</p>
          <h2>{dashboard.user.name}</h2>
        </div>
        {dashboard.user.role !== "admin" && (
          <div className="mode-switch">
            <button className={mode === "buyer" ? "active" : ""} onClick={() => onSwitchMode("buyer")}>Buyer</button>
            <button className={mode === "seller" ? "active" : ""} onClick={() => onSwitchMode("seller")}>Seller</button>
          </div>
        )}
        <button onClick={onRefresh} disabled={loading}>Refresh</button>
      </div>

      <div className="metric-grid">
        {Object.entries(dashboard.summary).map(([key, value]) => (
          <Metric key={key} label={formatMetricLabel(key)} value={value} />
        ))}
      </div>

      <DashboardSections dashboard={dashboard} />
    </section>
  );
}

function DashboardSections({ dashboard }) {
  if (dashboard.mode === "admin") {
    return (
      <div className="dashboard-grid">
        <ListPanel title="Modules" items={dashboard.sections.modules} empty="No admin modules yet." />
        <ListPanel title="Alerts" items={dashboard.sections.alerts} empty="No alerts." />
        <ListPanel title="Reports" items={dashboard.sections.reports} empty="No reports yet." />
      </div>
    );
  }

  if (dashboard.mode === "seller") {
    return (
      <div className="dashboard-grid">
        <ListPanel title="Listings" items={dashboard.sections.listings} empty="No listings yet." />
        <ListPanel title="Return reasons" items={dashboard.sections.returnReasons} empty="No returns yet." />
        <ListPanel title="Insights" items={dashboard.sections.insights} empty="No insights yet." />
        <ListPanel title="Nudges" items={dashboard.sections.nudges} empty="No nudges yet." />
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <ListPanel title="Nearby demand" items={dashboard.sections.nearbyDemand} empty="No nearby demand yet." />
      <ListPanel title="Nudges" items={dashboard.sections.nudges} empty="No nudges yet." />
      <ListPanel title="Rewards" items={dashboard.sections.rewards} empty="No rewards yet." />
      <ListPanel title="Recent orders" items={dashboard.sections.recentOrders} empty="No orders yet." />
    </div>
  );
}

function ListPanel({ title, items, empty }) {
  return (
    <article className="panel">
      <h3>{title}</h3>
      {items.length === 0 ? <p className="empty-state">{empty}</p> : items.map((item) => <div className="demand-row" key={JSON.stringify(item)}>{String(item)}</div>)}
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function formatMetricLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

export default App;
