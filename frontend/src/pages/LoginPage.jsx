import { useState } from "react";
import { FormShell } from "../components/FormShell";
import { initialLoginForm } from "../constants/forms";
import { useAppStore } from "../store/useAppStore";

export function LoginPage() {
  const [form, setForm] = useState(initialLoginForm);
  const { loading, login } = useAppStore();

  return (
    <FormShell title="Sign in">
      <form onSubmit={(event) => handleSubmit(event, login, form)} className="form-grid">
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.dashboardMode} onChange={(e) => setForm({ ...form, dashboardMode: e.target.value })}>
          <option value="buyer">Sign in as buyer</option>
          <option value="seller">Sign in as seller</option>
        </select>
        <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </FormShell>
  );
}

function handleSubmit(event, login, form) {
  event.preventDefault();
  login(form);
}
