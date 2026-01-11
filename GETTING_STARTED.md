# Getting Started with Lazorkit Next.js Starter

**Build Solana apps without seed phrases in 5 minutes!**

This guide will get you up and running with a fully functional Solana app that uses passkey authentication instead of traditional seed phrases.

## What You'll Build

A complete Solana wallet app featuring:

- **Passkey Authentication** - Login with FaceID, TouchID, or Windows Hello
- **Gasless Transactions** - Send SOL without holding SOL for gas fees
- **USDC Transfers** - Send tokens with fees paid in USDC
- **Message Signing** - Cryptographic message verification
- **Balance Display** - Real-time SOL balance checking

## Prerequisites

- Node.js 18+ installed
- Modern browser with WebAuthn support (Chrome, Safari, Firefox, Edge)
- Basic knowledge of React/Next.js (helpful but not required)

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/exyreams/lazorkit-nextjs-starter.git
cd lazorkit-nextjs-starter

# Install dependencies
bun install
# or npm install

# Start development server
bun dev
# or npm run dev
```

Open http://localhost:3000 in your browser

## Step 2: Connect Your First Wallet (30 seconds)

1. **Click "Connect Wallet"** on the homepage
2. **Lazorkit portal opens** in a popup window
3. **Create or use a passkey** with your fingerprint, face, or PIN
4. **You're connected!** Your wallet address appears in the UI

**That's it!** No seed phrases, no browser extensions, no downloads.

## Step 3: Get Test SOL (1 minute)

To test transactions, you need Devnet SOL:

1. **Copy your wallet address** from the app (click the copy icon)
2. **Visit the Solana Faucet**: https://faucet.solana.com
3. **Paste your address** and click "Confirm Airdrop"
4. **Wait 30 seconds**, then refresh your balance in the app

You should see ~2 SOL in your wallet balance.

## Step 4: Send Your First Transaction (1 minute)

1. **Navigate to the "Send SOL" section**
2. **Enter a recipient address** (you can use your own address to test)
3. **Enter an amount** (try 0.01 SOL)
4. **Click "Send Transaction"**
5. **Authenticate with your passkey** when prompted
6. **Success!** View your transaction on Solana Explorer

**Note:** Transaction signing requires HTTPS. For full functionality, deploy to production (see Step 6).

## Step 5: Try Other Features (2 minutes)

### Message Signing

1. Go to the "Sign Message" section
2. Enter any text message
3. Click "Sign Message" and authenticate
4. See your cryptographic signature

### USDC Transfers (Optional)

1. Get some Devnet USDC from a DEX like Jupiter
2. Try the USDC transfer form
3. Pay gas fees in USDC instead of SOL

## Step 6: Deploy to Production (5 minutes)

For full transaction functionality, deploy to HTTPS:

### Option A: Vercel (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Click "Deploy"

3. **Done!** Your app is live with full HTTPS functionality

### Option B: Netlify

```bash
# Build the app
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## Understanding What You Built

### The Tech Stack

- **Next.js 15** - React framework with App Router
- **Lazorkit SDK** - Passkey authentication and smart wallets
- **Solana Web3.js** - Blockchain interactions
- **Tailwind CSS** - Styling and responsive design
- **TypeScript** - Type safety and better DX

### Key Components

- **`ConnectButton`** - Handles wallet connection/disconnection
- **`WalletInfo`** - Displays wallet details and balance
- **`TransferForm`** - Gasless SOL transaction form
- **`USDCTransferForm`** - Token transfer with USDC fee payment
- **`SignMessage`** - Message signing for verification
- **`ActivityLog`** - Transaction history display

### How Passkeys Work

1. **No Private Keys** - Your device's secure enclave handles cryptography
2. **Biometric Auth** - Use fingerprint, face, or device PIN
3. **Smart Wallets** - Programmable Solana accounts controlled by passkeys
4. **Session Persistence** - Stay logged in across browser sessions

## Next Steps

### Learn More

- **[Passkey Authentication Tutorial](./docs/passkey-authentication.md)** - Deep dive into how passkeys work
- **[Gasless Transactions Tutorial](./docs/gasless-transactions.md)** - Understanding the Paymaster system
- **[Lazorkit Documentation](https://docs.lazorkit.com)** - Full SDK reference

### Customize Your App

- **Change Styling** - Modify Tailwind classes or `app/globals.css`
- **Add Features** - Check Lazorkit docs for advanced capabilities
- **Switch Networks** - Update `app/providers.tsx` for Mainnet
- **Brand Integration** - Replace logos and colors with your brand

### Build Something Amazing

This starter is your foundation. Consider building:

- **E-commerce checkout** with Solana payments
- **DeFi interface** for token swaps
- **NFT marketplace** with gasless minting
- **DAO voting** system
- **Subscription service** with automated billing

## Troubleshooting

### "Transaction failed on localhost"

**Expected behavior!** Transaction signing requires HTTPS. Deploy to Vercel/Netlify for full functionality.

### "Balance shows 0.0000 SOL"

Get Devnet SOL from https://faucet.solana.com and wait 30 seconds.

### "WebAuthn not supported"

Use a modern browser (Chrome, Safari, Firefox, Edge) and ensure you're on HTTPS or localhost.

### "Popup blocked"

Allow popups for your domain in browser settings.

### "Connection works but can't sign"

Make sure you're testing on HTTPS (deployed version) for transaction signing.

## Common Questions

**Q: Is this production-ready?**
A: Yes! This uses the official Lazorkit SDK. Add your features and deploy.

**Q: How secure are passkeys?**
A: Very secure. Private keys never leave your device's secure enclave.

**Q: Can users recover their wallets?**
A: Yes, Lazorkit supports account recovery through multiple passkeys.

**Q: What's the cost of gasless transactions?**
A: The Paymaster sponsors gas fees. Check Lazorkit pricing for production usage.

**Q: Can I use this on mobile?**
A: Yes! Passkeys work on mobile browsers with biometric authentication.

## Need Help?

- **[Full Documentation](./README.md)** - Complete feature reference
- **[Telegram Community](https://t.me/lazorkit)** - Get help from the community
- **[GitHub Issues](https://github.com/exyreams/lazorkit-nextjs-starter/issues)** - Report bugs or request features
- **[Lazorkit Docs](https://docs.lazorkit.com)** - Official SDK documentation

---

**Congratulations!** You've built a complete Solana app with passkey authentication and gasless transactions.

**What's next?** Customize it, add features, and build something amazing with Lazorkit!
