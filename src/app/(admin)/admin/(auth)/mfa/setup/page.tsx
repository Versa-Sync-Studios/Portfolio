"use client";

import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Enrollment = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export default function AdminMfaSetupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function enrollFactor() {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator App",
      });

      if (!mounted) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setEnrollment({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setLoading(false);
    }

    void enrollFactor();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleVerify() {
    if (!enrollment) {
      return;
    }

    setVerifying(true);
    setErrorMessage("");

    const supabase = createClient();
    const challengeRes = await supabase.auth.mfa.challenge({
      factorId: enrollment.factorId,
    });

    if (challengeRes.error || !challengeRes.data) {
      setErrorMessage("Invalid code. Try again.");
      setVerifying(false);
      return;
    }

    const verifyRes = await supabase.auth.mfa.verify({
      challengeId: challengeRes.data.id,
      code,
      factorId: enrollment.factorId,
    });

    if (verifyRes.error) {
      setErrorMessage("Invalid code. Try again.");
      setVerifying(false);
      return;
    }

    router.replace("/admin/projects");
  }

  async function handleCopySecret() {
    if (enrollment) {
      await navigator.clipboard.writeText(enrollment.secret);
    }
  }

  return (
    <main className="fixed inset-0 z-[60] flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <div className="space-y-1">
          <h1 className="text-sm font-medium text-text-primary">
            Set up two-factor authentication
          </h1>
          <p className="text-xs text-text-muted">
            Scan this QR code with Google Authenticator or Authy.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-xs text-text-muted">Preparing setup...</p>
          ) : null}

          {enrollment ? (
            <>
              <div className="inline-block rounded-md bg-white p-3">
                <div
                  dangerouslySetInnerHTML={{ __html: enrollment.qrCode }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-text-muted">Or enter manually:</p>
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text-secondary">
                    {enrollment.secret}
                  </code>
                  <button
                    type="button"
                    aria-label="Copy secret key"
                    className="rounded border border-border p-2 text-text-muted transition-colors hover:text-text-primary"
                    onClick={handleCopySecret}
                  >
                    <Copy size={12} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="mfa-code"
                  className="mb-1 block text-xs text-text-muted"
                >
                  Enter the 6-digit code to confirm
                </label>
                <input
                  id="mfa-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-center font-mono text-lg tracking-widest text-text-primary transition-colors focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="button"
                disabled={verifying || code.length !== 6}
                className="w-full rounded-md bg-accent py-2 text-sm font-medium text-bg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleVerify}
              >
                {verifying ? "Verifying..." : "Verify and Enable"}
              </button>
            </>
          ) : null}

          {errorMessage ? (
            <p className="text-xs text-error">{errorMessage}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
