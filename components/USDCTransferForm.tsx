/**
 * @fileoverview USDC Transfer Form Component
 *
 * This component demonstrates gasless USDC (SPL Token) transfers using
 * Lazorkit's smart wallet functionality. It showcases advanced features
 * like paying transaction fees with USDC instead of SOL.
 *
 * Key Features:
 * - Gasless USDC transfers with fee sponsorship in USDC
 * - SPL Token program integration
 * - Associated Token Account (ATA) handling
 * - Advanced error handling for token-specific issues
 * - Input validation for USDC amounts (6 decimal precision)
 * - Transaction status feedback with explorer links
 *
 * Technical Implementation:
 * - Uses Solana SPL Token Program for transfers
 * - Automatically derives Associated Token Accounts
 * - Handles USDC mint address for Devnet
 * - Implements proper token transfer instruction format
 *
 * @author exyreams
 * @version 1.0.0
 */

"use client";

import { useWallet } from "@lazorkit/wallet";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

// USDC Mint Address on Devnet - Official USDC token mint
const USDC_MINT_DEVNET = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
);

// SPL Token Program ID - Standard program for all SPL tokens
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

/**
 * USDCTransferForm Component
 *
 * Demonstrates gasless SPL token (USDC) transactions with Lazorkit.
 * This component showcases advanced features like paying transaction
 * fees with USDC tokens instead of SOL, making it truly gasless for users.
 *
 * Key Features:
 * - Fee payment in USDC (no SOL required)
 * - Automatic ATA (Associated Token Account) derivation
 * - Proper SPL token transfer instruction creation
 * - Enhanced error handling for token-specific issues
 * - USDC amount validation with 6 decimal precision
 *
 * State Management:
 * - recipient: Target wallet address for USDC transfer
 * - amount: USDC amount to transfer (in USDC units)
 * - loading: Transaction processing state
 * - txSignature: Successful transaction signature
 * - error: Error messages with token-specific context
 *
 * @returns JSX element containing USDC transfer form or connection prompt
 */
export function USDCTransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } =
    useWallet();

  /** Target wallet address for USDC transfer */
  const [recipient, setRecipient] = useState("");

  /** USDC amount to transfer */
  const [amount, setAmount] = useState("");

  /** Transaction processing state */
  const [loading, setLoading] = useState(false);

  /** Successful transaction signature */
  const [txSignature, setTxSignature] = useState("");

  /** Error message for failed transactions */
  const [error, setError] = useState("");

  /**
   * Handle USDC transfer form submission
   * Processes SPL token transfer with comprehensive validation and ATA handling
   *
   * @param e - Form submission event
   */
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
       * ATAs are deterministic addresses for token accounts
       *
       * @param mint - Token mint public key
       * @param owner - Wallet owner public key
       * @returns Associated Token Address
       */
      const getATA = (mint: PublicKey, owner: PublicKey): PublicKey => {
        const [ata] = PublicKey.findProgramAddressSync(
          [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), // Associated Token Program
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

      // Sign and send transaction with Lazorkit
      // Pay gas fees in USDC instead of SOL
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC", // This enables USDC fee payment
        },
      });

      setTxSignature(signature);
      setRecipient("");
      setAmount("");
    } catch (err: unknown) {
      console.error("USDC transfer failed:", err);

      // Provide helpful error messages for common token issues
      if (
        (err instanceof Error &&
          err.message?.includes("TokenAccountNotFoundError")) ||
        (err instanceof Error && err.message?.includes("AccountNotFound"))
      ) {
        setError(
          "USDC account not found. Make sure you have USDC in your wallet.",
        );
      } else if (
        err instanceof Error &&
        err.message?.includes("insufficient funds")
      ) {
        setError("Insufficient USDC balance");
      } else {
        setError(err instanceof Error ? err.message : "Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show connection prompt when wallet is not connected
  if (!isConnected) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 border-dashed border-2 border-border bg-muted/10">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 shadow-inner border border-border">
          {/* USDC Icon */}
          <svg
            className="w-8 h-8 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>USDC Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground font-medium font-mono">
          Connect wallet to send USDC
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1 uppercase tracking-wider">
          Gasless token transfers available
        </p>
      </Card>
    );
  }

  return (
    <Card variant="hover" className="relative overflow-hidden group">
      {/* Header Section with Multiple Badges */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <h2 className="text-lg font-bold text-foreground font-mono">
          Send USDC
        </h2>
        <Badge variant="success">Gasless</Badge>
        <Badge variant="info">SPL Token</Badge>
      </div>

      {/* USDC Transfer Form */}
      <form onSubmit={handleTransfer} className="space-y-5 relative z-10">
        {/* Recipient Address Input */}
        <Input
          label="Recipient Address"
          placeholder="Solana address..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />

        {/* Amount Input with USDC suffix and helper text */}
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
              <span className="font-bold text-muted-foreground text-xs font-mono">
                USDC
              </span>
            }
            required
          />
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-mono">
            <svg
              className="w-3 h-3 text-muted-foreground/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Info Icon</title>
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

        {/* Submit Button with Gradient Styling */}
        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20"
        >
          {loading ? "Processing..." : "Send USDC"}
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
          <p className="text-xs text-red-500 font-medium font-mono">{error}</p>
        </div>
      )}

      {/* Success Display with Explorer Link */}
      {txSignature && (
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-enter">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
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
            <p className="font-semibold text-emerald-500 text-sm font-mono">
              USDC Transfer Successful!
            </p>
          </div>
          {/* Explorer Link */}
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline flex items-center gap-1 ml-7 font-mono"
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
