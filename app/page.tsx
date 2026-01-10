import { ConnectButton } from '@/components/ConnectButton';
import { WalletInfo } from '@/components/WalletInfo';
import { TransferForm } from '@/components/TransferForm';
import { USDCTransferForm } from '@/components/USDCTransferForm';
import { SignMessage } from '@/components/SignMessage';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lazorkit Starter</h1>
              <p className="text-xs text-gray-500">Passkey-native Solana</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Docs
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Development Notice */}
        {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-900 mb-1">Development Mode</p>
                <p className="text-sm text-amber-800">
                  Transaction signing requires HTTPS. Deploy to Vercel/Netlify for full functionality.
                  Connection and balance checking work locally.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            ✨ No Seed Phrases Required
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Lazorkit
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience Solana with <span className="font-semibold text-gray-900">FaceID</span>, <span className="font-semibold text-gray-900">TouchID</span>, or <span className="font-semibold text-gray-900">Windows Hello</span>.
            Create a smart wallet and send gasless transactions in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
            <div className="mb-4 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image
                src="/icons/passkey.svg"
                alt="Passkey"
                width={32}
                height={32}
                className="text-blue-600"
              />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Passkey Authentication</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              No seed phrases. Just use your device's biometric authentication.
            </p>
          </div>

          <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
            <div className="mb-4 w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image
                src="/icons/lightning.svg"
                alt="Lightning"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Gasless Transactions</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Send transactions without holding SOL. Paymaster covers the fees.
            </p>
          </div>

          <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300">
            <div className="mb-4 w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image
                src="/icons/wallet.svg"
                alt="Wallet"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Smart Wallets</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Programmable accounts with recovery and session key support.
            </p>
          </div>
        </div>

        {/* Wallet Dashboard */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <WalletInfo />
          <div className="space-y-6">
            <TransferForm />
            <USDCTransferForm />
          </div>
        </div>

        {/* Sign Message Section */}
        <div className="max-w-2xl mx-auto">
          <SignMessage />
        </div>

        {/* Resources */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <h3 className="font-bold text-xl mb-4 text-gray-900">Learn More</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="https://docs.lazorkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
            >
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Documentation</p>
                <p className="text-xs text-gray-500">Full SDK docs</p>
              </div>
            </a>
            <a
              href="https://github.com/lazor-kit/lazor-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
            >
              <span className="text-2xl">💻</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">GitHub</p>
                <p className="text-xs text-gray-500">Source code</p>
              </div>
            </a>
            <a
              href="https://t.me/lazorkit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Telegram</p>
                <p className="text-xs text-gray-500">Join community</p>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Built with ❤️ for the Lazorkit Bounty | Powered by Solana</p>
        </footer>
      </main>
    </div>
  );
}
