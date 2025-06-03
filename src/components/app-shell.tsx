"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, ChevronDown, Compass, LogOut, PlusCircle, Wallet } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  showNav?: boolean
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  active?: boolean
}

export function AppShell({ children, showNav = true }: AppShellProps) {
  const pathname = usePathname()
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("")

  // Update active nav item based on current path
  useEffect(() => {
    if (pathname === "/browse-fundraisers") {
      setActiveNavItem("Browse Fundraisers")
    } else if (pathname === "/fundraisers/create") {
      setActiveNavItem("Create Fundraiser")
    } else if (pathname === "/dashboard") {
      setActiveNavItem("Dashboard")
    } else if (pathname === "/leaderboard") {
      setActiveNavItem("Leaderboard")
    }
  }, [pathname])

  const navItems: NavItem[] = [
    {
      name: "Browse Fundraisers",
      href: "/browse-fundraisers",
      icon: Compass,
      active: activeNavItem === "Browse Fundraisers",
    },
    {
      name: "Create Fundraiser",
      href: "/fundraisers/create",
      icon: PlusCircle,
      active: activeNavItem === "Create Fundraiser",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      active: activeNavItem === "Dashboard",
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: BarChart3,
      active: activeNavItem === "Leaderboard",
    },
  ]

  const handleNavClick = (name: string) => {
    setActiveNavItem(name)
  }

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-purple-500"></div>
              <span className="font-semibold text-lg">Donor Link</span>
            </Link>
          </div>

          {showNav && (
            <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => handleNavClick(item.name)}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                      item.active ? "text-purple-500" : "text-foreground/60",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {isWalletConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-purple-500/20"></div>
                    <span className="text-xs">8xH1...4jKm</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleConnectWallet}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleConnectWallet} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
