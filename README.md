# Donor Link 🎯

A decentralized fundraising platform built on Solana with Next.js, Convex, and wallet-based authentication.

## ✨ Features

- 🔐 **Wallet Authentication** - Secure login with Solana wallets (Phantom, Solflare, etc.)
- 🎯 **Privacy-First** - Users can only access their own data
- 📊 **Real-time Backend** - Powered by Convex for instant updates
- 💰 **Solana Integration** - Native blockchain transactions
- 🎨 **Modern UI** - Built with Next.js and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ 
- pnpm (recommended) or npm
- A Solana wallet browser extension (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd donor-link
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Generate NextAuth secret**
   ```bash
   openssl rand -hex 32
   # Add this to NEXTAUTH_SECRET in .env.local
   ```

### Development

#### Option 1: Run both services in parallel (Recommended)
```bash
# Using npm script
pnpm run dev:full

# Or using the helper script (Unix/Linux/Mac)
./dev.sh

# Or using the batch file (Windows)
dev.bat
```

#### Option 2: Run services separately
```bash
# Terminal 1: Start Convex backend
pnpm run convex:dev

# Terminal 2: Start Next.js frontend  
pnpm run dev
```

### Available Scripts

- `pnpm run dev:full` - Run both Convex and Next.js in parallel
- `pnpm run dev:parallel` - Alternative parallel runner
- `pnpm run dev` - Run Next.js only
- `pnpm run convex:dev` - Run Convex only  
- `pnpm run convex:deploy` - Deploy Convex to production
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server

## 🔧 Architecture

### Authentication Flow
1. User connects Solana wallet
2. Signs nonce challenge message
3. NextAuth.js verifies signature
4. User record created/updated in Convex
5. JWT session established with wallet address

### Privacy & Security
- **Wallet-based auth** - No passwords, uses crypto signatures
- **Nonce protection** - Prevents replay attacks
- **User isolation** - Strict data access controls
- **Anonymized public data** - Protects donor privacy

### Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Authentication**: NextAuth.js + Solana Wallet Adapter
- **Blockchain**: Solana Web3.js
- **UI Components**: Custom components with Radix UI

## 📁 Project Structure

```
donor-link/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── navigations/     # Navigation components
│   │   ├── ui/              # UI primitives
│   │   └── provider.tsx     # Solana wallet provider
│   ├── lib/                 # Utilities and hooks
│   └── utils/               # Helper functions
├── convex/                  # Backend functions
│   ├── schema.ts           # Database schema
│   ├── users.ts            # User management
│   ├── fundraisers.ts      # Fundraiser logic
│   └── donations.ts        # Donation handling
└── public/                 # Static assets
```

## 🔒 Environment Variables

Create a `.env.local` file with:

```env
# Convex (required)
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url
CONVEX_DEPLOYMENT=dev:your-deployment-name

# NextAuth.js (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# Solana (optional - uses public RPC by default)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [GitHub Issues](https://github.com/your-username/donor-link/issues)
- [Convex Discord](https://convex.dev/community)
- [Solana Stack Exchange](https://solana.stackexchange.com/)

---

Built with ❤️ by MonaKecil