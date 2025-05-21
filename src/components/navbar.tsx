"use client";

import { Compass, PlusCircle, BarChart3, Wallet, ChevronDown, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className={cn(
            "sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "flex items-center justify-between py-2"
        )}>
            <Link href="/">
                <h1 className="text-lg font-bold">Donor Link</h1>
            </Link>
            <NavItem pathname={pathname} />
            <ConnectWalletButton />
        </header>
    )
}

function NavItem({pathname}: {pathname: string}) {
    const navItems = [
        {
            name: "Browse Fundraisers",
            href: "/browse-fundraisers",
            icon: Compass,
            active: pathname === "/browse-fundraisers",
        },
        {
            name: "Create Fundraiser",
            href: "/create",
            icon: PlusCircle,
            active: pathname === "/create",
        },
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: BarChart3,
            active: pathname === "/dashboard",
        },
        {
            name: "Leaderboard",
            href: "/leaderboard",
            icon: BarChart3,
            active: pathname === "/leaderboard",
        },
    ];

    return (
        <nav className="flex items-center space-x-8">
            {pathname !== "/" && navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                        item.active ? "text-purple-500" : "text-foreground/60",
                    )}
                >
                    <item.icon className="mr-1.5 h-4 w-4" />
                    {item.name}
                </Link>
            ))}
        </nav>
    )

}

function ConnectWalletButton() {
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