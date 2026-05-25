import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sai Ganesh | Full-Stack Product Engineer",
  description:
    "Portfolio for Sai Ganesh, a full-stack product engineer building polished web products.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetBrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <Navbar />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
            },
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
