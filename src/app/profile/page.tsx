"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
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

  Eye,
  MessageSquare,
  Plus,
  WalletIcon,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

import { cn } from "~/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "convex/_generated/api"
import ConnectWalletButton from "~/components/navigations/connect-wallet-button"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { connected, publicKey } = useWallet()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Get user's wallet address from wallet
  const userWalletAddress = publicKey?.toBase58()

  // Fetch user's data from Convex
  const userProfile = useQuery(
    api.users.getMyProfile,
    userWalletAddress ? { wallet_address: userWalletAddress } : "skip"
  )

  const userDonations = useQuery(
    api.donations.getMyDonations,
    userWalletAddress ? { wallet_address: userWalletAddress } : "skip"
  )

  const userFundraisers = useQuery(
    api.fundraisers.getMyFundraisers,
    userWalletAddress ? { wallet_address: userWalletAddress } : "skip"
  )

  // Mutation for updating profile
  const updateProfile = useMutation(api.users.updateProfile)

  // Initialize form fields when profile data loads
  React.useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || "")
      setBio(userProfile.bio || "")
      setWebsite(userProfile.website || "")
      setTwitter(userProfile.twitter || "")
    }
  }, [userProfile])

  // Show loading or login prompt if not authenticated
  if (status === "loading") {
    return (
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !connected || !publicKey) {
    return (
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Connect your wallet to view your profile</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <WalletIcon className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-medium">Wallet Not Connected</h3>
          <p className="text-muted-foreground max-w-md">
            Please connect your wallet to view your profile and activity.
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
  const totalSupporters = userFundraisers?.reduce((sum, fundraiser) => {
    // This would need a proper count from donations table, for now using simple logic
    return sum + (fundraiser.current_amount > 0 ? 1 : 0)
  }, 0) ?? 0

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

  // Format date for timestamps
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Truncate transaction signature
  const truncateSignature = (signature: string) => {
    return `${signature.substring(0, 6)}...${signature.substring(signature.length - 4)}`
  }

  // Get status badge color
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

  // Get status from fundraiser data
  const getFundraiserStatus = (fundraiser: any) => {
    if (!fundraiser.is_active) return "Inactive"
    const percentComplete = (fundraiser.current_amount / fundraiser.target_amount) * 100
    if (percentComplete >= 100) return "Goal Met"
    return "Active"
  }

  const handleSaveProfile = async () => {
    if (!userWalletAddress) {
      console.error("No wallet address available")
      alert("Error: No wallet address available. Please connect your wallet.")
      return
    }

    console.log("Updating profile for wallet:", userWalletAddress)
    console.log("Profile data:", {
      display_name: displayName.trim() || undefined,
      bio: bio.trim() || undefined,
      website: website.trim() || undefined,
      twitter: twitter.trim() || undefined,
    })

    try {
      const result = await updateProfile({
        wallet_address: userWalletAddress,
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        website: website.trim() || undefined,
        twitter: twitter.trim() || undefined,
      })

      console.log("Profile update result:", result)
      setIsEditing(false)

      // Show notification about paid feature if name was changed
      if (displayName && displayName.trim() !== "") {
        // You can replace this with your preferred toast/notification system
        alert("Profile updated! 🎉\n\nNote: Custom display names will be a premium feature in future updates. Enjoy it free for now!")
      } else {
        alert("Profile updated successfully! 🎉")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      alert(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    }
  }

  return (
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
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your name" />
                  ) : (
                    <p className="text-lg font-medium">{displayName || "Anonymous User"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted/30 px-2 py-1 rounded">
                      {truncateAddress(publicKey.toBase58())}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(publicKey.toBase58())}
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
                  <p className="text-muted-foreground">{bio || "No bio provided."}</p>
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
                  ) : website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      {website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">No website provided</p>
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
                  ) : twitter ? (
                    <a
                      href={`https://twitter.com/${twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      {twitter}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">No Twitter provided</p>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Connected: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">My Donations</TabsTrigger>
          <TabsTrigger value="fundraisers">My Fundraisers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Total Donated</p>
              <p className="text-2xl font-bold text-purple-500">{formatCurrency(totalDonated)}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold text-purple-500">{formatCurrency(totalRaised)}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Projects Supported</p>
              <p className="text-2xl font-bold">{projectsSupported}</p>
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
                <p className="text-2xl font-bold">#-</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Donations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Recent Donations</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Switch to donations tab
                    const tabsTrigger = document.querySelector('[value="donations"]') as HTMLElement;
                    tabsTrigger?.click();
                  }}
                  className="text-sm text-purple-500 hover:text-purple-400 transition-colors h-auto p-0"
                >
                  View All
                </Button>
              </div>
              <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                {userDonations && userDonations.length > 0 ? (
                  userDonations.slice(0, 3).map((donation) => (
                    <div key={donation._id} className="p-4 border-b border-border/30 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Link
                            href={`/fundraisers/${donation.fundraiser_id}`}
                            className="text-sm font-medium hover:text-purple-500 transition-colors"
                          >
                            {donation.fundraiser_title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{formatDate(donation.created_at)}</p>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(donation.amount)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No donations yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Fundraisers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">My Fundraisers</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Switch to fundraisers tab
                    const tabsTrigger = document.querySelector('[value="fundraisers"]') as HTMLElement;
                    tabsTrigger?.click();
                  }}
                  className="text-sm text-purple-500 hover:text-purple-400 transition-colors h-auto p-0"
                >
                  View All
                </Button>
              </div>
              <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                {userFundraisers && userFundraisers.length > 0 ? (
                  userFundraisers.slice(0, 3).map((fundraiser) => {
                    const percentFunded = Math.min(
                      100,
                      Math.round((fundraiser.current_amount / fundraiser.target_amount) * 100),
                    )
                    const status = getFundraiserStatus(fundraiser)

                    return (
                      <div key={fundraiser._id} className="p-4 border-b border-border/30 last:border-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/fundraisers/${fundraiser._id}`}
                              className="text-sm font-medium hover:text-purple-500 transition-colors"
                            >
                              {fundraiser.title}
                            </Link>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                                getStatusColor(status),
                              )}
                            >
                              {status}
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
                              <span>{formatCurrency(fundraiser.current_amount)} raised</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No fundraisers yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Donation History</h2>
            <div className="text-sm text-muted-foreground">
              Total donated:{" "}
              <span className="font-medium text-purple-500">{formatCurrency(totalDonated)}</span>
            </div>
          </div>

          {userDonations && userDonations.length > 0 ? (
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
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {userDonations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/fundraisers/${donation.fundraiser_id}`}
                            className="text-sm font-medium hover:text-purple-500 transition-colors"
                          >
                            {donation.fundraiser_title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-medium">{formatCurrency(donation.amount)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm text-muted-foreground">{formatDate(donation.created_at)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {truncateSignature(donation.transaction_signature)}
                            </span>
                            <a
                              href={`https://explorer.solana.com/tx/${donation.transaction_signature}`}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted/30 p-6 mb-4">
                <Trophy className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-medium">No donations yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Explore fundraisers and make an impact! Your donations will appear here.
              </p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/fundraisers">Browse Fundraisers</Link>
              </Button>
            </div>
          )}
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
              <p className="text-2xl font-bold text-purple-500">{formatCurrency(totalRaised)}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Total Supporters</p>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{totalSupporters}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold">{activeCampaigns}</p>
            </div>
          </div>

          {userFundraisers && userFundraisers.length > 0 ? (
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
                        Raised
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {userFundraisers.map((fundraiser) => {
                      const percentFunded = Math.min(
                        100,
                        Math.round((fundraiser.current_amount / fundraiser.target_amount) * 100),
                      )
                      const status = getFundraiserStatus(fundraiser)

                      return (
                        <tr key={fundraiser._id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <Link
                              href={`/fundraisers/${fundraiser._id}`}
                              className="text-sm font-medium hover:text-purple-500 transition-colors"
                            >
                              {fundraiser.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                getStatusColor(status),
                              )}
                            >
                              {status}
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
                                  {formatCurrency(fundraiser.current_amount)} / {formatCurrency(fundraiser.target_amount)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-medium">{formatCurrency(fundraiser.current_amount)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Public Page">
                                <Link href={`/fundraisers/${fundraiser._id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>

                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit Campaign">
                                <Link href={`/fundraisers/${fundraiser._id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted/30 p-6 mb-4">
                <Plus className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-medium">No fundraisers yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Ready to start a campaign? Create your first fundraiser and begin making an impact.
              </p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/fundraisers/create">Create Your First Fundraiser</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}