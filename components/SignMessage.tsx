/**
 * @fileoverview Message Signing Component
 *
 * This component demonstrates cryptographic message signing using
 * Lazorkit's passkey authentication. It provides off-chain message
 * signing capabilities for authentication and verification purposes.
 *
 * Key Features:
 * - Off-chain message signing (no transaction fees)
 * - Passkey-based cryptographic signatures
 * - Custom message input with validation
 * - Signature display and verification
 * - User-friendly error handling
 * - Real-time signing feedback
 *
 * Use Cases:
 * - User authentication and identity verification
 * - Proof of wallet ownership
 * - Off-chain authorization for dApps
 * - Message attestation and verification
 *
 * @author exyreams
 * @version 1.0.0
 */

"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/**
 * SignMessage Component
 *
 * Demonstrates cryptographic message signing with Lazorkit passkeys.
 * This component provides off-chain signing capabilities that can be used
 * for authentication, verification, and proof of wallet ownership.
 *
 * The signing process uses the wallet's private key (secured by passkey)
 * to create a cryptographic signature that can be verified by third parties.
 *
 * State Management:
 * - message: Text message to be signed
 * - signature: Generated cryptographic signature
 * - loading: Signing process state
 * - error: Error messages for failed signing attempts
 *
 * @returns JSX element containing message signing form or connection prompt
 */
export function SignMessage() {
  const { signMessage, isConnected } = useWallet();

  /** Text message to be signed */
  const [message, setMessage] = useState("");

  /** Generated cryptographic signature */
  const [signature, setSignature] = useState("");

  /** Signing process state */
  const [loading, setLoading] = useState(false);

  /** Error message for failed signing attempts */
  const [error, setError] = useState("");

  /**
   * Handle message signing form submission
   * Processes the message signing with passkey authentication
   *
   * @param e - Form submission event
   */
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
      <Card className="flex flex-col items-center justify-center py-12 border-dashed border-2 border-border bg-muted/10">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 shadow-inner border border-border">
          <svg
            className="w-8 h-8 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Sign Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground font-medium font-mono">
          Connect wallet to sign messages
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1 uppercase tracking-wider">
          Prove ownership securely
        </p>
      </Card>
    );
  }

  return (
    <Card variant="hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground font-mono">
          Sign Message
        </h2>
        <Badge variant="neutral">Off-chain</Badge>
      </div>

      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-xs font-semibold text-muted-foreground mb-2 font-mono uppercase tracking-wider"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter any message to sign..."
            rows={4}
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-foreground placeholder-muted-foreground resize-none transition-all duration-200 font-mono text-sm"
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
            This action verifies your identity without costing gas.
          </p>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          {loading ? "Signing..." : "Sign Message"}
        </Button>
      </form>

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
          <p className="text-sm text-red-500 font-mono">{error}</p>
        </div>
      )}

      {signature && (
        <div className="mt-6 p-4 bg-muted/20 border border-border rounded-xl animate-enter">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Success Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-bold text-foreground text-sm font-mono">
              Signature Generated
            </p>
          </div>

          <div className="group relative">
            <div className="bg-black/30 p-3 rounded-lg border border-border shadow-inner hover:border-primary/50 transition-colors">
              <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                {signature}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
