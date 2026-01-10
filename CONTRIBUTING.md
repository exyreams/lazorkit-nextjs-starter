# Contributing & Customization Guide

Want to customize this starter or contribute improvements? Here's how!

## 🎨 Customization

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --primary: #your-color;
  --background: #your-bg;
}
```

Or update Tailwind classes in components:
- `bg-blue-600` → `bg-purple-600`
- `text-gray-900` → `text-slate-900`

### Add Your Logo

Replace the header in `app/page.tsx`:

```tsx
<header className="border-b bg-white/80 backdrop-blur-sm">
  <div className="max-w-6xl mx-auto px-4 py-4">
    <img src="/your-logo.svg" alt="Your App" />
    <ConnectButton />
  </div>
</header>
```

### Change Network

Update `app/providers.tsx`:

```typescript
// For Mainnet
const CONFIG = {
  RPC_URL: 'https://api.mainnet-beta.solana.com',
  PAYMASTER: {
    paymasterUrl: 'https://kora.mainnet.lazorkit.com',
  },
};
```

### Add New Features

Check [Lazorkit docs](https://docs.lazorkit.com) for:
- Session keys
- Account recovery
- Spending limits
- Multi-sig support

## 🛠️ Development

### Project Structure

```
app/
├── layout.tsx       # Root layout
├── page.tsx         # Main page
├── providers.tsx    # Lazorkit setup
└── globals.css      # Styles

components/
├── ConnectButton.tsx   # Auth
├── WalletInfo.tsx      # Display wallet
├── TransferForm.tsx    # Send SOL
└── SignMessage.tsx     # Sign messages
```

### Adding a New Component

1. Create file in `components/`:

```tsx
// components/MyFeature.tsx
'use client';

import { useWallet } from '@lazorkit/wallet';

export function MyFeature() {
  const { wallet } = useWallet();
  
  return (
    <div>
      {/* Your feature */}
    </div>
  );
}
```

2. Import in `app/page.tsx`:

```tsx
import { MyFeature } from '@/components/MyFeature';

export default function Home() {
  return (
    <main>
      <MyFeature />
    </main>
  );
}
```

### Code Style

- Use TypeScript
- Add JSDoc comments
- Follow existing patterns
- Use Tailwind for styling

### Testing Locally

```bash
# Run dev server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

## 🤝 Contributing

### Found a Bug?

1. Check [existing issues](https://github.com/lazor-kit/lazor-kit/issues)
2. Create a new issue with:
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Want to Add a Feature?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Pull Request Guidelines

- Keep changes focused
- Add comments for complex logic
- Update documentation if needed
- Test on both localhost and deployed version

## 📝 Documentation

### Updating Docs

- **README.md** - Main documentation
- **GETTING_STARTED.md** - Quick start guide
- **DEPLOYMENT.md** - Deployment instructions
- **docs/TUTORIAL_*.md** - Step-by-step tutorials

### Writing Tutorials

Good tutorials have:
1. Clear goal
2. Step-by-step instructions
3. Code examples
4. Screenshots
5. Troubleshooting section

## 🎓 Learning Resources

- [Lazorkit Docs](https://docs.lazorkit.com)
- [Solana Docs](https://docs.solana.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 💬 Community

- [Telegram](https://t.me/lazorkit)
- [GitHub Discussions](https://github.com/lazor-kit/lazor-kit/discussions)

## 📄 License

MIT - Feel free to use this starter for your projects!

---

**Questions?** Open an issue or ask in Telegram!
