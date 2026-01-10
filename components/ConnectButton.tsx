'use client';

import { useWallet } from '@lazorkit/wallet';

/**
 * ConnectButton Component
 * 
 * Handles user authentication with Lazorkit passkeys.
 * - When disconnected: Shows "Connect Wallet" button
 * - When connected: Shows wallet address and disconnect button
 * 
 * The connect() method triggers the passkey authentication flow.
 * Users will authenticate using FaceID, TouchID, or Windows Hello.
 */
export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

  // Show disconnect button when wallet is connected
  if (isConnected && wallet) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-700">
            <span className="font-mono font-semibold text-gray-900">{wallet.smartWallet.slice(0, 6)}...{wallet.smartWallet.slice(-4)}</span>
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200 transition-all font-medium text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Show connect button when wallet is not connected
  return (
    <button
      onClick={() => connect()}
      disabled={isConnecting}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-md hover:shadow-lg disabled:shadow-none"
    >
      {isConnecting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}
