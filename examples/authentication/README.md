# Authentication Example

Complete passkey authentication implementation with connect/disconnect functionality.

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

## Prerequisites

- Modern browser with WebAuthn support
- Next.js project with above configuration

## Components

### ConnectButton.tsx

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();
  const [error, setError] = useState<string>("");

  const handleConnect = async () => {
    try {
      setError("");
      await connect();
    } catch (err) {
      console.error("Connection failed:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  };

  const handleDisconnect = async () => {
    try {
      setError("");
      await disconnect();
    } catch (err) {
      console.error("Disconnection failed:", err);
      setError(err instanceof Error ? err.message : "Disconnection failed");
    }
  };

  if (isConnected && wallet) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Connected Wallet</p>
          <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
            {wallet.smartWallet.slice(0, 8)}...{wallet.smartWallet.slice(-6)}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isConnecting ? "Connecting..." : "Connect with Passkey"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

## Usage

```typescript
import { ConnectButton } from "./ConnectButton";

export default function App() {
  return (
    <div>
      <h1>Lazorkit Authentication</h1>
      <ConnectButton />
    </div>
  );
}
```

## Features

- **Passkey Authentication**: Uses device biometrics (FaceID, TouchID, Windows Hello)
- **Session Persistence**: Stays connected across page refreshes
- **Error Handling**: Graceful error messages for common issues
- **Loading States**: Visual feedback during connection process

## How It Works

1. User clicks "Connect with Passkey"
2. Lazorkit portal opens in popup
3. User authenticates with biometric/PIN
4. Smart wallet is created/accessed
5. Session is established and persisted

## Error Handling

Common errors and solutions:

- **Popup blocked**: Allow popups for the domain
- **WebAuthn not supported**: Use modern browser
- **User cancelled**: Normal behavior, no action needed

## Next Steps

- See [Transactions Example](../transactions/) for sending transactions
- See [Components Example](../components/) for wallet info display
