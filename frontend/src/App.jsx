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
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(localStorage.getItem("pwsc_token") || "");
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => {
    if (!user) return "Hello, sign in";
    if (user.role === "admin") return "Admin Panel";
    if (user.role === "seller") return "Seller Dashboard";
    return "User Dashboard";
  }, [user]);

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
      setNotice(data.demoOtp ? `${data.message} Demo OTP: ${data.demoOtp}` : data.message);
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
      localStorage.setItem("pwsc_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setNotice(`Email verified. Opening ${data.dashboardTitle} after profile setup.`);
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
      localStorage.setItem("pwsc_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setNotice(`JWT issued. Opening ${data.dashboardTitle}.`);
      await loadDashboard(data.token);
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
      setNotice(data.onboardingTour.join(" | "));
      await loadDashboard();
      setView("dashboard");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(nextToken = token) {
    const response = await fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${nextToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not load dashboard");
    setDashboard(data);
  }

  function logout() {
    localStorage.removeItem("pwsc_token");
    setToken("");
    setUser(null);
    setDashboard(null);
    setView("home");
  }

  return (
    <div className="amazon-shell">
      <header className="topbar">
        <div className="brand" onClick={() => setView("home")}>
          amazon<span>.in</span>
          <small>circular</small>
        </div>
        <div className="location">Delivering to {dashboard?.user.location || "your area"}</div>
        <div className="search">
          <select aria-label="Category">
            <option>All</option>
            <option>Returns</option>
            <option>Resale</option>
            <option>Admin</option>
          </select>
          <input placeholder="Search Amazon.in" />
          <button type="button">Search</button>
        </div>
        <button className="nav-action" onClick={() => setView(token ? "dashboard" : "login")}>
          {roleLabel}
        </button>
        <button className="nav-action" onClick={token ? logout : () => setView("register")}>
          {token ? "Logout" : "Sign Up"}
        </button>
      </header>

      <nav className="category-strip">
        <span>All</span>
        <span>Fresh</span>
        <span>Sell</span>
        <span>Admin</span>
        <span>Returns</span>
        <span>Rewards</span>
        <span>Recycle</span>
        <span>Fashion</span>
        <span>Home & Kitchen</span>
      </nav>

      <main>
        <Hero onSignup={() => setView("register")} onLogin={() => setView("login")} />
        {notice && <div className="notice">{notice}</div>}

        {view === "home" && <HomeGrid onSignup={() => setView("register")} />}
        {view === "register" && (
          <RegisterForm
            form={registerForm}
            setForm={setRegisterForm}
            onSubmit={handleRegister}
            loading={loading}
          />
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
        {view === "dashboard" && <Dashboard dashboard={dashboard} user={user} onRefresh={() => loadDashboard()} />}
      </main>
    </div>
  );
}

function Hero({ onSignup, onLogin }) {
  return (
    <section className="hero">
      <div>
        <p>Products Without a Second Chance</p>
        <h1>Role-based circular commerce for users, sellers, and admins.</h1>
        <span>OTP onboarding, JWT login, admin controls, seller insights, and user rewards in one Amazon-style experience.</span>
      </div>
      <div className="hero-actions">
        <button onClick={onSignup}>Sign up securely</button>
        <button className="secondary" onClick={onLogin}>Login</button>
      </div>
    </section>
  );
}

function HomeGrid({ onSignup }) {
  return (
    <section className="deal-grid">
      <article className="deal-card">
        <h2>Choose your role</h2>
        <div className="product-grid">
          <ProductTile title="User" badge="Rewards and matches" />
          <ProductTile title="Seller" badge="Return analytics" />
          <ProductTile title="Admin" badge="Platform control" />
          <ProductTile title="OTP" badge="Email verified" />
        </div>
      </article>
      <article className="deal-card">
        <h2>Flow 1: Registration</h2>
        <p>Sign up as a normal user, seller, or admin. Admin signup can be protected with an admin code.</p>
        <button onClick={onSignup}>Start onboarding</button>
      </article>
      <article className="deal-card">
        <h2>Flow 2: Login</h2>
        <p>JWT login returns the role and opens the matching dashboard experience.</p>
      </article>
      <article className="deal-card">
        <h2>Flow 3: Dashboard</h2>
        <p>Users see demand and rewards, sellers see insights, admins see platform operations.</p>
      </article>
    </section>
  );
}

function ProductTile({ title, badge }) {
  return (
    <div className="product-tile">
      <div className="mock-image">{title.slice(0, 2)}</div>
      <strong>{title}</strong>
      <span>{badge}</span>
    </div>
  );
}

function RegisterForm({ form, setForm, onSubmit, loading }) {
  return (
    <FormShell title="Create your account" subtitle="Registration is role-based">
      <form onSubmit={onSubmit} className="form-grid">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Normal User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "admin" && (
          <input
            placeholder="Admin registration code"
            value={form.adminCode}
            onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
          />
        )}
        <button disabled={loading}>{loading ? "Sending OTP..." : `Continue as ${roleName(form.role)}`}</button>
      </form>
    </FormShell>
  );
}

function OtpForm({ email, otp, setOtp, onSubmit, loading }) {
  return (
    <FormShell title="Verify email OTP" subtitle={`Code sent to ${email}`}>
      <form onSubmit={onSubmit} className="form-grid">
        <input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
      </form>
    </FormShell>
  );
}

function LoginForm({ form, setForm, onSubmit, loading }) {
  return (
    <FormShell title="Sign in" subtitle="Login routes users, sellers, and admins by JWT role">
      <form onSubmit={onSubmit} className="form-grid">
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading}>{loading ? "Signing in..." : "Sign in securely"}</button>
      </form>
    </FormShell>
  );
}

function ProfileForm({ form, setForm, onSubmit, loading }) {
  return (
    <FormShell title="Profile setup" subtitle="Upload photo, add location, size, and sustainability interests">
      <form onSubmit={onSubmit} className="form-grid">
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, profilePhoto: e.target.files[0] })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Clothing size" value={form.clothingSize} onChange={(e) => setForm({ ...form, clothingSize: e.target.value })} />
        <input placeholder="Shoe size" value={form.shoeSize} onChange={(e) => setForm({ ...form, shoeSize: e.target.value })} />
        <input placeholder="Preferences" value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} />
        <input placeholder="Sustainability interests, comma separated" value={form.sustainabilityInterests} onChange={(e) => setForm({ ...form, sustainabilityInterests: e.target.value })} />
        <button disabled={loading}>{loading ? "Saving..." : "Open role dashboard"}</button>
      </form>
    </FormShell>
  );
}

function FormShell({ title, subtitle, children }) {
  return (
    <section className="form-shell">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      {children}
    </section>
  );
}

function Dashboard({ dashboard, user, onRefresh }) {
  if (!dashboard) {
    return (
      <section className="form-shell">
        <h2>Dashboard</h2>
        <p>Login or complete onboarding to load role-based dashboard data.</p>
        <button onClick={onRefresh}>Load dashboard</button>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <div>
          <p>{roleName(user?.role || dashboard.user.role)}</p>
          <h2>{dashboard.dashboardTitle}: {dashboard.user.name}</h2>
        </div>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      <div className="metric-grid">
        {Object.entries(dashboard.summary).map(([key, value]) => (
          <Metric key={key} label={formatMetricLabel(key)} value={value} />
        ))}
      </div>

      <RoleDashboardSections dashboard={dashboard} />
    </section>
  );
}

function RoleDashboardSections({ dashboard }) {
  if (dashboard.user.role === "admin") {
    return (
      <div className="dashboard-grid">
        <ListPanel title="Admin modules" items={dashboard.adminModules} renderItem={(item) => (
          <>
            <span>{item.name}</span>
            <small>{item.status}</small>
          </>
        )} />
        <ListPanel title="Platform alerts" items={dashboard.alerts} />
        <ListPanel title="Admin permissions" items={[
          "Manage users, listings, returns, recycle centers, rewards, and NGO partners",
          "Override AI grading decisions",
          "Export analytics and sustainability reports",
        ]} />
      </div>
    );
  }

  if (dashboard.user.role === "seller") {
    return (
      <div className="dashboard-grid">
        <ListPanel title="AI seller insights" items={dashboard.sellerInsights} />
        <ListPanel title="Return reason analysis" items={dashboard.returnReasons} renderItem={(item) => (
          <>
            <span>{item.reason}</span>
            <strong>{item.count} returns</strong>
          </>
        )} />
        <ListPanel title="Seller nudges" items={dashboard.proactiveNudges} />
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <article className="panel">
        <h3>Nearby demand map</h3>
        {dashboard.nearbyDemand.map((item) => (
          <div className="demand-row" key={item.product}>
            <span>{item.product}</span>
            <strong>{item.peopleWaiting} waiting</strong>
            <small>{item.distance} | {item.matchScore}% match</small>
          </div>
        ))}
      </article>
      <ListPanel title="Proactive nudges" items={dashboard.proactiveNudges} />
      <ListPanel title="Onboarding tour" items={dashboard.onboardingTour} />
    </div>
  );
}

function ListPanel({ title, items, renderItem }) {
  return (
    <article className="panel">
      <h3>{title}</h3>
      {items.map((item) => (
        <div className="demand-row" key={typeof item === "string" ? item : JSON.stringify(item)}>
          {renderItem ? renderItem(item) : <span>{item}</span>}
        </div>
      ))}
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

function roleName(role) {
  if (role === "admin") return "Admin";
  if (role === "seller") return "Seller";
  return "Normal User";
}

export default App;
