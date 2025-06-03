"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crown,
  Info,
  Medal,
  Search,
  Trophy,
  WalletIcon,
} from "lucide-react"

import { Input } from "~/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { cn } from "~/lib/utils"
import { useQuery } from "convex/react"
import { api } from "convex/_generated/api"
import ConnectWalletButton from "~/components/navigations/connect-wallet-button"

interface Donor {
  id: string
  walletAddress: string
  totalDonated: number
  rank: number
  donationCount: number
  lastDonation: number
}

export function Leaderboard() {
  const { data: session, status } = useSession()
  const { connected, publicKey } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [jumpToPage, setJumpToPage] = useState("")

  // Get user's wallet address
  const userWalletAddress = publicKey?.toBase58()

  // Fetch leaderboard data from Convex
  const leaderboardData = useQuery(api.donations.getLeaderboard, { limit: 100 })

  // Fetch user's position (only if authenticated)
  const userPosition = useQuery(
    api.donations.getUserLeaderboardPosition,
    userWalletAddress ? { wallet_address: userWalletAddress } : "skip"
  )

  // Show loading state
  if (status === "loading" || (connected && !leaderboardData)) {
    return (
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Transform Convex data to match component interface
  const donors: Donor[] = leaderboardData?.map(item => ({
    id: item.id,
    walletAddress: item.walletAddress,
    totalDonated: item.totalDonated,
    rank: item.rank,
    donationCount: item.donationCount,
    lastDonation: item.lastDonation,
  })) || []

  // Filter donors based on search query
  const filteredDonors = donors.filter((donor) =>
    donor.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination values
  const totalItems = filteredDonors.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentDonors = filteredDonors.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const handleJumpToPage = () => {
    const pageNumber = Number.parseInt(jumpToPage)
    if (!isNaN(pageNumber)) {
      goToPage(pageNumber)
    }
    setJumpToPage("")
  }

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number.parseInt(value)
    setItemsPerPage(newItemsPerPage)
    // Reset to first page when changing items per page
    setCurrentPage(1)
  }

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Function to copy wallet address to clipboard
  const copyToClipboard = (address: string, id: string) => {
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Function to render rank icon
  const renderRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-5 w-5 text-yellow-400" />
    } else if (rank === 2) {
      return <Medal className="h-5 w-5 text-gray-300" />
    } else if (rank === 3) {
      return <Medal className="h-5 w-5 text-amber-700" />
    } else if (rank <= 5) {
      return <Crown className="h-5 w-5 text-purple-500" />
    }
    return null
  }

  // Find the currentUserDonor from the position query or full list
  const currentUserDonor = userPosition ? {
    id: userPosition.id,
    walletAddress: userPosition.walletAddress,
    totalDonated: userPosition.totalDonated,
    rank: userPosition.rank,
    donationCount: 0, // Not available in position query
    lastDonation: 0, // Not available in position query
  } : undefined

  // Check if the current user is visible on the current page
  const isCurrentUserVisible = currentUserDonor
    ? currentDonors.some((donor) => donor.walletAddress === currentUserDonor.walletAddress)
    : false

  // Determine if user should be shown at top or bottom
  const showUserAtTop =
    !!currentUserDonor &&
    !isCurrentUserVisible &&
    currentDonors.length > 0 &&
    currentDonors[0] &&
    currentUserDonor.rank < currentDonors[0].rank

  // Determine if user should be shown at bottom
  const showUserAtBottom =
    !!currentUserDonor &&
    !isCurrentUserVisible &&
    currentDonors.length > 0 &&
    currentUserDonor.rank > (currentDonors[currentDonors.length - 1]?.rank ?? 0)

  // Function to render user row
  const renderUserRow = () => {
    if (!currentUserDonor) return null

    return (
      <tr className="bg-purple-500/10 hover:bg-purple-500/15 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <span className="text-sm font-medium text-purple-500">#{currentUserDonor.rank}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            {renderRankIcon(currentUserDonor.rank)}
            <span className="text-sm font-medium text-purple-400">
              {truncateAddress(currentUserDonor.walletAddress)}
            </span>
            <button
              onClick={() => copyToClipboard(currentUserDonor.walletAddress, currentUserDonor.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="sr-only">Copy address</span>
            </button>
            {copiedId === currentUserDonor.id && <span className="text-xs text-purple-500">Copied!</span>}
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">You</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <span className="text-sm font-medium text-purple-400">{formatCurrency(currentUserDonor.totalDonated)}</span>
        </td>
      </tr>
    )
  }

  // Function to render separator
  const renderSeparator = (text: string) => {
    return (
      <tr className="bg-border/10">
        <td colSpan={3} className="px-6 py-2">
          <div className="flex items-center justify-center">
            <div className="h-px w-full bg-border/30"></div>
            <span className="px-2 text-xs text-muted-foreground whitespace-nowrap">{text}</span>
            <div className="h-px w-full bg-border/30"></div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="container py-6 md:py-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">Recognizing our top supporters who are making a difference</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by wallet address..."
          className="pl-9 bg-background border-border/50 h-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Show wallet connection prompt if not connected */}
      {(!session || !connected) && (
        <div className="rounded-lg border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WalletIcon className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-medium">Connect your wallet to see your rank</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to see where you stand on the leaderboard
                </p>
              </div>
            </div>
            <ConnectWalletButton />
          </div>
        </div>
      )}

      {/* Show user's current position if authenticated and has donated */}
      {userPosition && (
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {renderRankIcon(userPosition.rank)}
              <div>
                <h3 className="font-medium">Your Current Rank</h3>
                <p className="text-sm text-muted-foreground">
                  You're ranked #{userPosition.rank} with {formatCurrency(userPosition.totalDonated)} donated
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-500">#{userPosition.rank}</div>
              <div className="text-sm text-muted-foreground">of {donors.length}</div>
            </div>
          </div>
        </div>
      )}

      {filteredDonors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted/30 p-6 mb-4">
            <Trophy className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-medium">The leaderboard is awaiting its heroes!</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            Be the first to make a difference. Your contribution could top the charts!
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Supporter
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center justify-end space-x-1">
                        <span>Total Donated</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="text-xs">Total amount donated in USD</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {/* Show user at top if their rank is higher than current page */}
                  {showUserAtTop && (
                    <>
                      {renderUserRow()}
                      {renderSeparator("Current Page")}
                    </>
                  )}

                  {/* Current page donors */}
                  {currentDonors.map((donor) => {
                    const isCurrentUser = userWalletAddress && donor.walletAddress === userWalletAddress
                    const isTopRank = donor.rank <= 3

                    return (
                      <tr
                        key={donor.id}
                        className={cn(
                          "transition-colors hover:bg-muted/10",
                          isCurrentUser && "bg-purple-500/5 hover:bg-purple-500/10",
                          isTopRank && "bg-muted/5",
                        )}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={cn("text-sm font-medium", isTopRank ? "text-purple-500" : "text-foreground")}
                            >
                              #{donor.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {renderRankIcon(donor.rank)}
                            <span
                              className={cn(
                                "text-sm",
                                isTopRank ? "font-medium" : "",
                                isCurrentUser ? "text-purple-400" : "text-foreground",
                              )}
                            >
                              {truncateAddress(donor.walletAddress)}
                            </span>
                            <button
                              onClick={() => copyToClipboard(donor.walletAddress, donor.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="sr-only">Copy address</span>
                            </button>
                            {copiedId === donor.id && <span className="text-xs text-purple-500">Copied!</span>}
                            {isCurrentUser && (
                              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={cn(
                              "text-sm",
                              isTopRank ? "font-medium" : "",
                              isCurrentUser ? "text-purple-400" : "text-foreground",
                            )}
                          >
                            {formatCurrency(donor.totalDonated)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}

                  {/* Show user at bottom if their rank is lower than current page */}
                  {showUserAtBottom && (
                    <>
                      {renderSeparator("Your Position")}
                      {renderUserRow()}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{endIndex} of {totalItems} supporters
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronFirst className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>

                <div className="flex items-center space-x-1 mx-1">
                  <span className="text-sm">Page</span>
                  <div className="flex items-center space-x-1">
                    <Input
                      className="h-8 w-12 text-center"
                      value={jumpToPage}
                      onChange={(e) => setJumpToPage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
                    />
                    <span className="text-sm text-muted-foreground">of {totalPages}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLast className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
