"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    const { data, error: factorsError } =
      await supabase.auth.mfa.listFactors();

    if (factorsError) {
      setErrorMessage(factorsError.message);
      setSubmitting(false);
      return;
    }

    router.replace(
      data.totp.length > 0 ? "/admin/mfa/verify" : "/admin/mfa/setup",
    );
  }

  return (
    <main className="fixed inset-0 z-[60] flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <div>
          <p className="font-mono text-sm text-accent">Admin</p>
          <p className="text-xs text-text-muted">saiganesh.online</p>
        </div>

        <div className="my-4 border-t border-border" />

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium text-text-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none"
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium text-text-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none"
              {...register("password")}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-error">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-md bg-accent py-2 text-sm font-medium text-bg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          {errorMessage ? (
            <p className="text-xs text-error">{errorMessage}</p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
