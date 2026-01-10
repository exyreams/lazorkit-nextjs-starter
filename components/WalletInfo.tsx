"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/**
 * WalletInfo Component
 * Displays wallet information including address, balance, and platform.
 */
export function WalletInfo() {
  const { wallet, smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (!smartWalletPubkey) return;

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const connection = new Connection("https://api.devnet.solana.com");
        const balanceLamports = await connection.getBalance(smartWalletPubkey);
        setBalance(balanceLamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [smartWalletPubkey]);

  const handleRefresh = async () => {
    if (!smartWalletPubkey) return;

    setLoading(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const balanceLamports = await connection.getBalance(smartWalletPubkey);
      setBalance(balanceLamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (wallet?.smartWallet) {
      navigator.clipboard.writeText(wallet.smartWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!wallet) {
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">
          Connect wallet to view details
        </p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Wallet Overview</h2>
          <p className="text-xs text-slate-500">Manage your smart account</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="rounded-full w-8 h-8 p-0"
          title="Refresh balance"
        >
          <svg
            className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Button>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white shadow-lg shadow-slate-500/10">
          <p className="text-slate-400 text-xs font-medium mb-1">
            Total Balance
          </p>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-32 bg-slate-700/50 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-3xl font-bold tracking-tight">
                {balance !== null
                  ? balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })
                  : "---"}
              </h3>
            )}
            <span className="text-slate-400 font-semibold text-sm">SOL</span>
          </div>
        </div>

        {/* Address Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Smart Account
            </span>
            <Badge variant="success">Active</Badge>
          </div>
          <div
            onClick={copyToClipboard}
            className="flex items-center justify-between p-3 bg-white/50 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-white cursor-pointer transition-all group/address"
          >
            <span className="font-mono text-sm text-slate-700 truncate mr-4">
              {wallet.smartWallet}
            </span>
            <span className="text-slate-400 group-hover/address:text-blue-500 transition-colors">
              {copied ? (
                <svg
                  className="w-4 h-4 text-emerald-500"
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
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </span>
          </div>
        </div>

        {/* Device Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-1">Platform</p>
            <p className="text-sm font-semibold text-slate-900 capitalize flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {wallet.platform}
            </p>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-1">Passkey</p>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.5-4m1.5 8l1.5 1.5 1.5-1.5 1.5 1.5"
                />
              </svg>
              Synced
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
