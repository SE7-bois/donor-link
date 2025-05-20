"use client"

import { useState } from "react"
import Link from "next/link"
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

// Mock donation data
interface Donation {
  id: string
  fundraiserId: string
  fundraiserTitle: string
  amount: number
  date: string
  status: "Confirmed" | "Pending"
  transactionHash: string
}

const mockDonations: Donation[] = [
  {
    id: "1",
    fundraiserId: "1",
    fundraiserTitle: "Coding Bootcamp for Underprivileged Youth",
    amount: 250,
    date: "2023-05-15",
    status: "Confirmed",
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "2",
    fundraiserId: "2",
    fundraiserTitle: "Renewable Energy for Rural Schools",
    amount: 100,
    date: "2023-05-10",
    status: "Confirmed",
    transactionHash: "0x9876543210fedcba9876543210fedcba98765432",
  },
  {
    id: "3",
    fundraiserId: "3",
    fundraiserTitle: "Community Garden Initiative",
    amount: 75,
    date: "2023-05-05",
    status: "Confirmed",
    transactionHash: "0x1122334455667788990011223344556677889900",
  },
  {
    id: "4",
    fundraiserId: "4",
    fundraiserTitle: "Emergency Medical Supplies for Clinic",
    amount: 500,
    date: "2023-04-28",
    status: "Confirmed",
    transactionHash: "0xaabbccddeeff00112233445566778899aabbccdd",
  },
  {
    id: "5",
    fundraiserId: "5",
    fundraiserTitle: "Open Source Blockchain Development Tools",
    amount: 150,
    date: "2023-04-20",
    status: "Confirmed",
    transactionHash: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst",
  },
  {
    id: "6",
    fundraiserId: "6",
    fundraiserTitle: "Local Theater Renovation Project",
    amount: 175,
    date: "2023-04-15",
    status: "Confirmed",
    transactionHash: "0x5678ijkl1234abcd9012efgh3456mnop7890qrst",
  },
]

// Mock fundraiser data
interface Fundraiser {
  id: string
  title: string
  status: "Active" | "Ended - Goal Met" | "Ended - Goal Not Met" | "Draft"
  amountRaised: number
  goalAmount: number
  supportersCount: number
  daysLeft: number | null
  endDate: string | null
  createdAt: string
}

const mockFundraisers: Fundraiser[] = [
  {
    id: "1",
    title: "Open Source Blockchain Development Tools",
    status: "Active",
    amountRaised: 4200,
    goalAmount: 12000,
    supportersCount: 35,
    daysLeft: 21,
    endDate: "2023-06-15",
    createdAt: "2023-05-01",
  },
  {
    id: "2",
    title: "Community Coding Workshop Series",
    status: "Active",
    amountRaised: 1800,
    goalAmount: 3000,
    supportersCount: 24,
    daysLeft: 7,
    endDate: "2023-06-01",
    createdAt: "2023-05-10",
  },
  {
    id: "3",
    title: "Tech Education Scholarship Fund",
    status: "Ended - Goal Met",
    amountRaised: 5000,
    goalAmount: 5000,
    supportersCount: 42,
    daysLeft: null,
    endDate: "2023-04-15",
    createdAt: "2023-03-01",
  },
  {
    id: "4",
    title: "Decentralized Identity Research",
    status: "Ended - Goal Not Met",
    amountRaised: 3200,
    goalAmount: 8000,
    supportersCount: 18,
    daysLeft: null,
    endDate: "2023-03-30",
    createdAt: "2023-02-15",
  },
  {
    id: "5",
    title: "Web3 Developer Conference",
    status: "Draft",
    amountRaised: 0,
    goalAmount: 15000,
    supportersCount: 0,
    daysLeft: null,
    endDate: null,
    createdAt: "2023-05-18",
  },
]

// Mock recent activity data
interface Activity {
  id: string
  fundraiserId: string
  fundraiserTitle: string
  type: "donation" | "milestone" | "update"
  message: string
  date: string
}

const mockActivities: Activity[] = [
  {
    id: "1",
    fundraiserId: "1",
    fundraiserTitle: "Open Source Blockchain Development Tools",
    type: "donation",
    message: "0xabc...def just donated $100",
    date: "2023-05-20T14:30:00Z",
  },
  {
    id: "2",
    fundraiserId: "1",
    fundraiserTitle: "Open Source Blockchain Development Tools",
    type: "milestone",
    message: "Reached 30% of funding goal!",
    date: "2023-05-18T10:15:00Z",
  },
  {
    id: "3",
    fundraiserId: "2",
    fundraiserTitle: "Community Coding Workshop Series",
    type: "donation",
    message: "0x123...789 just donated $250",
    date: "2023-05-19T09:45:00Z",
  },
  {
    id: "4",
    fundraiserId: "1",
    fundraiserTitle: "Open Source Blockchain Development Tools",
    type: "update",
    message: "You posted a new update: 'Development Progress Update'",
    date: "2023-05-15T16:20:00Z",
  },
  {
    id: "5",
    fundraiserId: "2",
    fundraiserTitle: "Community Coding Workshop Series",
    type: "donation",
    message: "0xdef...789 just donated $50",
    date: "2023-05-17T11:30:00Z",
  },
]

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [fundraiserSearchQuery, setFundraiserSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showSupportersModal, setShowSupportersModal] = useState(false)
  const [selectedFundraiser, setSelectedFundraiser] = useState<Fundraiser | null>(null)

  // Calculate statistics
  const totalDonated = mockDonations.reduce((sum, donation) => sum + donation.amount, 0)
  const projectsSupported = new Set(mockDonations.map((donation) => donation.fundraiserId)).size
  const leaderboardRank = 42 // Mock rank

  // Calculate fundraiser statistics
  const totalRaised = mockFundraisers.reduce((sum, fundraiser) => sum + fundraiser.amountRaised, 0)
  const totalSupporters = mockFundraisers.reduce((sum, fundraiser) => sum + fundraiser.supportersCount, 0)
  const activeCampaigns = mockFundraisers.filter((fundraiser) => fundraiser.status === "Active").length

  // Filter donations based on search query and time filter
  const filteredDonations = mockDonations.filter((donation) => {
    const matchesSearch = donation.fundraiserTitle.toLowerCase().includes(searchQuery.toLowerCase())

    if (timeFilter === "all") return matchesSearch

    const donationDate = new Date(donation.date)
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
  })

  // Filter fundraisers based on search query and status filter
  const filteredFundraisers = mockFundraisers.filter((fundraiser) => {
    const matchesSearch = fundraiser.title.toLowerCase().includes(fundraiserSearchQuery.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && fundraiser.status.toLowerCase().includes(statusFilter.toLowerCase())
  })

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  // Truncate transaction hash
  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500"
      case "Ended - Goal Met":
        return "bg-purple-500/10 text-purple-500"
      case "Ended - Goal Not Met":
        return "bg-yellow-500/10 text-yellow-500"
      case "Draft":
        return "bg-muted/30 text-muted-foreground"
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
                  <p className="text-3xl font-bold">#{leaderboardRank}</p>
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
                        We couldn't find any donations matching your search criteria. Try adjusting your filters.
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
                      <h3 className="text-xl font-medium">You haven't made any donations yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Explore fundraisers and make an impact! Your donations will appear here.
                      </p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" asChild>
                        <Link href="/browse-fundraisers">Browse Fundraisers</Link>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/20">
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Fundraiser
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {filteredDonations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                href={`/fundraiser/${donation.fundraiserId}`}
                                className="text-sm font-medium hover:text-purple-500 transition-colors"
                              >
                                {donation.fundraiserTitle}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-medium">{formatCurrency(donation.amount)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm text-muted-foreground">{formatDate(donation.date)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <span
                                  className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                    donation.status === "Confirmed"
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-yellow-500/10 text-yellow-500",
                                  )}
                                >
                                  {donation.status}
                                </span>
                                <a
                                  href={`https://explorer.solana.com/tx/${donation.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  <span className="sr-only">View transaction</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fundraisers" className="space-y-8">
            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Raised (USD)</p>
                <p className="text-3xl font-bold text-purple-500">{formatCurrency(totalRaised)}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Supporters</p>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-muted-foreground" />
                  <p className="text-3xl font-bold">{totalSupporters}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-3xl font-bold">{activeCampaigns}</p>
              </div>
            </div>

            {/* Your Fundraisers Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Your Fundraisers</h2>

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
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredFundraisers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  {fundraiserSearchQuery || statusFilter !== "all" ? (
                    <>
                      <div className="rounded-full bg-muted/30 p-6 mb-4">
                        <Search className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-medium">No fundraisers found</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        We couldn't find any fundraisers matching your search criteria. Try adjusting your filters.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setFundraiserSearchQuery("")
                          setStatusFilter("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted/30 p-6 mb-4">
                        <Plus className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-medium">You haven't created any fundraisers yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Ready to start a campaign? Create your first fundraiser and begin making an impact.
                      </p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" asChild>
                        <Link href="/create">Create New Fundraiser</Link>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/20">
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Fundraiser
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Supporters
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Time Left
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {filteredFundraisers.map((fundraiser) => {
                          const percentFunded = Math.min(
                            100,
                            Math.round((fundraiser.amountRaised / fundraiser.goalAmount) * 100),
                          )

                          return (
                            <tr key={fundraiser.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4">
                                <Link
                                  href={`/fundraiser/${fundraiser.id}`}
                                  className="text-sm font-medium hover:text-purple-500 transition-colors"
                                >
                                  {fundraiser.title}
                                </Link>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                    getStatusColor(fundraiser.status),
                                  )}
                                >
                                  {fundraiser.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1 max-w-[200px]">
                                  <div className="h-2 w-full rounded-full bg-muted/50">
                                    <div
                                      className="h-full rounded-full bg-purple-500"
                                      style={{ width: `${percentFunded}%` }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="font-medium">{percentFunded}%</span>
                                    <span className="text-muted-foreground">
                                      {formatCurrency(fundraiser.amountRaised)} /{" "}
                                      {formatCurrency(fundraiser.goalAmount)}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-sm font-medium">{fundraiser.supportersCount}</span>
                                  <span className="text-xs text-muted-foreground">supporters</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {fundraiser.status === "Active" && fundraiser.daysLeft !== null ? (
                                  <div className="flex flex-col items-center">
                                    <span className="text-sm font-medium">{fundraiser.daysLeft}</span>
                                    <span className="text-xs text-muted-foreground">days left</span>
                                  </div>
                                ) : fundraiser.status === "Draft" ? (
                                  <span className="text-xs text-muted-foreground">Not launched</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Campaign ended</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    asChild
                                    title="View Public Page"
                                  >
                                    <Link href={`/fundraiser/${fundraiser.id}`}>
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Link>
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    asChild
                                    title="Edit Campaign"
                                    disabled={fundraiser.status !== "Draft" && fundraiser.status !== "Active"}
                                  >
                                    <Link href={`/edit-fundraiser/${fundraiser.id}`}>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Link>
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    title="View Supporters"
                                    disabled={fundraiser.supportersCount === 0}
                                    onClick={() => {
                                      setSelectedFundraiser(fundraiser)
                                      setShowSupportersModal(true)
                                    }}
                                  >
                                    <Users className="h-4 w-4" />
                                    <span className="sr-only">Supporters</span>
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    asChild
                                    title="Post Update"
                                    disabled={fundraiser.status === "Draft"}
                                  >
                                    <Link href={`/post-update/${fundraiser.id}`}>
                                      <MessageSquare className="h-4 w-4" />
                                      <span className="sr-only">Post Update</span>
                                    </Link>
                                  </Button>

                                  {fundraiser.status === "Active" && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Withdraw Funds">
                                      <WalletIcon className="h-4 w-4" />
                                      <span className="sr-only">Withdraw</span>
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>

              {mockActivities.length === 0 ? (
                <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
                  <p className="text-muted-foreground">No recent activity for your fundraisers.</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                  <div className="divide-y divide-border/30">
                    {mockActivities.slice(0, 5).map((activity) => {
                      // Format the date to a relative time (e.g., "2 hours ago")
                      const activityDate = new Date(activity.date)
                      const now = new Date()
                      const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60))

                      let timeAgo
                      if (diffInHours < 1) {
                        timeAgo = "Just now"
                      } else if (diffInHours < 24) {
                        timeAgo = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
                      } else {
                        const diffInDays = Math.floor(diffInHours / 24)
                        timeAgo = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
                      }

                      return (
                        <div key={activity.id} className="p-4 hover:bg-muted/10 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="text-sm">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">
                                <Link
                                  href={`/fundraiser/${activity.fundraiserId}`}
                                  className="hover:text-purple-500 transition-colors"
                                >
                                  {activity.fundraiserTitle}
                                </Link>
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{timeAgo}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {mockActivities.length > 5 && (
                    <div className="p-3 border-t border-border/30 bg-muted/5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                      >
                        View All Activity
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
