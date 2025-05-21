"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Heart,
  Share2,
  Users,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { MediaGallery } from "~/components/media-gallery"
import { EmbeddedMedia } from "~/components/embedded-media"
import { SupportersModal } from "~/components/supporters-modal"

// Mock fundraiser data with enhanced media
const fundraiser = {
  id: "1",
  title: "Coding Bootcamp for Underprivileged Youth",
  tagline: "Help provide coding education to underprivileged youth in urban areas, opening doors to tech careers.",
  category: "Education",
  creatorAddress: "0x1234567890abcdef1234567890abcdef12345678",
  creatorName: "Tech Education Foundation",
  currentAmount: 3.2,
  goalAmount: 5,
  percentFunded: 64,
  daysLeft: 12,
  endDate: "October 26, 2025",
  donorsCount: 72,
  createdAt: "September 14, 2025",
  // Media gallery for the fundraiser
  media: [
    {
      id: "media-1",
      type: "image" as const,
      url: "/placeholder.svg?height=1080&width=1920",
      alt: "Students learning to code in a classroom",
    },
    {
      id: "media-2",
      type: "image" as const,
      url: "/placeholder.svg?height=1080&width=1920",
      alt: "Student presenting their project",
    },
    {
      id: "media-3",
      type: "video" as const,
      url: "https://example.com/video.mp4", // This would be a real video URL in production
      thumbnail: "/placeholder.svg?height=1080&width=1920",
      alt: "Video tour of the coding bootcamp",
    },
    {
      id: "media-4",
      type: "image" as const,
      url: "/placeholder.svg?height=1080&width=1920",
      alt: "Graduation ceremony from previous bootcamp",
    },
    {
      id: "media-5",
      type: "image" as const,
      url: "/placeholder.svg?height=1080&width=1920",
      alt: "Students working on a group project",
    },
  ],
  description: `
    <h2>About This Project</h2>
    <p>We're on a mission to bridge the digital divide by providing comprehensive coding education to underprivileged youth in urban areas. Our 12-week bootcamp program is designed to equip students with the skills they need to pursue careers in technology.</p>
    
    <h2>The Problem</h2>
    <p>Despite the growing demand for tech talent, many young people from disadvantaged backgrounds lack access to quality coding education. This perpetuates inequality and prevents talented individuals from reaching their potential.</p>
    
    <h2>Our Solution</h2>
    <p>Our intensive bootcamp covers:</p>
    <ul>
      <li>Web development fundamentals (HTML, CSS, JavaScript)</li>
      <li>Modern frameworks and libraries (React, Node.js)</li>
      <li>Database design and management</li>
      <li>Blockchain development basics</li>
      <li>Professional development and job placement assistance</li>
    </ul>
    
    <h2>Impact</h2>
    <p>With your support, we can:</p>
    <ul>
      <li>Provide scholarships for 20 students</li>
      <li>Cover the cost of equipment and learning materials</li>
      <li>Secure experienced instructors and mentors</li>
      <li>Offer post-program career support</li>
    </ul>
    
    <h2>Timeline</h2>
    <p>January 2026: Student selection process</p>
    <p>February 2026: Bootcamp begins</p>
    <p>May 2026: Graduation and demo day</p>
    <p>June 2026: Job placement support</p>
    
    <h2>About Us</h2>
    <p>The Tech Education Foundation is a non-profit organization dedicated to making technology education accessible to all. We've successfully run similar programs in the past, with over 85% of our graduates securing jobs in the tech industry within 6 months of completion.</p>
    
    <h2>Thank You</h2>
    <p>Your contribution, no matter the size, will help change lives by opening doors to lucrative and fulfilling careers in technology. Thank you for your support!</p>
  `,
  updates: [
    {
      id: "1",
      date: "September 30, 2025",
      title: "Curriculum Finalized",
      content:
        "We're excited to announce that we've finalized our curriculum for the upcoming bootcamp. We've partnered with industry experts to ensure our content is up-to-date and aligned with current market demands.",
      media: [
        {
          id: "update-1-media-1",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Curriculum planning session",
        },
      ],
    },
    {
      id: "2",
      date: "September 22, 2025",
      title: "Instructor Team Assembled",
      content:
        "We've assembled an amazing team of instructors for the bootcamp, including senior developers from leading tech companies who are passionate about education and mentorship.",
      media: [
        {
          id: "update-2-media-1",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Our instructor team",
        },
        {
          id: "update-2-media-2",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Planning session with instructors",
        },
        {
          id: "update-2-media-3",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Instructor workshop",
        },
      ],
    },
    {
      id: "3",
      date: "September 15, 2025",
      title: "Fundraiser Launched",
      content:
        "We've officially launched our fundraiser! Thank you to everyone who has already contributed. We're overwhelmed by your support and excited to make this bootcamp a reality.",
      media: [
        {
          id: "update-3-media-1",
          type: "video" as const,
          url: "https://example.com/launch-video.mp4", // This would be a real video URL in production
          thumbnail: "/placeholder.svg?height=800&width=1200",
          alt: "Fundraiser launch event",
        },
      ],
    },
    {
      id: "4",
      date: "September 10, 2025",
      title: "Venue Secured",
      content:
        "We're thrilled to announce that we've secured a fantastic venue for our bootcamp. The space is equipped with modern facilities and is conveniently located for easy access by public transportation.",
      media: [
        {
          id: "update-4-media-1",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Bootcamp venue - exterior",
        },
        {
          id: "update-4-media-2",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Bootcamp venue - classroom",
        },
        {
          id: "update-4-media-3",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Bootcamp venue - collaboration space",
        },
        {
          id: "update-4-media-4",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Bootcamp venue - computer lab",
        },
        {
          id: "update-4-media-5",
          type: "image" as const,
          url: "/placeholder.svg?height=800&width=1200",
          alt: "Bootcamp venue - break area",
        },
      ],
    },
  ],
  recentDonors: [
    {
      id: "donor-1",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: 0.5,
      timestamp: "2 hours ago",
    },
    {
      id: "donor-2",
      address: "0x9876543210fedcba9876543210fedcba98765432",
      amount: 0.25,
      timestamp: "5 hours ago",
    },
    {
      id: "donor-3",
      address: "0x1122334455667788990011223344556677889900",
      amount: 1.0,
      timestamp: "1 day ago",
    },
    {
      id: "donor-4",
      address: "0xaabbccddeeff00112233445566778899aabbccdd",
      amount: 0.1,
      timestamp: "1 day ago",
    },
    {
      id: "donor-5",
      address: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst",
      amount: 0.75,
      timestamp: "2 days ago",
    },
  ],
  // Extended list of all supporters for the modal
  allSupporters: [
    {
      id: "donor-1",
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: 0.5,
      timestamp: "2023-05-20T14:30:00Z",
      displayName: "CryptoWhale",
    },
    {
      id: "donor-2",
      walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
      amount: 0.25,
      timestamp: "2023-05-20T11:15:00Z",
    },
    {
      id: "donor-3",
      walletAddress: "0x1122334455667788990011223344556677889900",
      amount: 1.0,
      timestamp: "2023-05-19T18:45:00Z",
      displayName: "BlockchainBuilder",
    },
    {
      id: "donor-4",
      walletAddress: "0xaabbccddeeff00112233445566778899aabbccdd",
      amount: 0.1,
      timestamp: "2023-05-19T16:20:00Z",
    },
    {
      id: "donor-5",
      walletAddress: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst",
      amount: 0.75,
      timestamp: "2023-05-18T09:10:00Z",
    },
    {
      id: "donor-6",
      walletAddress: "0x5678ijkl1234abcd9012efgh3456mnop7890qrst",
      amount: 0.3,
      timestamp: "2023-05-17T22:05:00Z",
      displayName: "SolanaSupporter",
    },
    {
      id: "donor-7",
      walletAddress: "0x90abcdef12345678efgh1234ijkl5678mnop9012",
      amount: 0.15,
      timestamp: "2023-05-17T14:30:00Z",
    },
    {
      id: "donor-8",
      walletAddress: "0x3456mnop7890qrst1234abcd5678efgh9012ijkl",
      amount: 2.0,
      timestamp: "2023-05-16T11:45:00Z",
      displayName: "CodeMentor",
    },
    {
      id: "donor-9",
      walletAddress: "0x7890qrst3456mnop1234abcd5678efgh9012ijkl",
      amount: 0.05,
      timestamp: "2023-05-16T08:20:00Z",
    },
    {
      id: "donor-10",
      walletAddress: "0xefgh9012ijkl3456mnop7890qrst1234abcd5678",
      amount: 0.4,
      timestamp: "2023-05-15T19:15:00Z",
    },
    {
      id: "donor-11",
      walletAddress: "0xijkl3456mnop7890qrst1234abcd5678efgh9012",
      amount: 0.6,
      timestamp: "2023-05-15T16:50:00Z",
      displayName: "TechAdvocate",
    },
    {
      id: "donor-12",
      walletAddress: "0xmnop7890qrst1234abcd5678efgh9012ijkl3456",
      amount: 0.2,
      timestamp: "2023-05-14T13:25:00Z",
    },
    {
      id: "donor-13",
      walletAddress: "0xqrst1234abcd5678efgh9012ijkl3456mnop7890",
      amount: 1.5,
      timestamp: "2023-05-14T10:10:00Z",
      displayName: "EducationFirst",
    },
    {
      id: "donor-14",
      walletAddress: "0x2345abcdef6789ghijkl0123mnopqr4567stuvwx",
      amount: 0.35,
      timestamp: "2023-05-13T21:40:00Z",
    },
    {
      id: "donor-15",
      walletAddress: "0x6789ghijkl0123mnopqr4567stuvwx2345abcdef",
      amount: 0.8,
      timestamp: "2023-05-13T17:15:00Z",
      displayName: "FutureBuilder",
    },
    {
      id: "donor-16",
      walletAddress: "0x0123mnopqr4567stuvwx2345abcdef6789ghijkl",
      amount: 0.45,
      timestamp: "2023-05-12T14:50:00Z",
    },
    {
      id: "donor-17",
      walletAddress: "0x4567stuvwx2345abcdef6789ghijkl0123mnopqr",
      amount: 0.55,
      timestamp: "2023-05-12T11:30:00Z",
    },
    {
      id: "donor-18",
      walletAddress: "0x8901stuvwx2345abcdef6789ghijkl0123mnopqr",
      amount: 0.7,
      timestamp: "2023-05-11T19:20:00Z",
      displayName: "AnonymousDonor",
    },
    {
      id: "donor-19",
      walletAddress: "0x2345abcdef6789ghijkl0123mnopqr4567stuvwx",
      amount: 0.9,
      timestamp: "2023-05-11T15:45:00Z",
    },
    {
      id: "donor-20",
      walletAddress: "0x6789ghijkl0123mnopqr4567stuvwx2345abcdef",
      amount: 1.2,
      timestamp: "2023-05-10T12:15:00Z",
      displayName: "CodingChampion",
    },
  ],
}

export function FundraiserDetail() {
  const params = useParams()
  const fundraiserId = params?.id as string

  // Add a console log to help with debugging
  console.log("Fundraiser ID:", fundraiserId)

  const [donationAmount, setDonationAmount] = useState("")
  const [stablecoin, setStablecoin] = useState("USDC")
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [showAllUpdates, setShowAllUpdates] = useState(false)
  const [isSupportersModalOpen, setIsSupportersModalOpen] = useState(false)

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Function to copy wallet address to clipboard
  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Function to handle donation
  const handleDonate = () => {
    // Implement donation logic here
    alert(`Donating ${donationAmount} ${stablecoin}`)
  }

  // Parse HTML content
  const createMarkup = (html: string) => {
    return { __html: html }
  }

  // Display limited updates or all updates
  const displayedUpdates = showAllUpdates ? fundraiser.updates : fundraiser.updates.slice(0, 2)

  return (
    <>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container py-6 md:py-10">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
              <Link href="/browse-fundraisers">
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
                  {fundraiser.category}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{fundraiser.title}</h1>
                <p className="text-muted-foreground">{fundraiser.tagline}</p>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Created by</span>
                  <span className="font-medium text-foreground">{fundraiser.creatorName}</span>
                  <span className="text-xs">({truncateAddress(fundraiser.creatorAddress)})</span>
                  <button
                    onClick={() => copyToClipboard(fundraiser.creatorAddress)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy address</span>
                  </button>
                  {copiedAddress && <span className="text-xs text-purple-500">Copied!</span>}
                </div>
              </div>

              {/* Enhanced Media Gallery */}
              <MediaGallery media={fundraiser.media} />

              {/* Tabs for Description and Updates */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="updates">Updates ({fundraiser.updates.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={createMarkup(fundraiser.description)}
                  ></div>
                </TabsContent>
                <TabsContent value="updates" className="pt-4 space-y-6">
                  {displayedUpdates.map((update) => (
                    <div key={update.id} className="space-y-2 pb-6 border-b border-border/50 last:border-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{update.title}</h3>
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-muted-foreground">{update.content}</p>

                      {/* Embedded Media in Updates */}
                      {update.media && update.media.length > 0 && <EmbeddedMedia media={update.media} />}
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
                      <span className="font-medium">{formatCurrency(fundraiser.currentAmount * 100)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Goal</span>
                      <span>{formatCurrency(fundraiser.goalAmount * 100)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${fundraiser.percentFunded}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{fundraiser.percentFunded}% Funded</span>
                      <span className="text-muted-foreground">
                        {fundraiser.currentAmount} SOL / {fundraiser.goalAmount} SOL
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/20">
                      <Users className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{fundraiser.donorsCount}</span>
                      <span className="text-xs text-muted-foreground">Supporters</span>
                      {/* View All Supporters Button - Subtle link below the supporters count */}
                      <button
                        onClick={() => setIsSupportersModalOpen(true)}
                        className="text-xs text-purple-500 hover:text-purple-400 mt-1 transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/20">
                      <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{fundraiser.daysLeft}</span>
                      <span className="text-xs text-muted-foreground">Days Left</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span>Ends {fundraiser.endDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Favorite</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Donation action block */}
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
                      <Select value={stablecoin} onValueChange={setStablecoin}>
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
                        <span className="font-medium">150.75 {stablecoin}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleDonate}
                      disabled={!donationAmount || Number.parseFloat(donationAmount) <= 0}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {donationAmount && Number.parseFloat(donationAmount) > 0
                        ? `Donate $${donationAmount} ${stablecoin}`
                        : "Enter an amount to donate"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Donations are processed on the Solana blockchain.
                    </p>
                  </div>
                </div>

                {/* Recent donors */}
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Recent Supporters</h3>
                    {/* View All Supporters Button - Alternative placement as text link */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSupportersModalOpen(true)}
                      className="text-xs text-purple-500 hover:text-purple-400 h-auto p-0"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {fundraiser.recentDonors.map((donor, index) => (
                      <div key={donor.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-muted/50"></div>
                          <span>{truncateAddress(donor.address)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium">{donor.amount} SOL</span>
                          <span className="text-xs text-muted-foreground">{donor.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* View All Supporters Button - Primary placement */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSupportersModalOpen(true)}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    View All Supporters
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Supporters Modal */}
      <SupportersModal
        isOpen={isSupportersModalOpen}
        onClose={() => setIsSupportersModalOpen(false)}
        fundraiserTitle={fundraiser.title}
        supporters={fundraiser.allSupporters}
      />
    </>
  )
}
