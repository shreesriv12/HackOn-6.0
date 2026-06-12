import { useState } from "react";
import { FormShell } from "../components/FormShell";
import { useAppStore } from "../store/useAppStore";

export function OtpPage() {
  const [otp, setOtp] = useState("");
  const { loading, verifyEmailOtp } = useAppStore();
  const email = useLastRegistrationEmail();

  return (
    <FormShell title="Verify email">
      <form onSubmit={(event) => handleSubmit(event, verifyEmailOtp, email, otp)} className="form-grid">
        <input value={email} readOnly />
        <input placeholder="Enter code" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
      </form>
    </FormShell>
  );
}

function useLastRegistrationEmail() {
  return useAppStore((state) => state.pendingEmail);
}

function handleSubmit(event, verifyEmailOtp, email, otp) {
  event.preventDefault();
  verifyEmailOtp({ email, otp });
}
