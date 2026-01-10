'use client';

import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';

/**
 * SignMessage Component
 * 
 * Demonstrates how to sign messages with Lazorkit passkeys.
 * 
 * Use cases:
 * - Verify wallet ownership
 * - Sign authentication challenges
 * - Prove identity without transactions
 * 
 * The signMessage method uses the user's passkey to sign arbitrary text.
 */
export function SignMessage() {
  const { signMessage, isConnected } = useWallet();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    setLoading(true);
    setError('');
    setSignature('');

    try {
      // Sign the message using the passkey
      const result = await signMessage(message);

      // The result contains the signature and the signed payload
      setSignature(result.signature);
      console.log('Signed payload:', result.signedPayload);
    } catch (err: any) {
      console.error('Signing failed:', err);
      setError(err.message || 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Connect your wallet to sign messages</p>
          <p className="text-sm text-gray-500 mt-1">Prove ownership without transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Sign Message</h2>
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">No Gas</span>
      </div>

      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            Message to Sign
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter any message to sign with your passkey..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 resize-none transition-all"
            required
          />
          <p className="text-xs text-gray-500 mt-2">💡 Use this to prove wallet ownership or authenticate</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Sign Message
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl">❌</span>
            <div>
              <p className="font-semibold text-red-900 text-sm">Signing Failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {signature && (
        <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <span className="text-purple-500 text-xl">✅</span>
            <div className="flex-1">
              <p className="font-semibold text-purple-900 text-sm mb-3">Message Signed Successfully!</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-purple-700 font-semibold mb-2 uppercase tracking-wide">Signature</p>
                  <div className="bg-white p-3 rounded-lg border border-purple-200">
                    <p className="text-xs font-mono text-purple-900 break-all leading-relaxed">
                      {signature}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
