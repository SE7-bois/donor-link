"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSolanaWallet } from "~/lib/hooks/use-solana-wallet";
import Link from "next/link"
import {
  ArrowUpRight,
  Copy,
  Edit,
  ExternalLink,
  Trophy,
  User,
  Users,
  Wallet,
  Shield,
  Bell,
  Eye,
  MessageSquare,
  Plus,
} from "lucide-react"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"


// Mock user data
const mockUser = {
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  displayName: "Alex Chen",
  bio: "Passionate about education technology and blockchain innovation. Building tools to make learning accessible to everyone.",
  joinedDate: "2023-03-15",
  profileImage: null,
  website: "https://alexchen.dev",
  twitter: "@alexchen_dev",
  totalDonated: 1250,
  totalRaised: 12400,
  projectsSupported: 6,
  campaignsCreated: 3,
  leaderboardRank: 42,
  totalSupporters: 89,
  activeCampaigns: 2,
}

// Mock donation data (same as dashboard)
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
]

// Mock fundraiser data (same as dashboard)
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
]

export default function ProfilePage() {
  const { connected } = useSolanaWallet();
  const router = useRouter();

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return <Profile />;
}

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(mockUser.displayName)
  const [bio, setBio] = useState(mockUser.bio)
  const [website, setWebsite] = useState(mockUser.website)
  const [twitter, setTwitter] = useState(mockUser.twitter)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  const [showDonations, setShowDonations] = useState(false)

  // Truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Copy wallet address to clipboard
  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
  }

  return (
    <ScrollArea className="h-[calc(100vh-3.5rem)]">
      <div className="container py-6 md:py-10 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              className={isEditing ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
              {!isEditing && <Edit className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {/* User Info Card */}
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User className="h-12 w-12 text-purple-500" />
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    {isEditing ? (
                      <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    ) : (
                      <p className="text-lg font-medium">{displayName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted/30 px-2 py-1 rounded">
                        {truncateAddress(mockUser.walletAddress)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(mockUser.walletAddress)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {copiedAddress && <span className="text-xs text-purple-500">Copied!</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="text-muted-foreground">{bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                      >
                        {website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    {isEditing ? (
                      <Input
                        id="twitter"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="@username"
                      />
                    ) : (
                      <a
                        href={`https://twitter.com/${twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                      >
                        {twitter}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">Member since {formatDate(mockUser.joinedDate)}</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donations">My Donations</TabsTrigger>
            <TabsTrigger value="fundraisers">My Fundraisers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Total Donated</p>
                <p className="text-2xl font-bold text-purple-500">{formatCurrency(mockUser.totalDonated)}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-purple-500">{formatCurrency(mockUser.totalRaised)}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Projects Supported</p>
                <p className="text-2xl font-bold">{mockUser.projectsSupported}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
                  <Link
                    href="/leaderboard"
                    className="text-xs text-purple-500 hover:text-purple-400 flex items-center gap-1"
                  >
                    View
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <p className="text-2xl font-bold">#{mockUser.leaderboardRank}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Recent Donations</h3>
                  <Link
                    href="/profile?tab=donations"
                    className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                  {mockDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="p-4 border-b border-border/30 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Link
                            href={`/fundraiser/${donation.fundraiserId}`}
                            className="text-sm font-medium hover:text-purple-500 transition-colors"
                          >
                            {donation.fundraiserTitle}
                          </Link>
                          <p className="text-xs text-muted-foreground">{formatDate(donation.date)}</p>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(donation.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Fundraisers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">My Fundraisers</h3>
                  <Link
                    href="/profile?tab=fundraisers"
                    className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                  {mockFundraisers.slice(0, 3).map((fundraiser) => {
                    const percentFunded = Math.min(
                      100,
                      Math.round((fundraiser.amountRaised / fundraiser.goalAmount) * 100),
                    )

                    return (
                      <div key={fundraiser.id} className="p-4 border-b border-border/30 last:border-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/fundraiser/${fundraiser.id}`}
                              className="text-sm font-medium hover:text-purple-500 transition-colors"
                            >
                              {fundraiser.title}
                            </Link>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                                getStatusColor(fundraiser.status),
                              )}
                            >
                              {fundraiser.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full rounded-full bg-muted/50">
                              <div
                                className="h-full rounded-full bg-purple-500"
                                style={{ width: `${percentFunded}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{percentFunded}% funded</span>
                              <span className="text-muted-foreground">{fundraiser.supportersCount} supporters</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Donation History</h2>
              <div className="text-sm text-muted-foreground">
                Total donated:{" "}
                <span className="font-medium text-purple-500">{formatCurrency(mockUser.totalDonated)}</span>
              </div>
            </div>

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
                    {mockDonations.map((donation) => (
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
          </TabsContent>

          <TabsContent value="fundraisers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Fundraisers</h2>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/fundraisers/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Fundraiser
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-purple-500">{formatCurrency(mockUser.totalRaised)}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Total Supporters</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <p className="text-2xl font-bold">{mockUser.totalSupporters}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{mockUser.activeCampaigns}</p>
              </div>
            </div>

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
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {mockFundraisers.map((fundraiser) => {
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
                                  {formatCurrency(fundraiser.amountRaised)} / {formatCurrency(fundraiser.goalAmount)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-medium">{fundraiser.supportersCount}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Public Page">
                                <Link href={`/fundraiser/${fundraiser.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>

                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Campaign">
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Post Update">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>

            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your profile and donation history
                      </p>
                    </div>
                    <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Donation History</Label>
                      <p className="text-sm text-muted-foreground">Display your donations on your public profile</p>
                    </div>
                    <Switch checked={showDonations} onCheckedChange={setShowDonations} disabled={!publicProfile} />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your fundraisers and donations
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                </div>
              </div>

              {/* Wallet Settings */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Settings
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Connected Wallet</Label>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Wallet className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{truncateAddress(mockUser.walletAddress)}</p>
                          <p className="text-xs text-muted-foreground">Solana Wallet</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}