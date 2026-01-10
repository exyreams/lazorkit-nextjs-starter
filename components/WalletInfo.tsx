'use client';

import { useWallet } from '@lazorkit/wallet';
import { useEffect, useState } from 'react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * WalletInfo Component
 * 
 * Displays wallet information including:
 * - Smart wallet address (your Solana address)
 * - SOL balance
 * - Platform information
 * 
 * This component demonstrates how to:
 * 1. Access wallet data from the useWallet hook
 * 2. Query on-chain balance using Solana web3.js
 */
export function WalletInfo() {
  const { wallet, smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (!smartWalletPubkey) return;

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const connection = new Connection('https://api.devnet.solana.com');
        const balanceLamports = await connection.getBalance(smartWalletPubkey);
        setBalance(balanceLamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [smartWalletPubkey]);

  // Manual refresh function
  const handleRefresh = async () => {
    if (!smartWalletPubkey) return;

    setLoading(true);
    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const balanceLamports = await connection.getBalance(smartWalletPubkey);
      setBalance(balanceLamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Connect your wallet to see details</p>
          <p className="text-sm text-gray-500 mt-1">Click "Connect Wallet" above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Wallet Information
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          title="Refresh balance"
        >
          <svg
            className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
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
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Smart Wallet Address</p>
          <p className="font-mono text-sm break-all text-gray-900 leading-relaxed">{wallet.smartWallet}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-gray-600 mb-1">Balance</p>
            {loading ? (
              <div className="h-7 w-24 bg-blue-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                {balance !== null ? `${balance.toFixed(4)}` : 'N/A'}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">SOL</p>
          </div>

          <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <p className="text-xs font-medium text-gray-600 mb-1">Platform</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{wallet.platform}</p>
            <p className="text-xs text-gray-500 mt-1">Device</p>
          </div>
        </div>

        {wallet.accountName && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs font-medium text-gray-600 mb-1">Account Name</p>
            <p className="text-sm font-medium text-gray-900">{wallet.accountName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
