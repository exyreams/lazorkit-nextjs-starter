/**
 * @fileoverview Root Layout Component for Lazorkit Next.js Starter
 *
 * This is the main layout component that wraps all pages in the application.
 * It sets up the global font configuration, metadata, and provides the
 * Lazorkit context to all child components.
 *
 * Key Features:
 * - Configures Geist font family for modern typography
 * - Sets up SEO metadata for the application
 * - Wraps the app with Lazorkit providers for wallet functionality
 *
 * @author exyreams
 * @version 1.0.0
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Geist Sans font configuration
 * Modern, clean sans-serif font for UI elements
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono font configuration
 * Monospace font for code blocks and technical content
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Application metadata for SEO and social sharing
 * Defines how the app appears in search results and social media
 */
export const metadata: Metadata = {
  title: "Lazorkit Next.js Starter",
  description:
    "A starter template for building Solana apps with Lazorkit passkey authentication",
  keywords: [
    "Solana",
    "Web3",
    "Passkey",
    "Biometric",
    "Gasless",
    "Smart Wallet",
  ],
  authors: [{ name: "exyreams" }],
  openGraph: {
    title: "Lazorkit Next.js Starter",
    description:
      "Build Solana apps without seed phrases using passkey authentication",
    type: "website",
  },
};

/**
 * Root Layout Component
 *
 * Provides the base HTML structure and global providers for the entire application.
 * This component wraps all pages and ensures consistent styling and functionality.
 *
 * @param children - The page content to be rendered within the layout
 * @returns JSX element containing the complete HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Lazorkit Provider wraps the entire app to provide wallet context */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
