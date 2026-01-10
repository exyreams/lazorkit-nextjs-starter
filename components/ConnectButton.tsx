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
        <div className="hidden sm:flex items-center gap-2 pl-2 pr-1 py-1 bg-muted/50 backdrop-blur-sm border border-border rounded-full">
          <div className="flex items-center gap-2 px-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-mono font-medium text-foreground">
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
          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
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
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
    >
      {isConnecting ? "Authenticating..." : "Connect Wallet"}
    </Button>
  );
}
