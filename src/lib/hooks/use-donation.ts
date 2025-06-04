import { useState, useCallback, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import {
  getWalletTokenBalance,
  createTokenTransferTransaction,
  getTokenMintAddress,
  type SupportedToken,
} from "../solana-tokens";

interface DonationState {
  isLoading: boolean;
  balances: Record<SupportedToken, number>;
  isLoadingBalances: boolean;
}

interface DonateParams {
  fundraiserId: Id<"fundraisers">;
  recipientWalletAddress: string;
  amount: number;
  token: SupportedToken;
  donorDisplayName?: string;
}

export function useDonation() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const recordDonation = useMutation(api.donations.recordDonation);

  const [state, setState] = useState<DonationState>({
    isLoading: false,
    balances: { USDC: 0, USDT: 0 },
    isLoadingBalances: false,
  });

  // Determine if we're on devnet (you can adjust this logic)
  const isDevnet = process.env.NODE_ENV === "development" ||
    connection.rpcEndpoint.includes("devnet") ||
    connection.rpcEndpoint.includes("localhost");

  // Fetch token balances
  const fetchBalances = useCallback(async () => {
    if (!publicKey) {
      setState(prev => ({ ...prev, balances: { USDC: 0, USDT: 0 } }));
      return;
    }

    setState(prev => ({ ...prev, isLoadingBalances: true }));

    try {
      const [usdcBalance, usdtBalance] = await Promise.all([
        getWalletTokenBalance(connection, publicKey, "USDC", isDevnet),
        getWalletTokenBalance(connection, publicKey, "USDT", isDevnet),
      ]);

      setState(prev => ({
        ...prev,
        balances: { USDC: usdcBalance, USDT: usdtBalance },
        isLoadingBalances: false,
      }));
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setState(prev => ({
        ...prev,
        balances: { USDC: 0, USDT: 0 },
        isLoadingBalances: false,
      }));
    }
  }, [publicKey, connection, isDevnet]);

  // Fetch balances when wallet connects
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const donate = useCallback(async ({
    fundraiserId,
    recipientWalletAddress,
    amount,
    token,
    donorDisplayName,
  }: DonateParams) => {
    if (!publicKey) {
      toast.error("Please connect your wallet to donate");
      return false;
    }

    if (!signTransaction) {
      toast.error("Wallet does not support transaction signing");
      return false;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return false;
    }

    // Check if user has sufficient balance
    const balance = state.balances[token] || 0;
    if (balance < amount) {
      toast.error(`Insufficient ${token} balance. You have ${balance.toFixed(2)} ${token}`);
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate recipient wallet address
      let recipientPublicKey: PublicKey;
      try {
        recipientPublicKey = new PublicKey(recipientWalletAddress);
      } catch (error) {
        throw new Error("Invalid recipient wallet address");
      }

      // Get token mint address
      const tokenMint = getTokenMintAddress(token, isDevnet);

      // Create transfer transaction
      const transaction = await createTokenTransferTransaction(
        connection,
        publicKey,
        recipientPublicKey,
        tokenMint,
        amount
      );

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed");

      if (confirmation.value.err) {
        throw new Error("Transaction failed: " + confirmation.value.err.toString());
      }

      // Record donation in database
      await recordDonation({
        fundraiser_id: fundraiserId,
        donor_wallet_address: publicKey.toBase58(),
        amount: amount,
        transaction_signature: signature,
        donor_display_name: donorDisplayName,
      });

      toast.success("Donation successful!", {
        description: `You donated ${amount} ${token}. Transaction: ${signature.slice(0, 8)}...`,
      });

      // Refresh balances
      await fetchBalances();

      return true;
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Donation failed", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [
    publicKey,
    signTransaction,
    connection,
    isDevnet,
    state.balances,
    recordDonation,
    fetchBalances,
  ]);

  return {
    donate,
    isLoading: state.isLoading,
    balances: state.balances,
    isLoadingBalances: state.isLoadingBalances,
    isConnected: !!publicKey,
    walletAddress: publicKey?.toBase58(),
    refreshBalances: fetchBalances,
  };
} 