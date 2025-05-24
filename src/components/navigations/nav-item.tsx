"use client";

import { BarChart3, Compass, PlusCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function NavItem() {
    const pathname = usePathname();
    const navItems = [
        {
            name: "Browse Fundraisers",
            href: "/fundraisers",
            icon: Compass,
            active: pathname === "/fundraisers",
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