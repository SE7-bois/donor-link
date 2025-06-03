"use client";

import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useSolanaWallet } from "~/lib/hooks/use-solana-wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { truncateAddress } from "~/lib/utils";
import { formatSolAmount } from "~/lib/solana-utils";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "~/utils/SigninMessage";
import bs58 from "bs58";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export default function ConnectWalletButton() {
    // Use standard wallet adapter for signMessage and core wallet functionality
    const { connected, publicKey, disconnect, connecting, disconnecting, wallet, signMessage } = useWallet();
    // Use custom hook for balance and error handling
    const { error, balance } = useSolanaWallet();
    const { setVisible } = useWalletModal();
    const { data: session, status } = useSession();

    // Convex mutations
    const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

    // Display any wallet errors
    useEffect(() => {
        if (error) {
            toast.error("Wallet Connection Error", {
                description: error,
            });
        }
    }, [error]);

    const handleSignIn = useCallback(async () => {
        try {
            if (!publicKey || !signMessage) {
                toast.error("Wallet not ready for signing");
                return;
            }

            const csrf = await getCsrfToken();
            if (!csrf) {
                toast.error("Could not get CSRF token");
                return;
            }

            const message = new SigninMessage({
                domain: window.location.host,
                publicKey: publicKey.toBase58(),
                statement: `Sign this message to sign in to the app.`,
                nonce: csrf,
            });

            const data = new TextEncoder().encode(message.prepare());
            const signature = await signMessage(data);
            const serializedSignature = bs58.encode(signature);

            const result = await signIn("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature: serializedSignature,
            });

            if (result?.ok) {
                // Store user in Convex after successful authentication
                try {
                    await createOrUpdateUser({
                        wallet_address: publicKey.toBase58(),
                        nonce: csrf,
                    });
                    toast.success("Wallet authenticated successfully!");
                } catch (convexError) {
                    toast.error("Authentication successful, but failed to save user data");
                }
            } else {
                const errorMessage = result?.error || 'Unknown error';
                toast.error(`Authentication failed: ${errorMessage}`);
            }
        } catch (err) {
            toast.error(`Failed to sign in with wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }, [publicKey, signMessage, createOrUpdateUser, status, connected]);

    // Handle wallet connection and authentication
    useEffect(() => {
        if (wallet && connected && !session && status !== "loading") {
            handleSignIn();
        }
    }, [wallet, connected, session, status, handleSignIn]);

    const handleConnect = () => {
        try {
            setVisible(true);
        } catch (err) {
            toast.error("Failed to open wallet modal");
        }
    };

    const handleDisconnect = async () => {
        try {
            await signOut({ redirect: false });
            disconnect();
            toast.success("Wallet disconnected");
        } catch (err) {
            toast.error("Failed to disconnect wallet");
        }
    };

    if (!connected) {
        return (
            <Button onClick={handleConnect} className="h-9" disabled={connecting}>
                <Wallet className="mr-2 h-4 w-4" />
                {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Wallet className="h-3 w-3 text-purple-600" />
                    </div>
                    {publicKey ? truncateAddress(publicKey.toString()) : "..."}
                    <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer flex justify-between">
                    <span className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        Balance
                    </span>
                    <span>{balance !== null ? formatSolAmount(balance) : "Loading..."}</span>
                </DropdownMenuItem>
                {wallet && (
                    <DropdownMenuItem className="cursor-pointer flex justify-between">
                        <span className="flex items-center">
                            <Wallet className="mr-2 h-4 w-4" />
                            Wallet
                        </span>
                        <span>{wallet.adapter.name}</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer flex justify-between">
                    <span className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        Auth Status
                    </span>
                    <span className={session ? "text-green-600" : "text-red-600"}>
                        {session ? "Authenticated" : "Not authenticated"}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex justify-between">
                    <span className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        Session Status
                    </span>
                    <span>{status}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleDisconnect} disabled={disconnecting}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{disconnecting ? "Disconnecting..." : "Disconnect"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}