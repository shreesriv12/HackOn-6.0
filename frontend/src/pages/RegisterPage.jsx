import { useState } from "react";
import { FormShell } from "../components/FormShell";
import { initialRegisterForm } from "../constants/forms";
import { useAppStore } from "../store/useAppStore";

export function RegisterPage() {
  const [form, setForm] = useState(initialRegisterForm);
  const { loading, register } = useAppStore();

  return (
    <FormShell title="Create account">
      <form onSubmit={(event) => handleSubmit(event, register, form)} className="form-grid">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Customer account</option>
          <option value="admin">Admin account</option>
        </select>
        {form.role === "admin" && (
          <input placeholder="Admin code" value={form.adminCode} onChange={(e) => setForm({ ...form, adminCode: e.target.value })} />
        )}
        <button disabled={loading}>{loading ? "Please wait..." : "Continue"}</button>
      </form>
    </FormShell>
  );
}

function handleSubmit(event, register, form) {
  event.preventDefault();
  register(form);
}
