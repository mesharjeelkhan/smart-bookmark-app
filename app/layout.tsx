import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markd — Smart Bookmarks",
  description: "Your personal bookmark manager. Minimal. Fast. Real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise min-h-screen bg-ink antialiased">
        {children}
      </body>
    </html>
  );
}
