# Getting Started with Lazorkit Next.js Starter

**Build Solana apps without seed phrases in 5 minutes!**

## What You'll Build

A Solana wallet app with:
- 🔐 Passkey login (FaceID/TouchID)
- 💸 Send SOL without gas fees
- 📝 Sign messages
- 💰 Check balance

## Step 1: Install (2 minutes)

```bash
# Clone the repo
git clone <your-repo-url>
cd lazorkit-nextjs-starter

# Install dependencies
bun install
# or npm install

# Start the app
bun dev
# or npm run dev
```

Open http://localhost:3000 🎉

## Step 2: Connect Your Wallet (30 seconds)

1. Click **"Connect Wallet"**
2. Use your fingerprint/face to create a passkey
3. Done! You now have a Solana wallet

**No seed phrases. No extensions. Just biometrics.**

## Step 3: Get Test SOL (1 minute)

You need Devnet SOL to test transactions:

1. Copy your wallet address from the app
2. Go to https://faucet.solana.com
3. Paste your address and click "Confirm Airdrop"
4. Wait 10 seconds, then refresh your balance

## Step 4: Send Your First Transaction (1 minute)

1. Enter a recipient address (or use your own to test)
2. Enter amount (try 0.01 SOL)
3. Click "Send Transaction"
4. Confirm with your fingerprint/face
5. View on Solana Explorer!

**Note:** Transaction signing requires HTTPS. Deploy to Vercel for full functionality (see below).

## Step 5: Deploy to Production (5 minutes)

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repo
5. Click "Deploy"

Done! Your app is live on HTTPS and all features work!

### Option B: Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

## What's Next?

### Learn More
- [Tutorial 1: How Passkey Authentication Works](./docs/TUTORIAL_1.md)
- [Tutorial 2: Understanding Gasless Transactions](./docs/TUTORIAL_2.md)
- [Lazorkit Documentation](https://docs.lazorkit.com)

### Customize Your App
- Change colors in `app/globals.css`
- Add features from [Lazorkit docs](https://docs.lazorkit.com)
- Switch to Mainnet (see README.md)

### Common Issues

**"Transaction failed on localhost"**
- This is expected! Deploy to HTTPS for transactions
- Connection and balance checking work locally

**"Balance shows 0.0000 SOL"**
- Get Devnet SOL from https://faucet.solana.com

**"WebAuthn not supported"**
- Use Chrome, Safari, Firefox, or Edge
- Make sure you're on HTTPS (or localhost)

## Need Help?

- 📚 [Full Documentation](./README.md)
- 💬 [Telegram Community](https://t.me/lazorkit)
- 💻 [GitHub Issues](https://github.com/lazor-kit/lazor-kit)

---

**That's it!** You now have a working Solana app with passkey authentication. 🎉

Next: Customize it, add features, and build something amazing!
