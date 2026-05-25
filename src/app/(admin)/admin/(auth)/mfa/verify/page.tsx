"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminMfaVerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function loadFactor() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase.auth.mfa.listFactors();

      if (!mounted) {
        return;
      }

      if (error || data.totp.length === 0) {
        setErrorMessage("No authenticator app is enrolled.");
        return;
      }

      setFactorId(data.totp[0].id);
    }

    void loadFactor();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleVerify() {
    if (!factorId) {
      return;
    }

    setVerifying(true);
    setErrorMessage("");

    const supabase = createClient();
    const challengeRes = await supabase.auth.mfa.challenge({ factorId });

    if (challengeRes.error || !challengeRes.data) {
      setErrorMessage("Invalid code.");
      setVerifying(false);
      return;
    }

    const verifyRes = await supabase.auth.mfa.verify({
      challengeId: challengeRes.data.id,
      code,
      factorId,
    });

    if (verifyRes.error) {
      setErrorMessage("Invalid code.");
      setVerifying(false);
      return;
    }

    router.replace("/admin/projects");
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main className="fixed inset-0 z-[60] flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <div className="space-y-1">
          <h1 className="text-sm font-medium text-text-primary">
            Two-factor authentication
          </h1>
          <p className="text-xs text-text-muted">
            Enter the code from your authenticator app.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <input
            aria-label="Two-factor code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={6}
            inputMode="numeric"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-center font-mono text-lg tracking-widest text-text-primary transition-colors focus:border-accent focus:outline-none"
          />

          <button
            type="button"
            disabled={verifying || code.length !== 6 || !factorId}
            className="w-full rounded-md bg-accent py-2 text-sm font-medium text-bg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleVerify}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>

          {errorMessage ? (
            <p className="text-xs text-error">{errorMessage}</p>
          ) : null}

          <button
            type="button"
            className="text-xs text-text-muted transition-colors hover:text-text-primary"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
