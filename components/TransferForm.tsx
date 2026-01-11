/**
 * @fileoverview SOL Transfer Form Component
 *
 * This component demonstrates gasless SOL transfers using Lazorkit's
 * smart wallet functionality. It provides a user-friendly interface
 * for sending SOL transactions without requiring gas fees.
 *
 * Key Features:
 * - Gasless SOL transfers using Lazorkit paymaster
 * - Input validation for addresses and amounts
 * - Transaction status feedback with explorer links
 * - Error handling with user-friendly messages
 * - Loading states during transaction processing
 * - Automatic form reset on successful transactions
 *
 * @author exyreams
 * @version 1.0.0
 */

"use client";

import { useWallet } from "@lazorkit/wallet";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

/**
 * TransferForm Component
 *
 * Demonstrates gasless SOL transfers using Lazorkit's smart wallet.
 * The component handles the complete transaction flow from input
 * validation to transaction confirmation and provides real-time feedback.
 *
 * State Management:
 * - recipient: Target wallet address for the transfer
 * - amount: SOL amount to transfer (in SOL, not lamports)
 * - loading: Transaction processing state
 * - txSignature: Successful transaction signature
 * - error: Error messages for failed transactions
 *
 * Transaction Flow:
 * 1. Validate recipient address format
 * 2. Convert SOL amount to lamports
 * 3. Create SystemProgram transfer instruction
 * 4. Sign and send via Lazorkit (gasless)
 * 5. Display success/error feedback
 *
 * @returns JSX element containing transfer form or connection prompt
 */
export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();

  /** Target wallet address for the transfer */
  const [recipient, setRecipient] = useState("");

  /** SOL amount to transfer */
  const [amount, setAmount] = useState("");

  /** Transaction processing state */
  const [loading, setLoading] = useState(false);

  /** Successful transaction signature */
  const [txSignature, setTxSignature] = useState("");

  /** Error message for failed transactions */
  const [error, setError] = useState("");

  /**
   * Handle SOL transfer form submission
   * Processes the transfer with comprehensive validation and error handling
   *
   * @param e - Form submission event
   */
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure wallet is connected
    if (!smartWalletPubkey) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      // Validate recipient address format
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch {
        throw new Error("Invalid recipient address");
      }

      // Convert SOL amount to lamports and validate
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      if (Number.isNaN(lamports) || lamports <= 0) {
        throw new Error("Invalid amount");
      }

      // Create transfer instruction using Solana System Program
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      // Sign and send transaction (Sponsored by Lazorkit Paymaster)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      // Handle successful transaction
      setTxSignature(signature);
      setRecipient("");
      setAmount("");
    } catch (err: unknown) {
      console.error("Transfer failed:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  // Show connection prompt when wallet is not connected
  if (!isConnected) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 border-dashed border-2 border-border bg-muted/20">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 shadow-inner border border-border">
          {/* Send Icon */}
          <svg
            className="w-8 h-8 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Send Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <p className="text-muted-foreground font-medium font-mono">
          Connect wallet to send SOL
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1 uppercase tracking-wider">
          Gasless transactions available
        </p>
      </Card>
    );
  }

  return (
    <Card variant="hover" className="relative overflow-hidden group">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground font-mono">
          Send SOL
        </h2>
        <Badge variant="success">Gasless</Badge>
      </div>

      {/* Transfer Form */}
      <form onSubmit={handleTransfer} className="space-y-5 relative z-10">
        {/* Recipient Address Input */}
        <Input
          label="Recipient Address"
          placeholder="Solana address..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />

        {/* Amount Input with SOL suffix */}
        <Input
          label="Amount"
          placeholder="0.0"
          type="number"
          step="0.000000001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          rightElement={
            <span className="font-bold text-muted-foreground text-xs font-mono">
              SOL
            </span>
          }
          required
        />

        {/* Submit Button */}
        <Button type="submit" isLoading={loading} className="w-full">
          {loading ? "Processing..." : "Send Transaction"}
        </Button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-enter">
          <div className="text-red-500 mt-0.5">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Error Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-red-400 font-mono">{error}</p>
        </div>
      )}

      {/* Success Display with Explorer Link */}
      {txSignature && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-enter">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Success Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold text-green-500 text-sm font-mono">
              Success!
            </p>
          </div>
          {/* Explorer Link */}
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 hover:text-green-300 hover:underline flex items-center gap-1 ml-7 font-mono"
          >
            View on Explorer
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>External Link Icon</title>
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
