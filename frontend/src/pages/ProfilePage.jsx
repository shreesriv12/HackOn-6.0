import { useState } from "react";
import { FormShell } from "../components/FormShell";
import { initialProfileForm } from "../constants/forms";
import { useAppStore } from "../store/useAppStore";

export function ProfilePage() {
  const [form, setForm] = useState(initialProfileForm);
  const { loading, saveProfile } = useAppStore();

  return (
    <FormShell title="Profile setup">
      <form onSubmit={(event) => handleSubmit(event, saveProfile, form)} className="form-grid">
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

function handleSubmit(event, saveProfile, form) {
  event.preventDefault();
  saveProfile(form);
}
