/**
 * @fileoverview Lazorkit Provider Configuration
 *
 * This file sets up the Lazorkit wallet provider with proper configuration
 * for Solana Devnet integration. It handles client-side polyfills and
 * provides the necessary context for passkey authentication and gasless transactions.
 *
 * Key Features:
 * - Buffer polyfill for client-side compatibility
 * - Devnet RPC configuration for testing
 * - Paymaster setup for gasless transactions
 * - Portal URL for passkey authentication
 *
 * @author exyreams
 * @version 1.0.0
 */

"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import type { ReactNode } from "react";

/**
 * Client-side Buffer polyfill
 * Required for Solana web3.js compatibility in browser environments
 * This ensures that Buffer is available globally for cryptographic operations
 */
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

/**
 * Lazorkit Configuration for Solana Devnet
 *
 * This configuration object contains all the necessary endpoints and settings
 * for connecting to Solana Devnet and enabling Lazorkit features.
 */
const CONFIG = {
  /** Solana Devnet RPC endpoint for blockchain interactions */
  RPC_URL: "https://api.devnet.solana.com",

  /** Lazorkit Portal URL for passkey authentication services */
  PORTAL_URL: "https://portal.lazor.sh",

  /** Paymaster configuration for gasless transaction sponsorship */
  PAYMASTER: {
    /** Devnet paymaster URL that sponsors transaction fees */
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

/**
 * Providers Component
 *
 * Wraps the application with LazorkitProvider to enable wallet functionality
 * throughout the component tree. This provider gives access to:
 * - Passkey-based authentication
 * - Smart wallet operations
 * - Gasless transaction capabilities
 * - Solana blockchain interactions
 *
 * @param children - React components to be wrapped with Lazorkit context
 * @returns JSX element with Lazorkit provider configured
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}
