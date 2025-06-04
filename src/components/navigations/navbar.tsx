"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "~/lib/utils";
import NavItem from "./nav-item";
import ConnectWalletButton from "./connect-wallet-button";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import MobileNavItem from "./mobile-nav-item";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className={cn(
            "sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "flex items-center justify-between px-4 md:px-6 py-4"
        )}>
            {/* Logo */}
            <Link href="/" className="flex items-center">
                <h1 className="text-lg font-bold">Donor Link</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex">
                <NavItem />
            </div>

            {/* Desktop Connect Button */}
            <div className="hidden md:flex">
                <ConnectWalletButton />
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Navigation</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col space-y-4 mt-6">
                            <MobileNavItem onItemClick={() => setIsOpen(false)} />
                            <div className="pt-4 border-t border-border/40">
                                <ConnectWalletButton />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}


