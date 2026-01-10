"use client";

import { useWallet } from "@lazorkit/wallet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * ConnectButton Component
 *
 * Handles user authentication with Lazorkit passkeys.
 */
export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();

  // Show disconnect button when wallet is connected
  if (isConnected && wallet) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 pl-2 pr-1 py-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
          <div className="flex items-center gap-2 px-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-mono font-medium text-slate-700">
              {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
            </span>
          </div>
          <Badge variant="info" size="sm" className="hidden lg:inline-flex">
            {wallet.platform}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => disconnect()}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  // Show connect button when wallet is not connected
  return (
    <Button
      onClick={() => connect()}
      isLoading={isConnecting}
      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-blue-500/25"
    >
      {isConnecting ? "Authenticating..." : "Connect Wallet"}
    </Button>
  );
}
