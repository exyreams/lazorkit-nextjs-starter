"use client";

import { Badge } from "@/components/ui/Badge";

interface ActivityItem {
  id: string;
  type: "SEND_SOL" | "SEND_USDC" | "SIGN_MSG" | "CONNECT";
  status: "success" | "pending" | "error";
  timestamp: string;
  details: string;
  signature?: string;
}

const DUMMY_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "SEND_SOL",
    status: "success",
    timestamp: "2 mins ago",
    details: "Sent 0.05 SOL to 8chC...Gac2",
    signature: "5Kc...z9b",
  },
  {
    id: "2",
    type: "SIGN_MSG",
    status: "success",
    timestamp: "12 mins ago",
    details: "Authenticated session for Devnet Ops",
  },
  {
    id: "3",
    type: "SEND_USDC",
    status: "success",
    timestamp: "1 hour ago",
    details: "Transferred 10.00 USDC (Gasless)",
    signature: "x2g...88h",
  },
  {
    id: "4",
    type: "CONNECT",
    status: "success",
    timestamp: "2 hours ago",
    details: "Connected via Windows Hello (Passkey)",
  },
];

export function ActivityLog() {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Recent Activity
        </h3>
        <span className="text-[10px] text-muted-foreground/50 uppercase">
          Auto-refresh active
        </span>
      </div>

      <div className="space-y-3">
        {DUMMY_ACTIVITY.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col gap-2 p-4 bg-muted/20 border border-border/50 rounded-xl hover:bg-muted/30 hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-[10px] border
                  ${
                    item.type === "SEND_SOL"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : item.type === "SEND_USDC"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : item.type === "SIGN_MSG"
                          ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                          : "bg-muted text-muted-foreground border-border/50"
                  }
                `}
                >
                  {item.type === "SEND_SOL"
                    ? "SOL"
                    : item.type === "SEND_USDC"
                      ? "USDC"
                      : item.type === "SIGN_MSG"
                        ? "SIG"
                        : "SYS"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {item.type.replace("_", " ")}
                    </span>
                    <Badge
                      variant={
                        item.status === "success" ? "success" : "warning"
                      }
                      size="sm"
                      className="opacity-80 scale-75 origin-left"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.details}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground/40 mt-1 uppercase">
                {item.timestamp}
              </span>
            </div>

            {item.signature && (
              <div className="mt-1 pl-11">
                <a
                  href={`https://explorer.solana.com/tx/${item.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary/60 hover:text-primary transition-colors flex items-center gap-1 w-fit border-b border-primary/20"
                >
                  VIEW_ON_EXPLORER
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    role="img"
                  >
                    <title>External Link</title>
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
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full py-3 text-[10px] text-muted-foreground hover:text-foreground border border-dashed border-border/50 rounded-xl transition-all uppercase tracking-widest hover:bg-muted/20"
      >
        Load Full History
      </button>
    </div>
  );
}
