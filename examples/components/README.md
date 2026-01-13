# Components Example

Complete React components with UI patterns and best practices for Lazorkit integration.

## Installation

```bash
bun add @lazorkit/wallet @solana/web3.js @coral-xyz/anchor buffer
bun add -D tailwindcss postcss autoprefixer vite-plugin-node-polyfills
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

### Tailwind CSS Setup

```bash
bunx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Add to `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Prerequisites

- Next.js project with above configuration
- Tailwind CSS for styling (optional, can be adapted to any CSS framework)

## Complete Components

### WalletInfo Component

Displays wallet details and balance with refresh functionality.

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

export function WalletInfo() {
  const { isConnected, wallet, smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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
      </div>
    </div>
  );
}
```

### ActivityLog Component

Displays transaction history with refresh functionality.

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection } from "@solana/web3.js";
import { useState, useEffect } from "react";

interface ActivityItem {
  signature: string;
  timestamp: number;
  status: "success" | "failed";
}

export function ActivityLog() {
  const { isConnected, smartWalletPubkey } = useWallet();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

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
        status: sig.err ? "failed" : "success",
      }));

      setActivities(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

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
          ))}
        </div>
      )}
    </div>
  );
}
```

## UI Components Library

### Button Component

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  loading,
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

### Input Component

```typescript
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email";
  required?: boolean;
  error?: string;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

### Card Component

```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`p-6 border border-gray-200 rounded-lg bg-white ${className}`}
    >
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
```

## Complete App Layout

```typescript
import { ConnectButton } from "./ConnectButton";
import { WalletInfo } from "./WalletInfo";
import { TransferForm } from "./TransferForm";
import { SignMessage } from "./SignMessage";
import { ActivityLog } from "./ActivityLog";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lazorkit Demo
          </h1>
          <p className="text-gray-600">
            Experience gasless Solana transactions with passkey authentication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ConnectButton />
            <WalletInfo />
            <ActivityLog />
          </div>

          <div className="space-y-6">
            <TransferForm />
            <SignMessage />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Styling Options

### Tailwind CSS (Recommended)

```bash
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

### CSS Modules

```css
/* styles.module.css */
.card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.buttonPrimary {
  background: #3b82f6;
  color: white;
}

.buttonPrimary:hover {
  background: #2563eb;
}
```

## Best Practices

### Error Boundaries

```typescript
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-red-200 rounded bg-red-50">
      <h2 className="text-red-800 font-semibold">Something went wrong</h2>
      <p className="text-red-600 text-sm">{error.message}</p>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* Your app components */}
    </ErrorBoundary>
  );
}
```

### Loading States

- Always show loading indicators for async operations
- Disable buttons during loading to prevent double-clicks
- Provide meaningful loading messages

### Responsive Design

- Use CSS Grid/Flexbox for layouts
- Test on mobile devices
- Consider touch targets for mobile users

## Accessibility

- Use semantic HTML elements
- Provide proper labels for form inputs
- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers

## Next Steps

- Customize components for your brand
- Add more transaction types
- Implement advanced features
- Deploy to production with HTTPS
