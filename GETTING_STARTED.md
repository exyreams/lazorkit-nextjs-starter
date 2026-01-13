# Getting Started with Lazorkit Next.js Starter

**Build Solana apps without seed phrases in 5 minutes!**

This guide will get you up and running with a fully functional Solana app that uses passkey authentication instead of traditional seed phrases.

## What You'll Build

A complete Solana wallet app featuring:

- **Passkey Authentication** - Sign in with FaceID, TouchID, or Windows Hello
- **Gasless Transactions** - Send SOL without holding SOL for gas fees
- **USDC Transfers** - Send SPL tokens with gas paid in USDC
- **Smart Wallets** - Programmable accounts with recovery support
- **Message Signing** - Verify ownership without transactions
- **Session Persistence** - Stay logged in across page refreshes

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
# or bun install

# Start development server
bun dev
# or bun run dev
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

### HTTPS Requirement

**Development:** Connection and balance checking work on `localhost`
**Production:** Transaction signing requires HTTPS deployment

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
bun run build

# Deploy to Netlify
netlify deploy --prod
```

## Configuration

### Switch to Mainnet

Update `app/providers.tsx`:

```typescript
const CONFIG = {
  RPC_URL: "https://api.mainnet-beta.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.mainnet.lazorkit.com",
  },
};
```

## Learn More

### Detailed Tutorials

- **[Passkey Authentication Tutorial](./docs/passkey-authentication.md)** - Deep dive into how passkeys work
- **[Gasless Transactions Tutorial](./docs/gasless-transactions.md)** - Understanding the Paymaster system

### Code Examples

- **[Examples Directory](./examples/)** - Working code examples with Next.js configuration
  - [Basic Setup](./examples/basic-setup/) - Minimal Lazorkit integration
  - [Authentication](./examples/authentication/) - Complete passkey auth flow
  - [Transactions](./examples/transactions/) - Gasless SOL/USDC transfers
  - [Components](./examples/components/) - Reusable React components

### External Resources

- **[Lazorkit Documentation](https://docs.lazorkit.com)** - Full SDK reference

## Troubleshooting

### "Transaction failed on localhost"

**Expected behavior!** Transaction signing requires HTTPS. Deploy to Vercel/Netlify for full functionality.

### "Balance shows 0.0000 SOL"

Get Devnet SOL from https://faucet.solana.com and wait 30 seconds.

### "WebAuthn not supported"

Use a modern browser (Chrome, Safari, Firefox, Edge) and ensure you're on HTTPS or localhost.

### "Popup blocked"

Allow popups for your domain in browser settings.

## FAQ

**Q: Why do transactions fail on localhost?**
A: WebAuthn requires HTTPS for transaction signing. Deploy to Vercel/Netlify for full functionality.

**Q: How do I get test USDC?**
A: Use a DEX like Jupiter or Raydium on Devnet to swap SOL for USDC.

**Q: What browsers are supported?**
A: Chrome, Safari, Firefox, and Edge all support WebAuthn. Mobile browsers work too!

**Q: Where are private keys stored?**
A: Nowhere! Passkeys use your device's secure enclave. No keys to lose or steal.

**Q: Is this production-ready?**
A: Yes! This uses the official Lazorkit SDK. Add your features and deploy.

## Need Help?

- **[Telegram Community](https://t.me/lazorkit)** - Get help from the community
- **[GitHub Issues](https://github.com/exyreams/lazorkit-nextjs-starter/issues)** - Report bugs or request features
- **[Lazorkit Docs](https://docs.lazorkit.com)** - Official SDK documentation

---

**Congratulations!** You've built a complete Solana app with passkey authentication and gasless transactions.

**What's next?** Check out the [examples directory](./examples/) for detailed code implementations and customize it for your needs!
