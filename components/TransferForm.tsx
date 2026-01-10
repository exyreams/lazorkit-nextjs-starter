"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * TransferForm Component
 * Demonstrates how to send gasless transactions with Lazorkit.
 */
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

    if (!smartWalletPubkey) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      // Validate recipient address
      let recipientPubkey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch {
        throw new Error("Invalid recipient address");
      }

      // Convert SOL amount to lamports
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      if (isNaN(lamports) || lamports <= 0) {
        throw new Error("Invalid amount");
      }

      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      // Sign and send transaction (Sponsored by Paymaster)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      setTxSignature(signature);
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      console.error("Transfer failed:", err);
      setError(err.message || "Transaction failed");
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">Connect wallet to send SOL</p>
        <p className="text-sm text-slate-400 mt-1">
          Gasless transactions available
        </p>
      </Card>
    );
  }

  return (
    <Card variant="hover" className="relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <svg
          className="w-32 h-32 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 22h20L12 2zm0 4l6.5 13h-13L12 6z" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Send SOL</h2>
        <Badge variant="success">Gasless</Badge>
      </div>

      <form onSubmit={handleTransfer} className="space-y-5 relative z-10">
        <Input
          label="Recipient Address"
          placeholder="Solana address..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />

        <Input
          label="Amount"
          placeholder="0.0"
          type="number"
          step="0.000000001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          rightElement={
            <span className="font-bold text-slate-500 text-sm">SOL</span>
          }
          required
        />

        <Button type="submit" isLoading={loading} className="w-full">
          {loading ? "Processing..." : "Send Transaction"}
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
          <p className="text-sm text-red-600">{error}</p>
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
            <p className="font-semibold text-emerald-900 text-sm">Success!</p>
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
