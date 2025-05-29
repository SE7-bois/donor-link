import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { getSolanaBalance } from "../solana-utils";
import { toast } from "sonner";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { WalletName } from "@solana/wallet-adapter-base";

export function useSolanaWallet() {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    wallet,
    disconnect,
    select,
    connecting,
    disconnecting,
    wallets
  } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log available wallets on mount for debugging
  useEffect(() => {
    if (wallets.length > 0) {
      console.log("Available wallets:", wallets.map(w => ({
        name: w.adapter.name,
        ready: w.adapter.readyState,
        icon: w.adapter.icon
      })));
    }
  }, [wallets]);

  // Clear errors when connection status changes
  useEffect(() => {
    if (connected) {
      setError(null);
    }
  }, [connected]);

  // Handle wallet adapter errors
  useEffect(() => {
    const handleError = (e: any) => {
      console.error("Wallet error:", e);
      const errorMessage = e?.message || "An error occurred with the wallet connection";
      setError(errorMessage);
      toast.error("Wallet Error", {
        description: errorMessage,
      });
    };

    if (wallet) {
      wallet.adapter.on('error', handleError);
      return () => {
        wallet.adapter.off('error', handleError);
      };
    }
  }, [wallet]);

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection || !connected) {
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const solBalance = await getSolanaBalance(publicKey, connection);
      setBalance(solBalance);
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      setError(error?.message || "Failed to fetch balance");
      setBalance(null);
      toast.error("Balance Error", {
        description: "Could not fetch your wallet balance",
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, connected]);

  // Fetch balance when wallet connects or changes
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    }
  }, [fetchBalance, publicKey, connected]);

  // Function to select a specific wallet by name
  const selectWallet = useCallback((name: WalletName) => {
    try {
      console.log(`Selecting wallet: ${name}`);
      select(name);
    } catch (err) {
      console.error(`Error selecting wallet ${name}:`, err);
      setError(`Could not select wallet: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [select]);

  // Helper to select Phantom wallet specifically
  const selectPhantom = useCallback(() => {
    const phantomWallet = wallets.find(w =>
      w.adapter.name === 'Phantom' &&
      w.adapter.readyState === WalletReadyState.Installed
    );

    if (phantomWallet) {
      selectWallet(phantomWallet.adapter.name);
    } else {
      setError("Phantom wallet not found or not installed");
      toast.error("Wallet Error", {
        description: "Phantom wallet not found or not installed",
      });
    }
  }, [wallets, selectWallet]);

  return {
    publicKey,
    connected,
    wallet,
    balance,
    isLoading,
    disconnect,
    fetchBalance,
    connection,
    connecting,
    disconnecting,
    error,
    wallets,
    selectWallet,
    selectPhantom,
  };
} 