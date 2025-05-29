"use client";

import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useSolanaWallet } from "~/lib/hooks/use-solana-wallet";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { truncateAddress } from "~/lib/utils";
import { formatSolAmount } from "~/lib/solana-utils";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ConnectWalletButton() {
    const { connected, publicKey, disconnect, connecting, disconnecting, wallet, error, balance } = useSolanaWallet();
    const { setVisible } = useWalletModal();

    // Display any wallet errors
    useEffect(() => {
        if (error) {
            toast.error("Wallet Connection Error", {
                description: error,
            });
            console.error("Wallet error:", error);
        }
    }, [error]);

    // Log wallet status for debugging
    useEffect(() => {
        if (wallet) {
            console.log("Connected wallet:", wallet.adapter.name);
        }
    }, [wallet]);

    const handleConnect = () => {
        try {
            setVisible(true);
            console.log("Opening wallet selection modal");
        } catch (err) {
            console.error("Error opening wallet modal:", err);
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
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={disconnect} disabled={disconnecting}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{disconnecting ? "Disconnecting..." : "Disconnect"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}