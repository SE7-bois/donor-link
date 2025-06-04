"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Share2,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Edit,
  Trash2,
  Crown,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

import { SupportersModal } from "~/components/supporters-modal";
import { MarkdownContent } from "~/components/markdown-content";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useDonation } from "~/lib/hooks/use-donation";
import { formatTokenAmount } from "~/lib/solana-tokens";

export function FundraiserDetailSimple() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const fundraiserId = params.id as Id<"fundraisers">;

  // Fetch fundraiser data from Convex (with computed UI fields)
  const fundraiser = useQuery(
    api.fundraisers.getFundraiserWithStats,
    {
      fundraiser_id: fundraiserId,
    }
  );

  // Fetch recent supporters for this fundraiser
  const recentSupporters = useQuery(
    api.donations.getRecentSupporters,
    fundraiserId ? { fundraiser_id: fundraiserId as Id<"fundraisers">, limit: 5 } : "skip"
  );

  // Fetch all supporters for the modal
  const allSupporters = useQuery(
    api.donations.getAllSupporters,
    fundraiserId ? { fundraiser_id: fundraiserId as Id<"fundraisers"> } : "skip"
  );



  // Fetch donations for this fundraiser
  const donations = useQuery(
    api.donations.getFundraiserDonations,
    fundraiserId ? { fundraiser_id: fundraiserId as Id<"fundraisers"> } : "skip"
  );

  // Fetch fundraiser stats
  const stats = useQuery(
    api.donations.getFundraiserStats,
    fundraiserId ? { fundraiser_id: fundraiserId as Id<"fundraisers"> } : "skip"
  );

  // Delete fundraiser mutation
  const deleteFundraiserMutation = useMutation(api.fundraisers.deleteFundraiser);

  // Donation functionality
  const donation = useDonation();

  const [donationAmount, setDonationAmount] = useState("");
  const [stablecoin, setStablecoin] = useState<"USDC" | "USDT">("USDC");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [isSupportersModalOpen, setIsSupportersModalOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Check if current user is the owner of this fundraiser
  const userWalletAddress = publicKey?.toBase58();
  const isOwner = userWalletAddress && fundraiser && userWalletAddress === fundraiser.owner_wallet_address;

  // Helper functions
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);

    // Show appropriate toast message
    if (text.startsWith('http')) {
      toast.success("Link copied to clipboard!", {
        description: "Share this fundraiser with others"
      });
    } else {
      // For wallet addresses, no toast needed as we show inline feedback
    }

    setTimeout(() => setCopiedAddress(false), 2000);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDonate = async () => {
    if (!fundraiser) return;

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    const success = await donation.donate({
      fundraiserId: fundraiserId,
      recipientWalletAddress: fundraiser.owner_wallet_address,
      amount: amount,
      token: stablecoin,
      donorDisplayName: donation.walletAddress, // We could add display name from user profile later
    });

    if (success) {
      setDonationAmount(""); // Clear the form on success
    }
  };

  const handlePrevMedia = () => {
    if (!fundraiser?.media || fundraiser.media.length === 0) return;
    setActiveMediaIndex((activeMediaIndex - 1 + fundraiser.media.length) % fundraiser.media.length);
  };

  const handleNextMedia = () => {
    if (!fundraiser?.media || fundraiser.media.length === 0) return;
    setActiveMediaIndex((activeMediaIndex + 1) % fundraiser.media.length);
  };

  const handleEditFundraiser = () => {
    // Navigate to edit page or open edit modal
    window.location.href = `/fundraisers/${fundraiserId}/edit`;
  };

  const handleDeleteFundraiser = async () => {
    const confirmMessage = `Are you sure you want to delete "${fundraiser?.title}"?\n\n⚠️ This action cannot be undone!\n\n⚠️ If this fundraiser has received donations, deletion will be blocked and you should deactivate it instead.\n\nClick OK to proceed with deletion.`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteFundraiserMutation({
          fundraiser_id: fundraiserId,
          wallet_address: userWalletAddress!,
        });

        toast.success("Fundraiser deleted successfully!");

        // Redirect to fundraisers list
        router.push("/fundraisers");
      } catch (error) {
        toast.error("Failed to delete fundraiser", {
          description: error instanceof Error ? error.message : "Please try again later."
        });
      }
    }
  };

  // Show loading state while data is being fetched
  if (fundraiser === undefined || stats === undefined) {
    return (
      <div className="container py-6 md:py-10">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-muted-foreground">Loading fundraiser...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if fundraiser not found
  if (fundraiser === null) {
    return (
      <div className="container py-6 md:py-10">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Fundraiser not found</p>
            <Button variant="outline" asChild>
              <Link href="/fundraisers">Back to Fundraisers</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate additional UI fields
  const daysLeft = fundraiser.end_date ?
    Math.max(0, Math.ceil((fundraiser.end_date - Date.now()) / (1000 * 60 * 60 * 24))) :
    null;

  const endDate = fundraiser.end_date ?
    new Date(fundraiser.end_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : null;

  // Get displayed updates (show first 2 by default)
  const displayedUpdates = showAllUpdates
    ? (fundraiser.updates || [])
    : (fundraiser.updates || []).slice(0, 2);

  return (
    <>
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

        {/* Owner Management Section */}
        {isOwner && (
          <div className="mb-6 p-4 rounded-lg border border-border/30 bg-muted/20 dark:bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  You are the owner of this fundraiser
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEditFundraiser}
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteFundraiser}
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground hover:text-red-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Fundraiser header */}
            <div className="space-y-4">
              <div className="inline-block bg-purple-500/10 text-purple-500 px-2.5 py-0.5 rounded-full text-xs font-medium">
                {fundraiser.category.join(", ")}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{fundraiser.title}</h1>
              {fundraiser.tagline && (
                <p className="text-muted-foreground text-lg">
                  {fundraiser.tagline}
                </p>
              )}

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Created by</span>
                <span className="font-medium text-foreground">
                  {fundraiser.creator_name || truncateAddress(fundraiser.owner_wallet_address)}
                </span>
                {isOwner && (
                  <span className="inline-flex items-center gap-1 bg-muted/30 text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                    <Crown className="h-3 w-3" />
                    You
                  </span>
                )}
                <span className="text-xs">({truncateAddress(fundraiser.owner_wallet_address)})</span>
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

            {/* Advanced Media Gallery with Hero Image and Thumbnails */}
            {fundraiser.media && fundraiser.media.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Media Gallery</h2>

                {/* Hero Image/Video Display */}
                <div className="relative rounded-lg overflow-hidden bg-muted/30 border border-border/20">
                  {fundraiser.media?.[activeMediaIndex]?.type === "image" ? (
                    <img
                      src={fundraiser.media?.[activeMediaIndex]?.url}
                      alt={fundraiser.media?.[activeMediaIndex]?.alt || "Media"}
                      className="w-full h-auto object-contain max-h-96 min-h-64"
                      style={{ aspectRatio: 'auto' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="aspect-video">
                      <video
                        src={fundraiser.media?.[activeMediaIndex]?.url}
                        poster={fundraiser.media?.[activeMediaIndex]?.thumbnail}
                        className="w-full h-full object-contain"
                        controls
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Media Type Indicator */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {fundraiser.media?.[activeMediaIndex]?.type === "image" ? "Image" : "Video"} {activeMediaIndex + 1} of {fundraiser.media?.length}
                  </div>

                  {/* Navigation Arrows (only show if more than 1 media item) */}
                  {(fundraiser.media?.length || 0) > 1 && (
                    <>
                      <button
                        onClick={handlePrevMedia}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextMedia}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation (only show if more than 1 media item) */}
                {(fundraiser.media?.length || 0) > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {fundraiser.media?.map((mediaItem, index) => (
                      <button
                        key={mediaItem.id}
                        onClick={() => setActiveMediaIndex(index)}
                        className={cn(
                          "relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all bg-muted/20",
                          activeMediaIndex === index
                            ? "border-purple-500 ring-2 ring-purple-500/20"
                            : "border-transparent hover:border-purple-500/50"
                        )}
                        style={{ width: 'auto', minWidth: '80px', maxWidth: '120px' }}
                      >
                        {mediaItem.type === "image" ? (
                          <img
                            src={mediaItem.url}
                            alt={mediaItem.alt || `Thumbnail ${index + 1}`}
                            className="w-full h-16 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="relative w-20 h-16">
                            <img
                              src={mediaItem.thumbnail || mediaItem.url}
                              alt={mediaItem.alt || `Video thumbnail ${index + 1}`}
                              className="w-full h-full object-contain bg-black/5"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Play className="h-4 w-4 text-white" fill="white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No media uploaded for this fundraiser</p>
              </div>
            )}

            {/* Tabs for Description and Updates */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="updates">
                  Updates ({fundraiser.updates ? fundraiser.updates.length : 0})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Project Description</h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    Supports Markdown
                  </span>
                </div>
                <MarkdownContent content={fundraiser.description} />
              </TabsContent>
              <TabsContent value="updates" className="pt-4 space-y-6">
                {fundraiser.updates && fundraiser.updates.length > 0 ? (
                  <>
                    {displayedUpdates.map((update: any) => (
                      <div key={update.id} className="space-y-2 pb-6 border-b border-border/50 last:border-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{update.title}</h3>
                          <span className="text-xs text-muted-foreground">{update.date}</span>
                        </div>
                        <MarkdownContent content={update.content} />

                        {/* Embedded Media in Updates */}
                        {update.media && update.media.length > 0 && (
                          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                            <p className="text-sm text-muted-foreground">Update media coming soon...</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {fundraiser.updates.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllUpdates(!showAllUpdates)}
                        className="w-full text-muted-foreground hover:text-foreground"
                      >
                        {showAllUpdates ? (
                          <>
                            Show Less <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show All Updates <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No updates yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-8">
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
                    <span className="text-muted-foreground">
                      {formatCurrency(fundraiser.current_amount)} / {formatCurrency(fundraiser.target_amount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/20">
                    <Users className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="font-medium">{stats?.total_donors || 0}</span>
                    <span className="text-xs text-muted-foreground">Supporters</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/20">
                    <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="font-medium">{daysLeft || "∞"}</span>
                    <span className="text-xs text-muted-foreground">Days Left</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>
                      {endDate ? `Ends ${endDate}` : "No end date"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(window.location.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Share fundraiser"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Donation action block */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                <h3 className="text-lg font-medium">Support this Project</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm text-muted-foreground">
                      Donation Amount
                    </label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="pl-8"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="stablecoin" className="text-sm text-muted-foreground">
                      Select Stablecoin
                    </label>
                    <Select value={stablecoin} onValueChange={(value) => setStablecoin(value as "USDC" | "USDT")}>
                      <SelectTrigger id="stablecoin">
                        <SelectValue placeholder="Select stablecoin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-md bg-muted/20 p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Your {stablecoin} Balance:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {donation.isLoadingBalances ? (
                            <span className="animate-pulse">Loading...</span>
                          ) : donation.isConnected ? (
                            formatTokenAmount(donation.balances[stablecoin] || 0, stablecoin)
                          ) : (
                            "Connect wallet"
                          )}
                        </span>
                        {donation.isConnected && (
                          <button
                            onClick={donation.refreshBalances}
                            disabled={donation.isLoadingBalances}
                            className="p-1 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
                            title="Refresh balance"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleDonate}
                    disabled={
                      !donation.isConnected ||
                      donation.isLoading ||
                      !donationAmount ||
                      Number.parseFloat(donationAmount) <= 0 ||
                      (donation.balances[stablecoin] || 0) < Number.parseFloat(donationAmount || "0")
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    {donation.isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </span>
                    ) : !donation.isConnected ? (
                      "Connect wallet to donate"
                    ) : !donationAmount || Number.parseFloat(donationAmount) <= 0 ? (
                      "Enter an amount to donate"
                    ) : (donation.balances[stablecoin] || 0) < Number.parseFloat(donationAmount) ? (
                      `Insufficient ${stablecoin} balance`
                    ) : (
                      `Donate $${donationAmount} ${stablecoin}`
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Donations are processed on the Solana blockchain.
                  </p>
                </div>
              </div>

              {/* Recent supporters */}
              <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">Recent Supporters</h3>
                  <button
                    onClick={() => setIsSupportersModalOpen(true)}
                    className="text-xs text-purple-500 hover:text-purple-400 transition-colors"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recentSupporters && recentSupporters.length > 0 ? (
                    recentSupporters.slice(0, 3).map((supporter) => (
                      <div key={supporter.id} className="flex justify-between items-center text-sm py-1">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className="h-5 w-5 rounded-full bg-muted/50 flex-shrink-0"></div>
                          <span className="truncate text-xs">
                            {supporter.display_name || truncateAddress(supporter.address)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end ml-2 flex-shrink-0">
                          <span className="font-medium text-xs">{formatCurrency(supporter.amount)}</span>
                          <span className="text-xs text-muted-foreground">{supporter.timestamp}</span>
                        </div>
                      </div>
                    ))
                  ) : donations && donations.length > 0 ? (
                    donations.slice(0, 3).map((donation, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-1">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className="h-5 w-5 rounded-full bg-muted/50 flex-shrink-0"></div>
                          <span className="truncate text-xs">{donation.donor_display}</span>
                        </div>
                        <div className="flex flex-col items-end ml-2 flex-shrink-0">
                          <span className="font-medium text-xs">{formatCurrency(donation.amount)}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(donation.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs text-muted-foreground">Be the first to support!</p>
                    </div>
                  )}
                </div>

                {((recentSupporters && recentSupporters.length > 3) ||
                  (donations && donations.length > 3)) && (
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs text-center text-muted-foreground">
                        +{Math.max(
                          (recentSupporters?.length || 0) - 3,
                          (donations?.length || 0) - 3
                        )} more supporters
                      </p>
                    </div>
                  )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supporters Modal */}
      <SupportersModal
        isOpen={isSupportersModalOpen}
        onClose={() => setIsSupportersModalOpen(false)}
        fundraiserTitle={fundraiser.title}
        supporters={allSupporters || []}
      />
    </>
  );
}