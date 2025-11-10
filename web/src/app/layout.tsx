import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClubFinder",
  description: "Find and join campus clubs easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800`}
      >
        {/* Page Content */}
        <main className="p-6">{children}</main>

        {/* Sleek Floating Home Button (bottom-left) */}
        <Link
          href="/"
          className="fixed bottom-6 left-6 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-full shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white hover:text-gray-800 transition-all"
        >
          Home
        </Link>
      </body>
    </html>
  );
}
