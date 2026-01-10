'use client';

import { useWallet } from '@lazorkit/wallet';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useState } from 'react';

/**
 * USDCTransferForm Component
 * 
 * Demonstrates how to send gasless SPL token (USDC) transactions with Lazorkit.
 * 
 * Key features:
 * 1. Uses Lazorkit's signAndSendTransaction with feeToken option
 * 2. Can pay gas fees in USDC instead of SOL
 * 3. Same simple API as SOL transfers
 * 
 * The Paymaster handles gas sponsorship for token transfers too.
 */

// USDC Mint Address on Devnet
const USDC_MINT_DEVNET = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export function USDCTransferForm() {
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
      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);

      // Convert USDC amount to smallest unit (6 decimals)
      const usdcAmount = Math.floor(parseFloat(amount) * 1_000_000);

      // Helper function to get Associated Token Address
      const getATA = (mint: PublicKey, owner: PublicKey): PublicKey => {
        const [ata] = PublicKey.findProgramAddressSync(
          [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL') // Associated Token Program
        );
        return ata;
      };

      const senderATA = getATA(USDC_MINT_DEVNET, smartWalletPubkey);
      const recipientATA = getATA(USDC_MINT_DEVNET, recipientPubkey);

      // Create SPL token transfer instruction manually
      // This is the same as what @solana/spl-token does, but without the dependency
      const keys = [
        { pubkey: senderATA, isSigner: false, isWritable: true },
        { pubkey: recipientATA, isSigner: false, isWritable: true },
        { pubkey: smartWalletPubkey, isSigner: true, isWritable: false },
      ];

      const data = Buffer.alloc(9);
      data.writeUInt8(3, 0); // Transfer instruction
      data.writeBigUInt64LE(BigInt(usdcAmount), 1);

      const instruction = new TransactionInstruction({
        keys,
        programId: TOKEN_PROGRAM_ID,
        data,
      });

      // Sign and send transaction with Lazorkit
      // Optional: Pay gas fees in USDC instead of SOL
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: 'USDC', // Pay gas in USDC!
        },
      });

      setTxSignature(signature);
      setRecipient('');
      setAmount('');
    } catch (err: any) {
      console.error('USDC transfer failed:', err);

      // Provide helpful error messages
      if (err.message?.includes('TokenAccountNotFoundError') || err.message?.includes('AccountNotFound')) {
        setError('USDC account not found. Make sure you have USDC in your wallet.');
      } else if (err.message?.includes('insufficient funds')) {
        setError('Insufficient USDC balance');
      } else {
        setError(err.message || 'Transaction failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Connect your wallet to send USDC</p>
          <p className="text-sm text-gray-500 mt-1">Gasless token transfers powered by Lazorkit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Send USDC</h2>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Gasless</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">SPL Token</span>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label htmlFor="usdc-recipient" className="block text-sm font-semibold text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            id="usdc-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all font-mono text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="usdc-amount" className="block text-sm font-semibold text-gray-700 mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              id="usdc-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10.00"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">USDC</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">💡 Make sure you have USDC in your wallet first</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Send USDC
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl">❌</span>
            <div>
              <p className="font-semibold text-red-900 text-sm">Transaction Failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {txSignature && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✅</span>
            <div className="flex-1">
              <p className="font-semibold text-green-900 text-sm mb-2">USDC Transfer Successful!</p>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium group"
              >
                View on Solana Explorer
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
