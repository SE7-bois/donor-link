"use client";

import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ConnectWalletButton() {
    const [isConnected, setIsConnected] = useState(false);
    const handleConnect = () => {
        console.log("Connecting wallet...");
        setIsConnected(true);
    };

    const handleDisconnect = () => {
        console.log("Disconnecting wallet...");
        setIsConnected(false);
    };

    if (!isConnected) {
        return (
            <Button onClick={handleConnect} className="h-9">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
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
                    0xa1...4jKm
                <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleDisconnect}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}