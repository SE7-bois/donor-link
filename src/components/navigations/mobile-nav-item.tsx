"use client";

import { BarChart3, Compass, PlusCircle, User } from "lucide-react";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSolanaWallet } from "~/lib/hooks/use-solana-wallet";
import { toast } from "sonner";

interface MobileNavItemProps {
  onItemClick: () => void;
}

export default function MobileNavItem({ onItemClick }: MobileNavItemProps) {
  const pathname = usePathname();
  const { connected } = useSolanaWallet();

  const navItems = [
    {
      name: "Browse Fundraisers",
      href: "/fundraisers",
      icon: Compass,
      active: pathname === "/fundraisers",
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: BarChart3,
      active: pathname === "/leaderboard",
    },
  ];

  // Profile link only shows when connected
  if (connected) {
    navItems.push({
      name: "Create Fundraiser",
      href: "/fundraisers/create",
      icon: PlusCircle,
      active: pathname === "/fundraisers/create",
    });
    navItems.push({
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    });
  }

  return (
    <nav className="flex flex-col space-y-2">
      {pathname !== "/" && navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => {
            if (!connected && (item.href === "/profile" || item.href === "/fundraisers/create")) {
              e.preventDefault();
              toast.error("Please connect your wallet first.");
              return;
            }
            onItemClick();
          }}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
            item.active
              ? "bg-accent text-accent-foreground"
              : "text-foreground/60 hover:text-foreground"
          )}
        >
          <item.icon className="mr-3 h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  )
} 