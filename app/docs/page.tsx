import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lazorkit Starter</h1>
              <p className="text-xs text-gray-500">Documentation</p>
            </div>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Getting Started</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#quick-start" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Quick Start
                    </a>
                  </li>
                  <li>
                    <a href="#installation" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Installation
                    </a>
                  </li>
                  <li>
                    <a href="#configuration" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Configuration
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#passkey-auth" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Passkey Authentication
                    </a>
                  </li>
                  <li>
                    <a href="#gasless-tx" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Gasless Transactions
                    </a>
                  </li>
                  <li>
                    <a href="#message-signing" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Message Signing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Guides</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#deployment" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Deployment
                    </a>
                  </li>
                  <li>
                    <a href="#customization" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Customization
                    </a>
                  </li>
                  <li>
                    <a href="#troubleshooting" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Troubleshooting
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://docs.lazorkit.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      Lazorkit Docs
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/lazor-kit/lazor-kit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      GitHub
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Hero */}
            <section>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                📚 Documentation
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Lazorkit Next.js Starter
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Build Solana applications with passkey authentication and gasless transactions.
                No seed phrases, no wallet extensions—just biometrics.
              </p>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
                <p className="text-gray-600 mb-6">Get up and running in 5 minutes.</p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Install Dependencies</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <code>bun install</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Start Development Server</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <code>bun dev</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Open in Browser</h3>
                      <p className="text-gray-600">
                        Navigate to{' '}
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          http://localhost:3000
                        </code>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> For full functionality including transaction signing, deploy to Vercel or Netlify (HTTPS required).
                  </p>
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Installation</h2>
                <p className="text-gray-600 mb-6">Detailed installation instructions.</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Prerequisites</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Node.js 18+ or Bun</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Modern browser with WebAuthn support (Chrome, Safari, Firefox, Edge)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Git for version control</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Clone Repository</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <code>
                        git clone &lt;your-repo-url&gt;<br />
                        cd lazorkit-nextjs-starter
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Install Packages</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <code>
                        # Using Bun (recommended)<br />
                        bun install<br />
                        <br />
                        # Or using npm<br />
                        npm install
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuration</h2>
                <p className="text-gray-600 mb-6">The app is pre-configured for Solana Devnet.</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Default Configuration</h3>
                    <p className="text-gray-600 mb-3">Located in <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">app/providers.tsx</code>:</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`const CONFIG = {
  RPC_URL: 'https://api.devnet.solana.com',
  PORTAL_URL: 'https://portal.lazor.sh',
  PAYMASTER: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com',
  },
};`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Switch to Mainnet</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`const CONFIG = {
  RPC_URL: 'https://api.mainnet-beta.solana.com',
  PORTAL_URL: 'https://portal.lazor.sh',
  PAYMASTER: {
    paymasterUrl: 'https://kora.mainnet.lazorkit.com',
  },
};`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="passkey-auth" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Passkey Authentication</h2>
                <p className="text-gray-600 mb-6">
                  Secure authentication using device biometrics—no seed phrases required.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
                    <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                      <li>User clicks "Connect Wallet"</li>
                      <li>Browser prompts for biometric authentication</li>
                      <li>Lazorkit creates a smart wallet on Solana</li>
                      <li>Session persists across page refreshes</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Code Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`import { useWallet } from '@lazorkit/wallet';

function MyComponent() {
  const { connect, isConnected, wallet } = useWallet();

  return (
    <button onClick={() => connect()}>
      {isConnected ? wallet?.smartWallet : 'Connect'}
    </button>
  );
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="gasless-tx" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Gasless Transactions</h2>
                <p className="text-gray-600 mb-6">
                  Send transactions without holding SOL for fees—paymaster covers the cost.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>No need to hold SOL for transaction fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Better user experience for newcomers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Optional: Pay fees in USDC instead</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Code Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`import { SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipientPubkey,
  lamports: 0.1 * LAMPORTS_PER_SOL,
});

const signature = await signAndSendTransaction({
  instructions: [instruction],
  // Paymaster handles fees automatically
});`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Deployment */}
            <section id="deployment" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Deployment</h2>
                <p className="text-gray-600 mb-6">Deploy to Vercel for full HTTPS functionality.</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Vercel (Recommended)</h3>
                    <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside mb-4">
                      <li>Push code to GitHub</li>
                      <li>Import repo on Vercel</li>
                      <li>Click "Deploy"</li>
                      <li>Done! (~2 minutes)</li>
                    </ol>
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Deploy to Vercel
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>

                  <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Netlify</h3>
                    <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside mb-4">
                      <li>Build: <code className="text-xs bg-gray-100 px-1 rounded">npm run build</code></li>
                      <li>Deploy: <code className="text-xs bg-gray-100 px-1 rounded">netlify deploy</code></li>
                      <li>Test and go live</li>
                    </ol>
                    <a
                      href="https://netlify.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Deploy to Netlify
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-24">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
                <p className="text-gray-600 mb-6">Common issues and solutions.</p>

                <div className="space-y-4">
                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-gray-900">
                      Transaction fails on localhost
                    </summary>
                    <div className="p-4 text-gray-600 text-sm">
                      <p className="mb-2">
                        <strong>Cause:</strong> WebAuthn requires HTTPS for transaction signing.
                      </p>
                      <p>
                        <strong>Solution:</strong> Deploy to Vercel/Netlify. Connection and balance checking work on localhost.
                      </p>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-gray-900">
                      Balance shows 0.0000 SOL
                    </summary>
                    <div className="p-4 text-gray-600 text-sm">
                      <p className="mb-2">
                        <strong>Cause:</strong> New wallet has no funds.
                      </p>
                      <p>
                        <strong>Solution:</strong> Get free Devnet SOL from{' '}
                        <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          faucet.solana.com
                        </a>
                      </p>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-gray-900">
                      WebAuthn not supported error
                    </summary>
                    <div className="p-4 text-gray-600 text-sm">
                      <p className="mb-2">
                        <strong>Cause:</strong> Browser doesn't support WebAuthn or not on HTTPS.
                      </p>
                      <p>
                        <strong>Solution:</strong> Use Chrome, Safari, Firefox, or Edge. Ensure you're on HTTPS (or localhost for development).
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start building your Solana application with passkey authentication today.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Try Demo
                </Link>
                <a
                  href="https://docs.lazorkit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
                >
                  Lazorkit Docs
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
