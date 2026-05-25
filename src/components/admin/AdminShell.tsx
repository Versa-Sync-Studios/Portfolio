"use client";

import {
  Code,
  FileText,
  Folder,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUnreadCount } from "@/components/admin/useUnreadCount";

type AdminShellProps = {
  children: ReactNode;
  userEmail: string;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  showUnread?: boolean;
};

const navItems: NavItem[] = [
  { href: "/admin/projects", icon: Folder, label: "Projects" },
  { href: "/admin/tech-stack", icon: Code, label: "Tech Stack" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/contact", icon: Mail, label: "Contact", showUnread: true },
  { href: "/admin/resume", icon: FileText, label: "Resume" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const unreadCount = useUnreadCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[60] bg-bg text-sm text-text-primary">
      <div className="hidden md:block">
        <Sidebar
          onNavigate={() => undefined}
          onSignOut={handleSignOut}
          pathname={pathname}
          unreadCount={unreadCount}
          userEmail={userEmail}
        />
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-border bg-surface p-4">
          <span className="font-mono text-xs text-accent">Admin</span>
          <button
            type="button"
            aria-label="Open admin navigation"
            className="rounded-md border border-border p-2 text-text-muted transition-colors hover:text-text-primary"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={16} aria-hidden="true" />
          </button>
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[70] bg-bg/80">
            <button
              type="button"
              aria-label="Close admin navigation"
              className="absolute inset-0 cursor-default"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative h-full w-[220px] border-r border-border bg-surface">
              <button
                type="button"
                aria-label="Close admin navigation"
                className="absolute right-3 top-3 rounded-md p-1 text-text-muted transition-colors hover:text-text-primary"
                onClick={() => setMobileOpen(false)}
              >
                <X size={16} aria-hidden="true" />
              </button>
              <Sidebar
                onNavigate={() => setMobileOpen(false)}
                onSignOut={handleSignOut}
                pathname={pathname}
                unreadCount={unreadCount}
                userEmail={userEmail}
              />
            </div>
          </div>
        ) : null}
      </div>

      <main className="min-h-screen overflow-y-auto bg-bg md:ml-[220px]">
        <div className="max-w-5xl p-6">{children}</div>
      </main>
    </div>
  );
}

type SidebarProps = {
  onNavigate: () => void;
  onSignOut: () => void;
  pathname: string;
  unreadCount: number;
  userEmail: string;
};

function Sidebar({
  onNavigate,
  onSignOut,
  pathname,
  unreadCount,
  userEmail,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-[220px] flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-4">
        <span className="font-mono text-xs text-accent">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:bg-bg hover:text-text-primary"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
              {item.showUnread && unreadCount > 0 ? (
                <span className="ml-auto min-w-[18px] rounded-full bg-accent px-1.5 text-center text-xs text-bg">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-xs text-text-muted">{userEmail}</p>
        <button
          type="button"
          className="mt-1 flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-error"
          onClick={onSignOut}
        >
          <LogOut size={12} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
