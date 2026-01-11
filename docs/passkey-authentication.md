# Passkey Authentication with Lazorkit

Learn how to implement biometric authentication using Lazorkit's passkey technology in your Next.js application.

## What You'll Learn

By the end of this tutorial, you'll understand:

- How passkey authentication works under the hood
- Setting up Lazorkit provider in Next.js
- Implementing connect/disconnect functionality
- Managing wallet sessions and persistence
- Handling authentication errors gracefully

## What Are Passkeys?

Passkeys are a modern authentication standard that replaces passwords with biometric authentication:

- **No passwords or seed phrases** - Use your fingerprint, face, or device PIN
- **Cryptographically secure** - Private keys stored in device secure enclave
- **Phishing resistant** - Tied to specific domains, can't be stolen
- **Cross-platform** - Works on mobile, desktop, and web

## Prerequisites

- Basic knowledge of React and Next.js
- Node.js 18+ installed
- Modern browser with WebAuthn support (Chrome, Safari, Firefox, Edge)
- Understanding of React hooks and context

## Step 1: Project Setup

### Install Dependencies

```bash
# Core Lazorkit packages
bun add @lazorkit/wallet @solana/web3.js @coral-xyz/anchor

# Required polyfills for browser compatibility
bun add buffer

# Development dependencies
bun add -d vite-plugin-node-polyfills
```

**Package breakdown:**

- `@lazorkit/wallet` - Core Lazorkit SDK with React hooks
- `@solana/web3.js` - Solana blockchain interactions
- `@coral-xyz/anchor` - Required peer dependency
- `buffer` - Node.js Buffer polyfill for browser environment

### Configure Next.js

Update `next.config.ts` to handle Node.js polyfills:

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

## Step 2: Create the Lazorkit Provider

The provider wraps your app and provides wallet context to all components.

**Create `app/providers.tsx`:**

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

**Key configuration options:**

- `rpcUrl` - Solana RPC endpoint (Devnet for testing)
- `portalUrl` - Lazorkit authentication portal
- `paymasterConfig` - Gasless transaction sponsorship settings

## Step 3: Wrap Your Application

Update your root layout to include the provider.

**Update `app/layout.tsx`:**

```typescript
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lazorkit Next.js Starter",
  description: "Build Solana apps without seed phrases",
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

## Step 4: Build the Connect Button Component

Create a component that handles wallet connection and displays connection status.

**Create `components/ConnectButton.tsx`:**

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();

  const [error, setError] = useState<string>("");

  /**
   * Handle wallet connection
   * Opens Lazorkit portal for passkey authentication
   */
  const handleConnect = async () => {
    try {
      setError("");
      await connect();
    } catch (err) {
      console.error("Connection failed:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  };

  /**
   * Handle wallet disconnection
   * Clears session and logs out user
   */
  const handleDisconnect = async () => {
    try {
      setError("");
      await disconnect();
    } catch (err) {
      console.error("Disconnection failed:", err);
      setError(err instanceof Error ? err.message : "Disconnection failed");
    }
  };

  // Show wallet info when connected
  if (isConnected && wallet) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Connected Wallet</p>
          <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
            {wallet.smartWallet.slice(0, 8)}...{wallet.smartWallet.slice(-6)}
          </p>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>Platform: {wallet.platform}</p>
          <p>Credential ID: {wallet.credentialId.slice(0, 16)}...</p>
        </div>

        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Show connect button when disconnected
  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use your fingerprint, face, or device PIN to create a secure Solana
          wallet
        </p>
      </div>

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </span>
        ) : (
          "Connect with Passkey"
        )}
      </button>

      {error && (
        <p className="text-sm text-red-500 text-center max-w-sm">{error}</p>
      )}
    </div>
  );
}
```

## Step 5: Build the Wallet Info Component

Create a component to display wallet details and balance.

**Create `components/WalletInfo.tsx`:**

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

export function WalletInfo() {
  const { isConnected, wallet, smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch wallet balance from Solana network
   */
  const fetchBalance = async () => {
    if (!smartWalletPubkey) return;

    setLoading(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const balanceLamports = await connection.getBalance(smartWalletPubkey);
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
      setBalance(balanceSOL);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when wallet connects
  useEffect(() => {
    if (isConnected && smartWalletPubkey) {
      fetchBalance();
    }
  }, [isConnected, smartWalletPubkey]);

  if (!isConnected || !wallet) {
    return null;
  }

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Address</label>
          <p className="font-mono text-sm bg-white px-3 py-2 rounded border">
            {wallet.smartWallet}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Balance</label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-lg font-semibold">
              {balance.toFixed(6)} SOL
            </p>
            <button
              onClick={fetchBalance}
              disabled={loading}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Platform</label>
          <p className="text-sm">{wallet.platform}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Credential ID
          </label>
          <p className="font-mono text-xs text-gray-500">
            {wallet.credentialId.slice(0, 32)}...
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Step 6: Build the Activity Log Component

Create a component to display transaction history.

**Create `components/ActivityLog.tsx`:**

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, ParsedTransactionWithMeta } from "@solana/web3.js";
import { useState, useEffect } from "react";

interface ActivityItem {
  signature: string;
  timestamp: number;
  type: "transfer" | "unknown";
  amount?: number;
  status: "success" | "failed";
}

export function ActivityLog() {
  const { isConnected, smartWalletPubkey } = useWallet();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch transaction history from Solana network
   */
  const fetchActivities = async () => {
    if (!smartWalletPubkey) return;

    setLoading(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const signatures = await connection.getSignaturesForAddress(
        smartWalletPubkey,
        { limit: 10 }
      );

      const activities: ActivityItem[] = signatures.map((sig) => ({
        signature: sig.signature,
        timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
        type: "transfer",
        status: sig.err ? "failed" : "success",
      }));

      setActivities(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities when wallet connects
  useEffect(() => {
    if (isConnected && smartWalletPubkey) {
      fetchActivities();
    }
  }, [isConnected, smartWalletPubkey]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <button
          onClick={fetchActivities}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.signature}
              className="flex items-center justify-between p-3 bg-gray-50 rounded border"
            >
              <div>
                <p className="font-mono text-sm">
                  {activity.signature.slice(0, 8)}...
                  {activity.signature.slice(-8)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    activity.status === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Step 7: Understanding the useWallet Hook

The `useWallet` hook provides access to all wallet functionality:

```typescript
const {
  // Connection methods
  connect, // () => Promise<void> - Open portal for authentication
  disconnect, // () => Promise<void> - Clear session and logout

  // Connection state
  isConnected, // boolean - Is wallet connected?
  isConnecting, // boolean - Is connection in progress?

  // Wallet information
  wallet, // WalletInfo | null - Wallet details
  smartWalletPubkey, // PublicKey | null - Wallet address as PublicKey

  // Transaction methods (covered in next tutorial)
  signAndSendTransaction,
  signMessage,
} = useWallet();
```

### Wallet Information Object

When connected, the `wallet` object contains:

```typescript
interface WalletInfo {
  smartWallet: string; // Base58 wallet address
  credentialId: string; // WebAuthn credential ID
  platform: string; // Device platform info
  accountName?: string; // Optional account name
}
```

## Step 8: Add to Your Page

Use the components in your main page.

**Update `app/page.tsx`:**

```typescript
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";
import { ActivityLog } from "@/components/ActivityLog";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lazorkit Demo
          </h1>
          <p className="text-gray-600">
            Experience Solana without seed phrases
          </p>
        </div>

        <ConnectButton />
        <WalletInfo />
        <ActivityLog />
      </div>
    </div>
  );
}
```

## Step 9: Test the Authentication Flow

1. **Start your development server:**

   ```bash
   bun dev
   ```

2. **Open http://localhost:3000**

3. **Click "Connect with Passkey"**

   - Lazorkit portal opens in a popup
   - You'll see passkey creation/selection interface

4. **Complete biometric authentication**

   - Use FaceID, TouchID, Windows Hello, or device PIN
   - Your device's secure enclave handles the cryptography

5. **You're connected!**
   - Button shows your wallet address and platform info
   - Session persists across page refreshes
   - Balance and activity are automatically fetched

## Understanding the Authentication Flow

### What Happens Behind the Scenes

1. **Portal Opens**

   - `connect()` opens the Lazorkit portal in a popup
   - Portal handles WebAuthn credential creation/selection

2. **Passkey Creation/Selection**

   - New users: Create a new WebAuthn credential
   - Returning users: Select existing credential
   - Private key never leaves the device's secure enclave

3. **Smart Wallet Generation**

   - Lazorkit creates a Program Derived Address (PDA) on Solana
   - This PDA is controlled by your passkey
   - No seed phrases or private key management needed

4. **Session Establishment**

   - Portal returns authentication tokens
   - Tokens are stored in browser localStorage
   - Session persists until explicit logout

5. **Context Update**
   - `useWallet` hook updates with connection state
   - Components re-render with wallet information
   - App is ready for transactions

## Advanced: Custom Connection Options

You can pass options to customize the connection flow:

```typescript
const handleConnect = async () => {
  await connect({
    // Specify fee payment method
    feeMode: "paymaster", // or 'user'

    // Custom account name
    accountName: "My Wallet",

    // Additional metadata
    metadata: {
      appName: "My DApp",
      appUrl: "https://mydapp.com",
    },
  });
};
```

## Session Persistence

Lazorkit automatically handles session persistence:

- **Page Refresh** - Connection state is restored
- **Browser Restart** - Session remains active
- **Cross-Tab** - Connection state syncs across tabs
- **Explicit Logout** - `disconnect()` clears all session data

## Error Handling

Common errors and how to handle them:

```typescript
const handleConnect = async () => {
  try {
    await connect();
  } catch (error) {
    if (error.message.includes("popup_blocked")) {
      setError("Please allow popups for this site");
    } else if (error.message.includes("webauthn_not_supported")) {
      setError("Your browser doesn't support passkeys");
    } else if (error.message.includes("user_cancelled")) {
      setError("Authentication was cancelled");
    } else {
      setError("Connection failed. Please try again.");
    }
  }
};
```

## Security Considerations

### Why Passkeys Are Secure

1. **Private keys never leave the device** - Stored in secure enclave
2. **Biometric authentication** - More secure than passwords
3. **Domain binding** - Credentials tied to specific domains
4. **Phishing resistant** - Can't be stolen or intercepted
5. **No seed phrases** - Nothing for users to lose or leak

### Best Practices

- Always check `isConnected` before accessing `wallet`
- Handle connection errors gracefully
- Provide clear user feedback during connection
- Test on multiple browsers and devices
- Use HTTPS in production for WebAuthn compliance

## Troubleshooting

### Common Issues

**"Buffer is not defined"**

```typescript
// Add to providers.tsx
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}
```

**"Popup blocked"**

- Check browser popup blocker settings
- Ensure user interaction triggered the connection

**"WebAuthn not supported"**

- Use modern browsers (Chrome 67+, Safari 14+, Firefox 60+)
- Ensure HTTPS in production (localhost works for development)

**"Connection works but wallet is undefined"**

```typescript
// Always check both conditions
if (isConnected && wallet) {
  // Safe to use wallet here
}
```

## Next Steps

Now that you have authentication working:

1. **[Learn about gasless transactions](./gasless-transactions.md)**
2. **Display wallet balance and transaction history**
3. **Implement message signing for verification**
4. **Build your dApp features on top of this foundation**

## Resources

- [Lazorkit useWallet Hook Reference](https://docs.lazorkit.com/react/useWallet)
- [WebAuthn Guide](https://webauthn.guide/)
- [Solana Program Derived Addresses](https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)

---

**Next Tutorial:** [Gasless Transactions](./gasless-transactions.md)
