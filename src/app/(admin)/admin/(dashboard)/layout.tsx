import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();

  if ((factors?.totp.length ?? 0) === 0) {
    redirect("/admin/mfa/setup");
  }

  const { data: assurance } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (assurance?.currentLevel !== "aal2") {
    redirect("/admin/mfa/verify");
  }

  return (
    <AdminShell userEmail={session.user.email ?? "Admin"}>{children}</AdminShell>
  );
}
