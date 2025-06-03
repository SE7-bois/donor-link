"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Search,
  Trophy,
  Users,
  Edit,
  Eye,
  MessageSquare,
  WalletIcon,
  Plus,
} from "lucide-react"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { cn } from "~/lib/utils"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import ConnectWalletButton from "~/components/navigations/connect-wallet-button"
import type { Fundraiser } from "~/data/fundraisers"

export function DashboardConvex() {
  const { data: session, status } = useSession()
  const { connected, publicKey } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [fundraiserSearchQuery, setFundraiserSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Get user's wallet address from wallet (session stores wallet address as ID)
  const userWalletAddress = publicKey?.toBase58()

  // Fetch user's data from Convex
  const userDonations = useQuery(
    api.donations.getMyDonations,
    userWalletAddress ? { wallet_address: userWalletAddress } : "skip"
  )

  const userFundraisers = useQuery(
    api.fundraisers.getMyFundraisers,
    userWalletAddress ? { wallet_address: userWalletAddress } : "skip"
  )

  // Show loading or login prompt if not authenticated
  if (status === "loading") {
    return (
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !connected || !publicKey) {
    return (
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Connect your wallet to view your dashboard</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <WalletIcon className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-medium">Wallet Not Connected</h3>
          <p className="text-muted-foreground max-w-md">
            Please connect your wallet to view your donation history and fundraisers.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    )
  }

  // Calculate statistics from real data
  const totalDonated = userDonations?.reduce((sum, donation) => sum + donation.amount, 0) ?? 0
  const projectsSupported = userDonations ? new Set(userDonations.map(d => d.fundraiser_id)).size : 0

  const totalRaised = userFundraisers?.reduce((sum, fundraiser) => sum + fundraiser.current_amount, 0) ?? 0
  const activeCampaigns = userFundraisers?.filter(f => f.is_active).length ?? 0

  // Filter donations based on search query and time filter
  const filteredDonations = userDonations?.filter((donation) => {
    const matchesSearch = donation.fundraiser_title.toLowerCase().includes(searchQuery.toLowerCase())

    if (timeFilter === "all") return matchesSearch

    const donationDate = new Date(donation.created_at)
    const now = new Date()

    if (timeFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      return matchesSearch && donationDate >= monthAgo
    }

    if (timeFilter === "year") {
      const yearAgo = new Date()
      yearAgo.setFullYear(now.getFullYear() - 1)
      return matchesSearch && donationDate >= yearAgo
    }

    return matchesSearch
  }) || []

  // Filter fundraisers based on search query and status filter
  const filteredFundraisers = userFundraisers?.filter((fundraiser) => {
    const matchesSearch = fundraiser.title.toLowerCase().includes(fundraiserSearchQuery.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    if (statusFilter === "active") return matchesSearch && fundraiser.is_active
    if (statusFilter === "inactive") return matchesSearch && !fundraiser.is_active
    return matchesSearch
  }) ?? []

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Truncate transaction signature
  const truncateSignature = (signature: string) => {
    return `${signature.substring(0, 6)}...${signature.substring(signature.length - 4)}`
  }

  // Get status from fundraiser data
  const getFundraiserStatus = (fundraiser: Fundraiser) => {
    if (!fundraiser.is_active) return "Inactive"
    const percentComplete = (fundraiser.current_amount / fundraiser.target_amount) * 100
    if (percentComplete >= 100) return "Goal Met"
    return "Active"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500"
      case "Goal Met":
        return "bg-purple-500/10 text-purple-500"
      case "Inactive":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-muted/30 text-muted-foreground"
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-3.5rem)]">
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your donations and fundraising activities</p>
          <p className="text-xs text-muted-foreground">
            Connected: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>

        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="donations">My Donations</TabsTrigger>
            <TabsTrigger value="fundraisers">My Fundraisers</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-8">
            {/* Key Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Donated (USD)</p>
                <p className="text-3xl font-bold text-purple-500">{formatCurrency(totalDonated)}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Projects Supported</p>
                <p className="text-3xl font-bold">{projectsSupported}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Your Leaderboard Rank</p>
                  <Link
                    href="/leaderboard"
                    className="text-xs text-purple-500 hover:text-purple-400 flex items-center gap-1"
                  >
                    View Leaderboard
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-purple-500" />
                  <p className="text-3xl font-bold">#-</p>
                </div>
              </div>
            </div>

            {/* Donation History Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">My Donation History</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search donations..."
                      className="pl-9 bg-background border-border/50 h-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="month">Past month</SelectItem>
                      <SelectItem value="year">Past year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredDonations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  {searchQuery || timeFilter !== "all" ? (
                    <>
                      <div className="rounded-full bg-muted/30 p-6 mb-4">
                        <Search className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-medium">No donations found</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        {`We couldn't find any donations matching your search criteria. Try adjusting your filters.`}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("")
                          setTimeFilter("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted/30 p-6 mb-4">
                        <Trophy className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-medium">{`You haven't made any donations yet`}</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Explore fundraisers and make an impact! Your donations will appear here.
                      </p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" asChild>
                        <Link href="/fundraisers">Browse Fundraisers</Link>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredDonations.map((donation) => (
                    <div
                      key={donation._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:border-purple-500/50 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <Link
                          href={`/fundraisers/${donation.fundraiser_id}`}
                          className="font-medium hover:text-purple-500 transition-colors flex items-center gap-2"
                        >
                          {donation.fundraiser_title}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(donation.created_at)}</span>
                          <span className="flex items-center gap-1">
                            Transaction: {truncateSignature(donation.transaction_signature)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-green-500">{formatCurrency(donation.amount)}</p>
                          <p className="text-xs text-muted-foreground">Confirmed</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fundraisers" className="space-y-8">
            {/* Fundraiser Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Raised (USD)</p>
                <p className="text-3xl font-bold text-purple-500">{formatCurrency(totalRaised)}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-3xl font-bold">{activeCampaigns}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Fundraisers</p>
                <p className="text-3xl font-bold">{userFundraisers?.length || 0}</p>
              </div>
            </div>

            {/* Fundraiser Management Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">My Fundraisers</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fundraisers..."
                      className="pl-9 bg-background border-border/50 h-10"
                      value={fundraiserSearchQuery}
                      onChange={(e) => setFundraiserSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link href="/fundraisers/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create
                    </Link>
                  </Button>
                </div>
              </div>

              {filteredFundraisers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-muted/30 p-6 mb-4">
                    <Plus className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-medium">{`You haven't created any fundraisers yet`}</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Start your first fundraiser and make an impact! Share your cause with the world.
                  </p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link href="/fundraisers/create">Create Your First Fundraiser</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredFundraisers.map((fundraiser) => {
                    const status = getFundraiserStatus(fundraiser)
                    const percentFunded = (fundraiser.current_amount / fundraiser.target_amount) * 100

                    return (
                      <div
                        key={fundraiser._id}
                        className="p-6 rounded-lg border border-border/50 bg-card hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{fundraiser.title}</h3>
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  getStatusColor(status)
                                )}
                              >
                                {status}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {fundraiser.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Amount Raised</p>
                                <p className="font-medium">{formatCurrency(fundraiser.current_amount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Goal</p>
                                <p className="font-medium">{formatCurrency(fundraiser.target_amount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Progress</p>
                                <p className="font-medium">{percentFunded.toFixed(0)}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Created</p>
                                <p className="font-medium">{formatDate(fundraiser.created_at)}</p>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-muted/50 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(percentFunded, 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2 lg:w-32">
                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none" asChild>
                              <Link href={`/fundraisers/${fundraiser._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
} 