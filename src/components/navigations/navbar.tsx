import { cn } from "~/lib/utils";
import NavItem from "./nav-item";
import ConnectWalletButton from "./connect-wallet-button";
import Link from "next/link";

export default function Navbar() {

    return (
        <header className={cn(
            "sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "flex items-center justify-between pt-4 pb-2"
        )}>
            <Link href="/">
                <h1 className="text-lg font-bold">Donor Link</h1>
            </Link>
            <NavItem />
            <ConnectWalletButton />
        </header>
    )
}


