# Gasless Transactions with Lazorkit

Learn how to send Solana transactions without requiring users to hold SOL for gas fees using Lazorkit's Paymaster system.

## What You'll Learn

By the end of this tutorial, you'll understand:

- How gasless transactions work with Paymaster
- Building transaction forms with proper validation
- Sending SOL transfers without gas fees
- Handling transaction confirmations and errors
- Advanced features like USDC fee payment
- Implementing all transaction components (SOL, USDC, Message Signing)

## The Problem with Traditional Solana Transactions

In traditional Solana applications:

1. **Users need SOL for gas fees** (~0.000005 SOL per transaction)
2. **New users must acquire SOL first** before using your app
3. **This creates friction** and poor user experience
4. **Users can get stuck** without SOL to pay for transactions

## How Lazorkit's Paymaster Solves This

With Lazorkit's gasless transactions:

1. **Your app or Lazorkit sponsors gas fees** automatically
2. **Users can transact immediately** after creating a passkey
3. **Optional USDC fee payment** - pay gas in tokens instead of SOL
4. **Seamless user experience** - no gas management needed

## Prerequisites

- Completed [Passkey Authentication Tutorial](./passkey-authentication.md)
- Connected wallet with Lazorkit
- Basic understanding of Solana transactions and instructions
- Familiarity with React forms and state management

## Step 1: Understanding Solana Transactions

### Transaction Structure

Every Solana transaction consists of:

- **Instructions** - What operations to perform
- **Accounts** - Which accounts are involved
- **Signatures** - Who authorizes the transaction
- **Recent Blockhash** - Prevents replay attacks

### Creating Instructions

```typescript
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Create a SOL transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: senderPublicKey, // Who sends
  toPubkey: recipientPublicKey, // Who receives
  lamports: 0.1 * LAMPORTS_PER_SOL, // How much (in lamports)
});
```

## Step 2: Build the SOL Transfer Form Component

Create a comprehensive form for sending SOL with proper validation and error handling.

**Create `components/TransferForm.tsx`:**

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();

  // Form state
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");

  /**
   * Handle form submission and transaction sending
   */
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure wallet is connected
    if (!smartWalletPubkey) {
      setError("Wallet not connected");
      return;
    }

    // Reset state
    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      // 1. Validate recipient address format
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch {
        throw new Error("Invalid recipient address format");
      }

      // 2. Validate and convert amount
      const solAmount = parseFloat(amount);
      if (Number.isNaN(solAmount) || solAmount <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

      // 3. Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      // 4. Sign and send transaction via Paymaster
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          // Optional: Pay gas fees in USDC instead of SOL
          // feeToken: 'USDC',
          // Optional: Set compute unit limit for complex transactions
          // computeUnitLimit: 200_000,
        },
      });

      // 5. Handle success
      setTxSignature(signature);
      setRecipient(""); // Clear form
      setAmount("");
    } catch (err: unknown) {
      console.error("Transfer failed:", err);

      // Provide user-friendly error messages
      if (err instanceof Error) {
        if (err.message.includes("insufficient funds")) {
          setError("Insufficient SOL balance for this transfer");
        } else if (err.message.includes("Invalid recipient")) {
          setError("Please enter a valid Solana address");
        } else {
          setError(err.message);
        }
      } else {
        setError("Transaction failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-600 mb-4">
          Connect your wallet to send transactions
        </p>
        <p className="text-sm text-gray-500">
          Use the Connect button above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Send SOL</h2>
        <p className="text-sm text-gray-600">
          Send SOL to any Solana address without gas fees
        </p>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        {/* Recipient Address Input */}
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address (Base58)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount (SOL)
          </label>
          <input
            id="amount"
            type="number"
            step="0.000000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimum: 0.000000001 SOL</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            "Send Transaction"
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {txSignature && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-800">
              Transaction Successful!
            </p>
          </div>

          <p className="text-xs text-green-600 mb-3 font-mono break-all">
            {txSignature}
          </p>

          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View on Solana Explorer
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
```

## Step 3: Build the USDC Transfer Form Component

Create a form for sending USDC tokens with fees paid in USDC.

**Create `components/USDCTransferForm.tsx`:**

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";

// USDC Mint Address on Devnet
const USDC_MINT_DEVNET = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export function USDCTransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!smartWalletPubkey) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);

      // Convert USDC amount to smallest unit (6 decimals for USDC)
      const usdcAmount = Math.floor(parseFloat(amount) * 1_000_000);

      /**
       * Helper function to derive Associated Token Address (ATA)
       */
      const getATA = (mint: PublicKey, owner: PublicKey): PublicKey => {
        const [ata] = PublicKey.findProgramAddressSync(
          [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
        );
        return ata;
      };

      // Derive ATAs for sender and recipient
      const senderATA = getATA(USDC_MINT_DEVNET, smartWalletPubkey);
      const recipientATA = getATA(USDC_MINT_DEVNET, recipientPubkey);

      // Create SPL token transfer instruction
      const keys = [
        { pubkey: senderATA, isSigner: false, isWritable: true },
        { pubkey: recipientATA, isSigner: false, isWritable: true },
        { pubkey: smartWalletPubkey, isSigner: true, isWritable: false },
      ];

      // Create instruction data for SPL token transfer
      const data = Buffer.alloc(9);
      data.writeUInt8(3, 0); // Transfer instruction discriminator
      data.writeBigUInt64LE(BigInt(usdcAmount), 1); // Amount in smallest units

      const instruction = new TransactionInstruction({
        keys,
        programId: TOKEN_PROGRAM_ID,
        data,
      });

      // Sign and send transaction with USDC fee payment
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC", // Pay gas fees in USDC
        },
      });

      setTxSignature(signature);
      setRecipient("");
      setAmount("");
    } catch (err: unknown) {
      console.error("USDC transfer failed:", err);

      // Provide helpful error messages for common token issues
      if (err instanceof Error) {
        if (
          err.message?.includes("TokenAccountNotFoundError") ||
          err.message?.includes("AccountNotFound")
        ) {
          setError(
            "USDC account not found. Make sure you have USDC in your wallet."
          );
        } else if (err.message?.includes("insufficient funds")) {
          setError("Insufficient USDC balance");
        } else {
          setError(err.message);
        }
      } else {
        setError("Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-600 mb-4">Connect your wallet to send USDC</p>
        <p className="text-sm text-gray-500">
          Gasless token transfers available
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Send USDC</h2>
        <p className="text-sm text-gray-600">
          Send USDC tokens with gas fees paid in USDC
        </p>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label
            htmlFor="usdc-recipient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient Address
          </label>
          <input
            id="usdc-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Solana address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="usdc-amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount (USDC)
          </label>
          <input
            id="usdc-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Make sure you have USDC in your wallet first
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : "Send USDC"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {txSignature && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-emerald-800">
              USDC Transfer Successful!
            </p>
          </div>

          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View on Explorer
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
```

## Step 4: Build the Message Signing Component

Create a component for signing arbitrary messages for verification purposes.

**Create `components/SignMessage.tsx`:**

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function SignMessage() {
  const { signMessage, isConnected } = useWallet();

  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message to sign");
      return;
    }

    setLoading(true);
    setError("");
    setSignature("");

    try {
      // Sign the message using the passkey-secured private key
      const result = await signMessage(message);

      // The result contains the signature and the signed payload
      setSignature(result.signature);
      console.log("Signed payload:", result.signedPayload);
    } catch (err: unknown) {
      console.error("Signing failed:", err);
      setError(err instanceof Error ? err.message : "Failed to sign message");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-600 mb-4">Connect wallet to sign messages</p>
        <p className="text-sm text-gray-500">Prove ownership securely</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Sign Message</h2>
        <p className="text-sm text-gray-600">
          Sign any message to prove wallet ownership
        </p>
      </div>

      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter any message to sign..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This action verifies your identity without costing gas.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing..." : "Sign Message"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {signature && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-purple-800">
              Signature Generated
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded border">
            <p className="text-xs font-mono text-gray-600 break-all leading-relaxed">
              {signature}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Step 5: Understanding signAndSendTransaction

The `signAndSendTransaction` method is the core of Lazorkit's gasless functionality:

```typescript
const signature = await signAndSendTransaction({
  // Required: Array of transaction instructions
  instructions: [instruction1, instruction2, ...],

  // Optional: Transaction configuration
  transactionOptions: {
    // Pay gas fees in USDC instead of SOL
    feeToken: 'USDC',

    // Set compute unit limit (default: 200,000)
    computeUnitLimit: 500_000,

    // Use address lookup tables for versioned transactions
    addressLookupTableAccounts: [...],

    // Specify cluster for simulation
    clusterSimulation: 'devnet', // or 'mainnet'
  },
});
```

### What Happens Behind the Scenes

1. **Transaction Building**

   - Lazorkit builds a complete transaction from your instructions
   - Adds recent blockhash and fee payer information

2. **User Signing**

   - Portal opens for passkey authentication
   - User signs the transaction with their biometric

3. **Paymaster Processing**

   - Transaction is sent to Lazorkit's Paymaster
   - Paymaster adds its signature (sponsors the gas fee)
   - Transaction is submitted to Solana network

4. **Confirmation**
   - Transaction is processed by Solana validators
   - Confirmation is returned with transaction signature

## Step 6: Add All Components to Your Page

Update your main page to include all transaction components.

**Update `app/page.tsx`:**

```typescript
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";
import { TransferForm } from "@/components/TransferForm";
import { USDCTransferForm } from "@/components/USDCTransferForm";
import { SignMessage } from "@/components/SignMessage";
import { ActivityLog } from "@/components/ActivityLog";

export default function Home() {
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
            <USDCTransferForm />
            <SignMessage />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Step 7: Testing Your Implementation

### Get Devnet SOL

1. **Copy your wallet address** from the connected wallet display
2. **Visit Solana Faucet**: https://faucet.solana.com
3. **Request airdrop** and wait ~30 seconds
4. **Refresh your app** to see the balance update

### Test All Components

1. **SOL Transfer**

   - Enter a recipient address (you can use your own for testing)
   - Enter a small amount (try 0.01 SOL)
   - Click "Send Transaction" and authenticate with passkey
   - View confirmation and click the Explorer link

2. **USDC Transfer** (Optional - requires USDC balance)

   - Get some Devnet USDC from a DEX like Jupiter
   - Try the USDC transfer form
   - Pay gas fees in USDC instead of SOL

3. **Message Signing**

   - Enter any text message
   - Click "Sign Message" and authenticate
   - See your cryptographic signature

4. **Activity Log**
   - View your transaction history
   - Refresh to see new transactions

## Advanced Features

### Multiple Instructions

Send multiple operations in a single transaction:

```typescript
const instructions = [
  // Transfer 1
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient1,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),

  // Transfer 2
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient2,
    lamports: 0.2 * LAMPORTS_PER_SOL,
  }),
];

const signature = await signAndSendTransaction({
  instructions,
});
```

### Custom Transaction Options

```typescript
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    // Skip preflight checks (faster but less safe)
    skipPreflight: false,

    // Set max retries
    maxRetries: 3,

    // Preflighted commitment level
    preflightCommitment: "confirmed",
  },
});
```

## HTTPS Requirement for Production

**Important:** WebAuthn requires HTTPS for transaction signing in production.

**Development (localhost):**

- Wallet connection works
- Balance checking works
- Transaction signing may fail

**Production (HTTPS):**

- All features work perfectly

**Quick deployment options:**

- [Vercel](https://vercel.com) - Automatic HTTPS
- [Netlify](https://netlify.com) - Automatic HTTPS
- Any cloud provider with SSL certificate

## Error Handling Best Practices

### Common Errors and Solutions

```typescript
const handleTransfer = async () => {
  try {
    // ... transaction logic
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Handle specific error types
      if (err.message.includes("insufficient funds")) {
        setError("Not enough SOL for this transfer");
      } else if (err.message.includes("Invalid public key")) {
        setError("Please enter a valid Solana address");
      } else if (err.message.includes("User rejected")) {
        setError("Transaction was cancelled");
      } else if (err.message.includes("Network error")) {
        setError("Network issue. Please try again.");
      } else {
        setError(`Transaction failed: ${err.message}`);
      }
    } else {
      setError("An unexpected error occurred");
    }
  }
};
```

### Input Validation

```typescript
// Validate Solana address format
const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Validate amount
const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !Number.isNaN(num) && num > 0 && num <= 1000; // reasonable limits
};
```

## Performance Optimization

### Batch Multiple Operations

Instead of sending multiple transactions:

```typescript
// Multiple transactions (slower, more expensive)
await signAndSendTransaction({ instructions: [instruction1] });
await signAndSendTransaction({ instructions: [instruction2] });

// Single transaction with multiple instructions (faster, cheaper)
await signAndSendTransaction({
  instructions: [instruction1, instruction2],
});
```

### Optimize Compute Units

For complex transactions, set appropriate compute limits:

```typescript
const signature = await signAndSendTransaction({
  instructions: [complexInstruction],
  transactionOptions: {
    computeUnitLimit: 1_000_000, // Increase for complex operations
  },
});
```

## Security Considerations

### Input Sanitization

Always validate user inputs:

```typescript
// Sanitize recipient address
const sanitizedRecipient = recipient.trim();
if (!sanitizedRecipient) {
  throw new Error("Recipient address is required");
}

// Validate amount bounds
if (solAmount > 1000) {
  throw new Error("Amount too large for safety");
}
```

### Transaction Limits

Implement reasonable limits:

```typescript
const MAX_TRANSFER_AMOUNT = 10; // SOL
const MIN_TRANSFER_AMOUNT = 0.000001; // SOL

if (solAmount > MAX_TRANSFER_AMOUNT) {
  throw new Error(`Maximum transfer amount is ${MAX_TRANSFER_AMOUNT} SOL`);
}
```

## Next Steps

Now that you understand gasless transactions:

1. **Build token transfer forms** for other SPL tokens
2. **Implement transaction history** and activity logs
3. **Add swap functionality** using Jupiter or other DEXs
4. **Create payment flows** for e-commerce applications
5. **Build DeFi interfaces** with lending, staking, etc.

## Resources

- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Solana Cookbook - Transactions](https://solanacookbook.com/core-concepts/transactions.html)
- [Lazorkit API Reference](https://docs.lazorkit.com/react/useWallet)
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
- [Solana Program Library](https://spl.solana.com/)

---

**Congratulations!** You've successfully implemented gasless Solana transactions with Lazorkit. Your users can now send SOL, USDC, and sign messages without worrying about gas fees or managing SOL balances.
