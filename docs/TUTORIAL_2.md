# Tutorial 2: Sending Gasless Transactions

Learn how to send Solana transactions without requiring users to hold SOL for gas fees.

## What You'll Build

A transaction form that allows users to:
- Send SOL to any address
- Pay zero gas fees (sponsored by Paymaster)
- See transaction confirmations
- Handle errors gracefully

## Prerequisites

- Completed [Tutorial 1: Setting Up Passkey Authentication](./TUTORIAL_1.md)
- Connected wallet with Lazorkit
- Basic understanding of Solana transactions

## Understanding Gasless Transactions

### The Problem with Traditional Wallets

In traditional Solana apps:
1. User needs SOL for gas fees (~0.000005 SOL per transaction)
2. New users must acquire SOL before using your app
3. This creates friction and poor UX

### How Lazorkit Solves This

With Lazorkit's Paymaster:
1. Your app (or Lazorkit) sponsors the gas fees
2. Users can transact immediately after signup
3. Optionally, users can pay fees in USDC instead of SOL

## Step 1: Create the Transfer Form Component

**Create `components/TransferForm.tsx`:**

```typescript
'use client';

import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!smartWalletPubkey) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError('');
    setTxSignature('');

    try {
      // 1. Validate recipient address
      const recipientPubkey = new PublicKey(recipient);
      
      // 2. Convert SOL to lamports (1 SOL = 1 billion lamports)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // 3. Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      // 4. Sign and send transaction (Paymaster sponsors gas)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          // Optional: Pay gas in USDC instead of SOL
          // feeToken: 'USDC',
        },
      });

      setTxSignature(signature);
      setRecipient('');
      setAmount('');
    } catch (err: any) {
      console.error('Transfer failed:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <p>Connect your wallet to send transactions</p>;
  }

  return (
    <form onSubmit={handleTransfer}>
      <div>
        <label>Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter Solana address"
          required
        />
      </div>

      <div>
        <label>Amount (SOL)</label>
        <input
          type="number"
          step="0.001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.1"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Transaction'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {txSignature && (
        <div>
          <p>Transaction Successful!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Solana Explorer →
          </a>
        </div>
      )}
    </form>
  );
}
```

## Step 2: Understanding the Code

### Key Concepts

**1. smartWalletPubkey**
```typescript
const { smartWalletPubkey } = useWallet();
```
This is your wallet's public key as a `PublicKey` object, ready to use in transactions.

**2. Creating Instructions**
```typescript
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipientPubkey,
  lamports,
});
```
Solana transactions are built from instructions. This creates a simple SOL transfer.

**3. Signing and Sending**
```typescript
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: { /* optional config */ },
});
```
This method:
- Builds the transaction
- Opens the Lazorkit portal for signing
- Submits to the Paymaster
- Returns the transaction signature

## Step 3: Transaction Options

The `transactionOptions` object accepts several parameters:

```typescript
transactionOptions: {
  // Pay gas fees in USDC instead of SOL
  feeToken: 'USDC',
  
  // Set compute unit limit (for complex transactions)
  computeUnitLimit: 500_000,
  
  // Use address lookup tables (for versioned transactions)
  addressLookupTableAccounts: [...],
  
  // Specify network for simulation
  clusterSimulation: 'devnet', // or 'mainnet'
}
```

## Step 4: Add to Your Page

**Update `app/page.tsx`:**

```typescript
import { ConnectButton } from '@/components/ConnectButton';
import { TransferForm } from '@/components/TransferForm';

export default function Home() {
  return (
    <div>
      <h1>My Lazorkit App</h1>
      <ConnectButton />
      <TransferForm />
    </div>
  );
}
```

## Step 5: Test the Transaction Flow

### Get Devnet SOL

Before testing, you need Devnet SOL in your wallet:

1. Copy your wallet address from the UI
2. Go to https://faucet.solana.com
3. Paste your address and request airdrop
4. Wait ~30 seconds for confirmation

### Send a Transaction

1. **Enter a recipient address**
   - Use another wallet you control
   - Or use a test address

2. **Enter an amount**
   - Start small (0.01 SOL)

3. **Click "Send Transaction"**
   - Portal opens for signing
   - Authenticate with your passkey
   - Transaction is submitted

4. **View confirmation**
   - Click the Solana Explorer link
   - See your transaction on-chain

## Understanding the Transaction Flow

### What Happens Behind the Scenes

1. **Instruction Creation**
   - Your app creates a Solana instruction
   - This defines what the transaction will do

2. **Transaction Building**
   - Lazorkit builds a complete transaction
   - Adds necessary metadata and recent blockhash

3. **Signing**
   - Portal opens for user authentication
   - User's passkey signs the transaction
   - Signature is cryptographically secure

4. **Paymaster Processing**
   - Transaction is sent to the Paymaster
   - Paymaster adds its signature (pays gas)
   - Transaction is submitted to Solana

5. **Confirmation**
   - Transaction is processed by validators
   - Confirmation is returned to your app
   - You receive the transaction signature

## Advanced: Multiple Instructions

You can send multiple instructions in one transaction:

```typescript
const instructions = [
  // Transfer SOL
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient1,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),
  
  // Another transfer
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

## Advanced: Token Transfers

To transfer SPL tokens (like USDC):

```typescript
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

// Get token accounts
const fromTokenAccount = await getAssociatedTokenAddress(
  USDC_MINT,
  smartWalletPubkey
);

const toTokenAccount = await getAssociatedTokenAddress(
  USDC_MINT,
  recipientPubkey
);

// Create transfer instruction
const instruction = createTransferInstruction(
  fromTokenAccount,
  toTokenAccount,
  smartWalletPubkey,
  1_000_000 // 1 USDC (6 decimals)
);

const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: 'USDC', // Pay gas in USDC
  },
});
```

## Error Handling

### Common Errors

**"Wallet not connected"**
```typescript
if (!smartWalletPubkey) {
  setError('Please connect your wallet first');
  return;
}
```

**"Invalid address"**
```typescript
try {
  const recipientPubkey = new PublicKey(recipient);
} catch {
  setError('Invalid Solana address');
  return;
}
```

**"Insufficient funds"**
```typescript
// Check balance before sending
const connection = new Connection('https://api.devnet.solana.com');
const balance = await connection.getBalance(smartWalletPubkey);

if (balance < lamports) {
  setError('Insufficient balance');
  return;
}
```

## HTTPS Requirement

⚠️ **Important:** Transaction signing requires HTTPS in production.

**On localhost:**
- Connection works ✅
- Balance checking works ✅
- Transaction signing may fail ⚠️

**On HTTPS (Vercel, Netlify):**
- Everything works ✅

Deploy your app to test transactions fully!

## Best Practices

### 1. Always Validate Input
```typescript
if (!recipient || !amount) {
  setError('Please fill all fields');
  return;
}
```

### 2. Show Loading States
```typescript
<button disabled={loading}>
  {loading ? 'Sending...' : 'Send'}
</button>
```

### 3. Clear Form After Success
```typescript
if (signature) {
  setRecipient('');
  setAmount('');
}
```

### 4. Provide Transaction Links
```typescript
<a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}>
  View Transaction
</a>
```

## Testing Checklist

- [ ] Connect wallet successfully
- [ ] Form validates input
- [ ] Loading state shows during transaction
- [ ] Success message displays with signature
- [ ] Error messages show for failures
- [ ] Transaction appears on Solana Explorer
- [ ] Recipient receives the SOL

## Next Steps

Now that you can send transactions, you can:
- Build a token swap interface
- Create a payment checkout flow
- Implement subscription billing
- Add NFT minting
- Build a DAO voting system

## Resources

- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Lazorkit API Reference](https://docs.lazorkit.com/react/useWallet)
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

---

**Congratulations!** You've built a complete Solana app with passkey authentication and gasless transactions. 🎉
