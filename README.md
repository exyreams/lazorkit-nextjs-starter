# Lazorkit Next.js Starter

![Lazorkit Next.js Starter](./public/cover.png)

> **Build Solana apps without seed phrases. Use FaceID, TouchID, or Windows Hello instead.**

A production-ready starter template demonstrating [Lazorkit SDK](https://docs.lazorkit.com) integration with Next.js, TypeScript, and Tailwind CSS.

**[Quick Start Guide](./GETTING_STARTED.md)** | **[Live Demo](https://lazorkit-nextjs-starter.vercel.app)** | **[Tutorials](./docs/)**

## What This Starter Includes

- **Passkey Authentication** - Sign in with FaceID, TouchID, or Windows Hello
- **Gasless Transactions** - Send SOL without holding SOL for fees
- **USDC Transfers** - Send SPL tokens with gas paid in USDC
- **Smart Wallets** - Programmable accounts with recovery support
- **Message Signing** - Verify ownership without transactions
- **Session Persistence** - Stay logged in across page refreshes
- **Real-time Balance** - SOL balance with refresh functionality
- **Modern UI** - Responsive design with Tailwind CSS
- **TypeScript** - Fully typed for better developer experience
- **Comprehensive Docs** - Extensive comments and step-by-step tutorials

## Quick Start

```bash
# Clone and install
git clone https://github.com/exyreams/lazorkit-nextjs-starter.git
cd lazorkit-nextjs-starter
bun install

# Run locally
bun dev
# Open http://localhost:3000
```

**That's it!** Click "Connect Wallet" and use your fingerprint to create a Solana wallet.

**New to Lazorkit?** Follow our [Getting Started Guide](./GETTING_STARTED.md) for a detailed walkthrough.

## Key Features Demo

### Passkey Authentication

```typescript
import { useWallet } from "@lazorkit/wallet";

function ConnectButton() {
  const { connect, isConnected, wallet } = useWallet();

  return (
    <button onClick={() => connect()}>
      {isConnected ? `Connected: ${wallet?.smartWallet}` : "Connect"}
    </button>
  );
}
```

### Gasless SOL Transfer

```typescript
const { signAndSendTransaction, smartWalletPubkey } = useWallet();

const sendSOL = async () => {
  const instruction = SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: new PublicKey(recipient),
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });

  const signature = await signAndSendTransaction({
    instructions: [instruction],
  });
};
```

### Message Signing

```typescript
const { signMessage } = useWallet();

const sign = async () => {
  const result = await signMessage("Hello Lazorkit!");
  console.log("Signature:", result.signature);
};
```

## Documentation

### Getting Started

- **[Quick Start Guide](./GETTING_STARTED.md)** - Get running in 5 minutes
- **[Contributing Guide](./CONTRIBUTING.md)** - Customize and extend the starter

### Step-by-Step Tutorials

- **[Passkey Authentication Setup](./docs/passkey-authentication.md)** - Implement biometric login
- **[Gasless Transaction Guide](./docs/gasless-transactions.md)** - Send transactions without gas fees

## Project Structure

```
lazorkit-nextjs-starter/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main dashboard page
│   ├── providers.tsx       # Lazorkit provider configuration
│   └── globals.css         # Global styles and themes
├── components/
│   ├── ConnectButton.tsx   # Wallet connection component
│   ├── WalletInfo.tsx      # Wallet details and balance
│   ├── TransferForm.tsx    # SOL transfer form
│   ├── USDCTransferForm.tsx # USDC transfer form
│   ├── SignMessage.tsx     # Message signing component
│   ├── ActivityLog.tsx     # Transaction history
│   └── ui/                 # Reusable UI components
├── docs/                   # Step-by-step tutorials
├── public/                 # Static assets and icons
└── README.md              # This file
```

## HTTPS Requirement

**Development:** Connection and balance checking work on `localhost`
**Production:** Transaction signing requires HTTPS deployment

**Quick Deploy Options:**

- [Deploy to Vercel](https://vercel.com) (recommended)
- [Deploy to Netlify](https://netlify.com)
- Any HTTPS-enabled hosting

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

## FAQ

**Q: Why do transactions fail on localhost?**
A: WebAuthn requires HTTPS for transaction signing. Deploy to Vercel/Netlify for full functionality.

**Q: How do I get test USDC?**
A: Use a DEX like Jupiter or Raydium on Devnet to swap SOL for USDC.

**Q: What browsers are supported?**
A: Chrome, Safari, Firefox, and Edge all support WebAuthn. Mobile browsers work too!

**Q: Where are private keys stored?**
A: Nowhere! Passkeys use your device's secure enclave. No keys to lose or steal.

## Resources

- [Lazorkit Documentation](https://docs.lazorkit.com)
- [Lazorkit GitHub](https://github.com/lazor-kit/lazor-kit)
- [Lazorkit Telegram](https://t.me/lazorkit)
- [Solana Documentation](https://docs.solana.com)
- [WebAuthn Guide](https://webauthn.guide/)

## Contributing

This starter template is designed for the Lazorkit bounty program. Feel free to:

- Fork and customize for your projects
- Submit improvements via pull requests
- Share projects built with this template
- Report issues or suggest features

## License

MIT License - Use this template freely for your projects!

## Bounty Compliance

This starter meets all Lazorkit bounty requirements:

**Required Deliverables:**

- Working Example - Fully functional Next.js app with Lazorkit integration
- Clean Code - TypeScript, comprehensive comments, organized structure
- Quick-Start Guide - [GETTING_STARTED.md](./GETTING_STARTED.md)
- 2+ Tutorials - [Passkey Auth](./docs/passkey-authentication.md) & [Gasless Transactions](./docs/gasless-transactions.md)
- Live Demo - [Deployed on Vercel](https://lazorkit-nextjs-starter.vercel.app)

**SDK Integration:**

- Passkey authentication with biometric login
- Gasless SOL transactions via Paymaster
- USDC transfers with fees paid in USDC
- Message signing for verification
- Session persistence across page refreshes

**Judging Criteria:**

- **40% Clarity & Usefulness** - Comprehensive documentation, tutorials, and comments
- **30% SDK Integration** - All key Lazorkit features demonstrated with real examples
- **30% Code Quality** - TypeScript, clean architecture, production-ready structure

---

**Built for the Lazorkit Bounty** | **[View Live Demo](https://lazorkit-nextjs-starter.vercel.app)** | **[GitHub Repository](https://github.com/exyreams/lazorkit-nextjs-starter)**
