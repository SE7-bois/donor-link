"use client";

import { type ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export default function SolanaProvider({ children }: { children: ReactNode }) {
  // Set network to Devnet for development
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // App identity configuration
  const appIdentity = {
    name: "Donor Link",
    // icon: "https://yourdomain.com/logo.png", // Replace with your actual logo URL
    url: "https://www.kecil.dev", // Replace with your actual website
    description: "A decentralized fundraising platform on Solana"
  };

  // Initialize all supported wallet adapters with app identity
  const wallets = useMemo(() => {
    // Common config options that get passed to all adapters
    const commonConfig = {
      appIdentity,
      network
    };

    return [
      new PhantomWalletAdapter({
        ...commonConfig,
        // You can specify Phantom-specific options here
      }),
      new SolflareWalletAdapter({
        ...commonConfig,
        // You can specify Solflare-specific options here
      }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CloverWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ];
  }, [network]);

  // Configuration for the WalletProvider
  const walletProviderConfig = {
    wallets,
    autoConnect: true,
    // Customize what we want to store in local storage
    localStorageKey: 'donorlink-wallet-state',
    // Disconnect if the tab becomes inactive
    disconnectOnTabClose: false
  };

  // Configuration for the wallet modal
  const walletModalConfig = {
    featuredWallets: 2, // Number of wallets to show before "More options" button
    container: "body", // Where to mount the modal
    className: "wallet-modal-custom-class", // Custom CSS class
  };



  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider {...walletProviderConfig}>
        <WalletModalProvider {...walletModalConfig}>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}