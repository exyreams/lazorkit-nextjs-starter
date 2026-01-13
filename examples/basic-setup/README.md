# Basic Setup Example

Minimal Next.js setup with Lazorkit SDK integration.

## Installation

```bash
bun add @lazorkit/wallet @solana/web3.js @coral-xyz/anchor buffer
bun add -D vite-plugin-node-polyfills
```

## Configuration

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer"),
    };
    return config;
  },
};

export default nextConfig;
```

### app/providers.tsx

```typescript
"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";

// Polyfill Buffer for client-side usage
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

// Configuration for Solana Devnet
const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
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
```

### app/layout.tsx

```typescript
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lazorkit Basic Setup",
  description: "Minimal Lazorkit integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Usage

This basic setup provides the foundation for all Lazorkit functionality. The provider wraps your app and enables:

- Passkey authentication
- Gasless transactions
- Smart wallet management
- Session persistence

## Next Steps

- See [Authentication Example](../authentication/) for wallet connection
- See [Transactions Example](../transactions/) for sending transactions
- See [Components Example](../components/) for UI components
