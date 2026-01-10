# Tutorial 1: Setting Up Passkey Authentication

Learn how to integrate Lazorkit's passkey authentication into your Next.js application.

## What You'll Build

A complete authentication flow that allows users to:
- Create a wallet using biometrics (FaceID, TouchID, Windows Hello)
- Connect and disconnect from your app
- Persist sessions across page refreshes

## Prerequisites

- Basic knowledge of React and Next.js
- Node.js 18+ installed
- A modern browser with WebAuthn support

## Step 1: Install Dependencies

First, install the required packages:

```bash
bun add @lazorkit/wallet @solana/web3.js @coral-xyz/anchor buffer
bun add -d vite-plugin-node-polyfills
```

**What each package does:**
- `@lazorkit/wallet` - Core Lazorkit SDK for React
- `@solana/web3.js` - Solana blockchain interactions
- `@coral-xyz/anchor` - Solana program framework (peer dependency)
- `buffer` - Node.js Buffer polyfill for browser
- `vite-plugin-node-polyfills` - Polyfills for Next.js

## Step 2: Set Up the Provider

Create a provider component to wrap your app with Lazorkit context.

**Create `app/providers.tsx`:**

```typescript
'use client';

import { LazorkitProvider } from '@lazorkit/wallet';
import { ReactNode } from 'react';

// Polyfill Buffer for client-side
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

// Devnet Configuration
const CONFIG = {
  RPC_URL: 'https://api.devnet.solana.com',
  PORTAL_URL: 'https://portal.lazor.sh',
  PAYMASTER: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com',
  },
};

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
```

**Key points:**
- `'use client'` directive is required for client-side hooks
- Buffer polyfill is needed for Solana web3.js
- Configuration uses Devnet for testing

## Step 3: Wrap Your App

Update your root layout to include the provider.

**Update `app/layout.tsx`:**

```typescript
import { Providers } from './providers';

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

## Step 4: Create the Connect Button

Now create a component that handles wallet connection.

**Create `components/ConnectButton.tsx`:**

```typescript
'use client';

import { useWallet } from '@lazorkit/wallet';

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

  // Show disconnect button when connected
  if (isConnected && wallet) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {wallet.smartWallet.slice(0, 8)}...{wallet.smartWallet.slice(-6)}
        </span>
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  // Show connect button when disconnected
  return (
    <button 
      onClick={() => connect()} 
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
```

**Understanding the `useWallet` hook:**

- `connect()` - Opens the Lazorkit portal for passkey authentication
- `disconnect()` - Clears the session and logs out
- `isConnected` - Boolean indicating connection status
- `isConnecting` - Boolean for loading state
- `wallet` - Object containing wallet info (address, platform, etc.)

## Step 5: Use the Connect Button

Add the button to your page.

**Update `app/page.tsx`:**

```typescript
import { ConnectButton } from '@/components/ConnectButton';

export default function Home() {
  return (
    <div>
      <h1>My Lazorkit App</h1>
      <ConnectButton />
    </div>
  );
}
```

## Step 6: Test the Authentication Flow

1. **Start your dev server:**
```bash
bun dev
```

2. **Open http://localhost:3000**

3. **Click "Connect Wallet"**
   - A popup will open to the Lazorkit portal
   - You'll be prompted to create or use a passkey

4. **Complete biometric authentication**
   - Use FaceID, TouchID, or Windows Hello
   - Your device's secure enclave handles the cryptography

5. **You're connected!**
   - The button now shows your wallet address
   - Your session persists across page refreshes

## Understanding What Happened

### Behind the Scenes

1. **Passkey Creation**
   - Your browser creates a WebAuthn credential
   - The private key never leaves your device's secure enclave
   - A public key is registered with Lazorkit

2. **Smart Wallet Generation**
   - Lazorkit creates a Program Derived Address (PDA) on Solana
   - This is your actual wallet address
   - It's controlled by your passkey

3. **Session Persistence**
   - Lazorkit stores session data in localStorage
   - On page refresh, it automatically reconnects
   - No need to re-authenticate every time

## Accessing Wallet Information

The `wallet` object contains useful information:

```typescript
const { wallet } = useWallet();

console.log(wallet?.smartWallet);    // Your Solana address (Base58)
console.log(wallet?.credentialId);   // WebAuthn credential ID
console.log(wallet?.platform);       // Device platform info
console.log(wallet?.accountName);    // Account name (if set)
```

## Common Issues

### "Buffer is not defined"
**Solution:** Make sure the Buffer polyfill is in your providers.tsx:
```typescript
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

### Portal popup is blocked
**Solution:** Check your browser's popup blocker settings. Allow popups for your domain.

### Connection works but wallet is undefined
**Solution:** Make sure you're checking `isConnected` before accessing `wallet`:
```typescript
if (isConnected && wallet) {
  // Safe to use wallet here
}
```

## Next Steps

Now that you have authentication working, you can:
- Display wallet balance ([Tutorial 2](./TUTORIAL_2.md))
- Send transactions ([Tutorial 2](./TUTORIAL_2.md))
- Sign messages for verification
- Build your dApp features

## Advanced: Custom Connection Options

You can pass options to the `connect()` method:

```typescript
await connect({ 
  feeMode: 'paymaster' // or 'user'
});
```

## Security Notes

- **Private keys never leave the device** - They're stored in the secure enclave
- **No seed phrases** - Users can't lose or leak their keys
- **Biometric authentication** - More secure than passwords
- **Session tokens** - Stored locally, cleared on disconnect

## Resources

- [Lazorkit Docs - useWallet Hook](https://docs.lazorkit.com/react/useWallet)
- [WebAuthn Guide](https://webauthn.guide/)
- [Solana PDAs Explained](https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses)

---

**Next Tutorial:** [Sending Gasless Transactions →](./TUTORIAL_2.md)
