"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  ArrowLeft,
  Calendar,
  Copy,
  ExternalLink,
  Heart,
  Share2,
  Users,
  Clock,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

export function FundraiserDetailSimple() {
  const params = useParams()
  const { data: session } = useSession()
  const { publicKey } = useWallet()
  const fundraiserId = params?.id as string

  // Fetch fundraiser data from Convex
  const fundraiser = useQuery(
    api.fundraisers.getFundraiser,
    fundraiserId ? {
      fundraiser_id: fundraiserId as Id<"fundraisers">,
      viewer_wallet_address: publicKey?.toBase58()
    } : "skip"
  )

  // Fetch donations for this fundraiser
  const donations = useQuery(
    api.donations.getFundraiserDonations,
    fundraiserId ? { fundraiser_id: fundraiserId as Id<"fundraisers"> } : "skip"
  )

  // Fetch fundraiser stats
  const stats = useQuery(
    api.donations.getFundraiserStats,
    fundraiserId ? { fundraiser_id: fundraiserId as Id<"fundraisers"> } : "skip"
  )

  const [donationAmount, setDonationAmount] = useState("")
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Loading state
  if (!fundraiser || !stats) {
    return (
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container py-6 md:py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted/30 rounded w-1/3"></div>
            <div className="h-12 bg-muted/30 rounded w-2/3"></div>
            <div className="h-64 bg-muted/30 rounded"></div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // Error state
  if (!fundraiser) {
    return (
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container py-6 md:py-10">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Fundraiser not found</h2>
            <p className="text-muted-foreground mt-2">This fundraiser may have been removed or the link is invalid.</p>
            <Button asChild className="mt-4">
              <Link href="/fundraisers">Back to Fundraisers</Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // Helper functions
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getCategoryFromTitle = (title: string) => {
    if (title.toLowerCase().includes('garden') || title.toLowerCase().includes('environment')) return 'Environment';
    if (title.toLowerCase().includes('medical') || title.toLowerCase().includes('health')) return 'Healthcare';
    if (title.toLowerCase().includes('school') || title.toLowerCase().includes('technology') || title.toLowerCase().includes('education')) return 'Education';
    if (title.toLowerCase().includes('animal') || title.toLowerCase().includes('shelter')) return 'Animal Welfare';
    if (title.toLowerCase().includes('sports') || title.toLowerCase().includes('youth')) return 'Sports & Recreation';
    return 'Community';
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDonate = () => {
    alert(`Donation of ${donationAmount} USD - This would integrate with Solana payment`)
  }

  return (
    <ScrollArea className="h-[calc(100vh-3.5rem)]">
      <div className="container py-6 md:py-10">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
            <Link href="/fundraisers">
              <ArrowLeft className="h-4 w-4" />
              Back to Fundraisers
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Fundraiser header */}
            <div className="space-y-4">
              <div className="inline-block bg-purple-500/10 text-purple-500 px-2.5 py-0.5 rounded-full text-xs font-medium">
                {getCategoryFromTitle(fundraiser.title)}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{fundraiser.title}</h1>
              <p className="text-muted-foreground">
                {fundraiser.description.substring(0, 200)}...
              </p>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Created by</span>
                <span className="font-medium text-foreground">
                  {truncateAddress(fundraiser.owner_wallet_address)}
                </span>
                <button
                  onClick={() => copyToClipboard(fundraiser.owner_wallet_address)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy address</span>
                </button>
                {copiedAddress && <span className="text-xs text-purple-500">Copied!</span>}
              </div>
            </div>

            {/* Placeholder for media */}
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Media gallery would go here</p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {fundraiser.description}
                </p>
              </div>
            </div>

            {/* Recent donations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Donations</h2>
              {donations && donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.slice(0, 5).map((donation, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-card/50">
                      <div>
                        <p className="font-medium">{donation.donor_display}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(donation.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-500">{formatCurrency(donation.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          <a
                            href={`https://solscan.io/tx/${donation.transaction_signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-500 flex items-center gap-1"
                          >
                            View tx <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No donations yet. Be the first to support this cause!</p>
              )}
            </div>
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Key statistics block */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Raised</span>
                    <span className="font-medium">{formatCurrency(fundraiser.current_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Goal</span>
                    <span>{formatCurrency(fundraiser.target_amount)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${Math.min((fundraiser.current_amount / fundraiser.target_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{((fundraiser.current_amount / fundraiser.target_amount) * 100).toFixed(0)}% Funded</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/20">
                    <Users className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="font-medium">{stats.total_donors}</span>
                    <span className="text-xs text-muted-foreground">Supporters</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/20">
                    <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="font-medium">{fundraiser.is_active ? 'Active' : 'Inactive'}</span>
                    <span className="text-xs text-muted-foreground">Status</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>Created {formatDate(fundraiser.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Donation form */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="font-semibold">Support this cause</h3>
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Enter amount (USD)"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                  />
                  <Button
                    onClick={handleDonate}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Donate {donationAmount ? `$${donationAmount}` : ''}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Donations are processed securely on the Solana blockchain
                </p>
              </div>

              {/* Share buttons */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="font-semibold">Share this fundraiser</h3>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
} 