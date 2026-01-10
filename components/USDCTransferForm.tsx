"use client";

import { useWallet } from "@lazorkit/wallet";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// USDC Mint Address on Devnet
const USDC_MINT_DEVNET = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
);

// SPL Token Program ID
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

/**
 * USDCTransferForm Component
 * Demonstrates how to send gasless SPL token (USDC) transactions with Lazorkit.
 */
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

      // Convert USDC amount to smallest unit (6 decimals)
      const usdcAmount = Math.floor(parseFloat(amount) * 1_000_000);

      // Helper function to get Associated Token Address
      const getATA = (mint: PublicKey, owner: PublicKey): PublicKey => {
        const [ata] = PublicKey.findProgramAddressSync(
          [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), // Associated Token Program
        );
        return ata;
      };

      const senderATA = getATA(USDC_MINT_DEVNET, smartWalletPubkey);
      const recipientATA = getATA(USDC_MINT_DEVNET, recipientPubkey);

      // Create SPL token transfer instruction
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
      // Pay gas in USDC option
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC",
        },
      });

      setTxSignature(signature);
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      console.error("USDC transfer failed:", err);
      // Provide helpful error messages
      if (
        err.message?.includes("TokenAccountNotFoundError") ||
        err.message?.includes("AccountNotFound")
      ) {
        setError(
          "USDC account not found. Make sure you have USDC in your wallet.",
        );
      } else if (err.message?.includes("insufficient funds")) {
        setError("Insufficient USDC balance");
      } else {
        setError(err.message || "Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 border-dashed border-2 border-slate-200 bg-slate-50/50">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
          <svg
            className="w-8 h-8 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">
          Connect wallet to send USDC
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Gasless token transfers available
        </p>
      </Card>
    );
  }

  return (
    <Card variant="hover" className="relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 p-3 opacity-10 pointer-events-none">
        <svg
          className="w-40 h-40 text-cyan-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
        </svg>
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <h2 className="text-lg font-bold text-slate-900">Send USDC</h2>
        <Badge variant="success">Gasless</Badge>
        <Badge variant="info">SPL Token</Badge>
      </div>

      <form onSubmit={handleTransfer} className="space-y-5 relative z-10">
        <Input
          label="Recipient Address"
          placeholder="Solana address..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />

        <div>
          <Input
            label="Amount"
            placeholder="10.00"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            rightElement={
              <span className="font-bold text-slate-500 text-sm">USDC</span>
            }
            required
          />
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Make sure you have USDC in your wallet first
          </p>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20"
        >
          {loading ? "Processing..." : "Send USDC"}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-enter">
          <div className="text-red-500 mt-0.5">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {txSignature && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg animate-enter">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold text-emerald-900 text-sm">
              USDC Transfer Successful!
            </p>
          </div>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 ml-7"
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
    </Card>
  );
}
