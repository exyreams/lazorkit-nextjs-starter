"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@lazorkit/wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowUpRight,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";

interface ActivityItem {
  signature: string;
  slot: number;
  err: unknown;
  memo: string | null;
  blockTime?: number | null;
  confirmationStatus?: string | null;
  type: "send" | "receive" | "interaction" | "unknown";
}

const RPC_URL = "https://api.devnet.solana.com";

export function ActivityLog() {
  const { wallet } = useWallet();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    if (!wallet?.smartWallet) return;

    setLoading(true);
    setError(null);
    try {
      const connection = new Connection(RPC_URL);
      const pubkey = new PublicKey(wallet.smartWallet);

      const signatures = await connection.getSignaturesForAddress(pubkey, {
        limit: 10,
      });

      const items: ActivityItem[] = signatures.map((sig) => ({
        signature: sig.signature,
        slot: sig.slot,
        err: sig.err,
        memo: sig.memo,
        blockTime: sig.blockTime,
        confirmationStatus: sig.confirmationStatus,
        type: "interaction", // Simplified type inference
      }));

      setActivities(items);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, [wallet?.smartWallet]);

  useEffect(() => {
    if (wallet?.smartWallet) {
      fetchActivity();
    }
  }, [fetchActivity, wallet?.smartWallet]);

  const getTimeAgo = (timestamp?: number | null) => {
    if (!timestamp) return "Unknown time";
    const diff = Math.floor(Date.now() / 1000 - timestamp);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border border-dashed border-border/50 rounded-2xl bg-muted/5">
        <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Wallet Not Connected
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Connect your wallet to view activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Transaction History
        </h3>
        <button
          type="button"
          onClick={fetchActivity}
          className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1.5 uppercase transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Syncing..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-xs text-red-400 bg-red-500/5 rounded-xl border border-red-500/10">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground/50 text-xs italic">
            No transactions found for this wallet.
          </div>
        ) : (
          activities.map((item) => (
            <div
              key={item.signature}
              className="group flex flex-col gap-2 p-4 bg-muted/20 border border-border/50 rounded-xl hover:bg-muted/30 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center border
                    ${
                      item.err
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }
                  `}
                  >
                    {item.err ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {item.err ? "Failed Transaction" : "Transaction"}
                      </span>
                      <Badge
                        variant={item.err ? "error" : "success"}
                        size="sm"
                        className="opacity-80 scale-75 origin-left"
                      >
                        {item.err ? "FAILED" : "SUCCESS"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                      {item.memo
                        ? item.memo
                        : "Interaction with Solana Program"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground/40 mt-1 uppercase flex items-center gap-1">
                  {getTimeAgo(item.blockTime)}
                </span>
              </div>

              <div className="mt-1 pl-11">
                <a
                  href={`https://explorer.solana.com/tx/${item.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary/60 hover:text-primary transition-colors flex items-center gap-1 w-fit border-b border-primary/20 hover:border-primary pb-0.5"
                >
                  VIEW EXPLORER
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-muted-foreground/40 font-sans">
          Showing last 10 transactions on Devnet
        </p>
      </div>
    </div>
  );
}
