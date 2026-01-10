"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * SignMessage Component
 * Demonstrates how to sign messages with Lazorkit passkeys.
 */
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
      // Sign the message using the passkey
      const result = await signMessage(message);

      // The result contains the signature and the signed payload
      setSignature(result.signature);
      console.log("Signed payload:", result.signedPayload);
    } catch (err: any) {
      console.error("Signing failed:", err);
      setError(err.message || "Failed to sign message");
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">
          Connect wallet to sign messages
        </p>
        <p className="text-sm text-slate-400 mt-1">Prove ownership securely</p>
      </Card>
    );
  }

  return (
    <Card variant="hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Sign Message</h2>
        <Badge variant="neutral">Off-chain</Badge>
      </div>

      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter any message to sign..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-400 resize-none transition-all duration-200"
            required
          />
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <svg
              className="w-3 h-3 text-slate-400"
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
            This action verifies your identity without costing gas.
          </p>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
        >
          {loading ? "Signing..." : "Sign Message"}
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

      {signature && (
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-enter">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-bold text-slate-900 text-sm">
              Signature Generated
            </p>
          </div>

          <div className="group relative">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <p className="text-xs font-mono text-slate-600 break-all leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                {signature}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
