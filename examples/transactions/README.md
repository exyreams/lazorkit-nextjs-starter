# Transactions Example

Complete implementation of gasless transactions including SOL transfers, USDC transfers, and message signing.

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

- Connected wallet with Lazorkit
- Test SOL from [Solana Faucet](https://faucet.solana.com) for Devnet
- Next.js project with above configuration

## Components

### SOL Transfer Form

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartWalletPubkey) return;

    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      const recipientPubkey = new PublicKey(recipient);
      const solAmount = parseFloat(amount);
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      setTxSignature(signature);
      setRecipient("");
      setAmount("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div>Connect your wallet to send transactions</div>;
  }

  return (
    <form onSubmit={handleTransfer} className="space-y-4 p-6 border rounded">
      <h2 className="text-xl font-semibold">Send SOL</h2>

      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        step="0.000000001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (SOL)"
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send Transaction"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {txSignature && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">Transaction Successful!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View on Explorer
          </a>
        </div>
      )}
    </form>
  );
}
```

### Message Signing

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function SignMessage() {
  const { signMessage, isConnected } = useWallet();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signMessage(message);
      setSignature(result.signature);
    } catch (err) {
      console.error("Signing failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div>Connect wallet to sign messages</div>;
  }

  return (
    <form onSubmit={handleSign} className="space-y-4 p-6 border rounded">
      <h2 className="text-xl font-semibold">Sign Message</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message to sign..."
        rows={4}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-purple-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Signing..." : "Sign Message"}
      </button>

      {signature && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
          <p className="text-purple-800">Signature Generated</p>
          <p className="font-mono text-xs break-all">{signature}</p>
        </div>
      )}
    </form>
  );
}
```

## Key Features

### Gasless Transactions

- No SOL required for gas fees
- Paymaster sponsors transaction costs
- Seamless user experience

### Multiple Transaction Types

- **SOL Transfers**: Send native SOL tokens
- **USDC Transfers**: Send SPL tokens with USDC fee payment
- **Message Signing**: Cryptographic verification without gas

### Error Handling

- Input validation
- Network error handling
- User-friendly error messages

## Usage

```typescript
import { TransferForm } from "./TransferForm";
import { SignMessage } from "./SignMessage";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <TransferForm />
      <SignMessage />
    </div>
  );
}
```

## Testing

1. **Get Test SOL**: Visit [Solana Faucet](https://faucet.solana.com)
2. **SOL Transfer**: Use your own address as recipient for testing
3. **Message Signing**: Sign any text message
4. **View Results**: Check transaction on Solana Explorer

## Advanced Features

### Multiple Instructions

```typescript
const instructions = [
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient1,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient2,
    lamports: 0.2 * LAMPORTS_PER_SOL,
  }),
];

const signature = await signAndSendTransaction({ instructions });
```

### Custom Transaction Options

```typescript
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: "USDC", // Pay gas in USDC
    computeUnitLimit: 500_000, // Set compute limit
  },
});
```

## HTTPS Requirement

**Important**: WebAuthn requires HTTPS for transaction signing in production.

- **Development**: localhost works for testing
- **Production**: Deploy to HTTPS-enabled hosting (Vercel, Netlify, etc.)

## Next Steps

- See [Components Example](../components/) for complete UI components
- Explore advanced transaction patterns
- Implement custom transaction types
