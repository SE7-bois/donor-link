"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Badge } from "~/components/ui/badge"
import { cn } from "~/lib/utils"
import Link from "next/link"

// Category types
type FundraiserCategory =
  | "Education"
  | "Health & Medical"
  | "Environment"
  | "Community Projects"
  | "Arts & Creative"
  | "Technology & Open Source"
  | "Emergency Relief"
  | "Others"

// Fundraiser interface
interface Fundraiser {
  id: number
  title: string
  description: string
  category: FundraiserCategory
  currentAmount: number
  goalAmount: number
  percentFunded: number
  daysLeft: number
}

// Dummy fundraiser data
const fundraisers: Fundraiser[] = [
  {
    id: 1,
    title: "Coding Bootcamp for Underprivileged Youth",
    description:
      "Help provide coding education to underprivileged youth in urban areas, opening doors to tech careers.",
    category: "Education",
    currentAmount: 3.2,
    goalAmount: 5,
    percentFunded: 64,
    daysLeft: 12,
  },
  {
    id: 2,
    title: "Renewable Energy for Rural Schools",
    description: "Installing solar panels in rural schools to provide sustainable electricity for education.",
    category: "Environment",
    currentAmount: 8.5,
    goalAmount: 10,
    percentFunded: 85,
    daysLeft: 8,
  },
  {
    id: 3,
    title: "Community Garden Initiative",
    description: "Creating urban gardens to provide fresh produce and green spaces in underserved neighborhoods.",
    category: "Community Projects",
    currentAmount: 2.1,
    goalAmount: 4,
    percentFunded: 52,
    daysLeft: 15,
  },
  {
    id: 4,
    title: "Emergency Medical Supplies for Clinic",
    description: "Providing essential medical supplies to a clinic serving low-income communities.",
    category: "Health & Medical",
    currentAmount: 6.8,
    goalAmount: 7.5,
    percentFunded: 91,
    daysLeft: 5,
  },
  {
    id: 5,
    title: "Open Source Blockchain Development Tools",
    description: "Building developer tools to make blockchain development more accessible to everyone.",
    category: "Technology & Open Source",
    currentAmount: 4.2,
    goalAmount: 12,
    percentFunded: 35,
    daysLeft: 21,
  },
  {
    id: 6,
    title: "Local Theater Renovation Project",
    description: "Renovating a historic community theater to preserve arts and culture in our town.",
    category: "Arts & Creative",
    currentAmount: 5.3,
    goalAmount: 15,
    percentFunded: 35,
    daysLeft: 30,
  },
  {
    id: 7,
    title: "Disaster Relief for Flood Victims",
    description: "Providing immediate assistance to families affected by recent flooding in coastal areas.",
    category: "Emergency Relief",
    currentAmount: 9.8,
    goalAmount: 10,
    percentFunded: 98,
    daysLeft: 2,
  },
  {
    id: 8,
    title: "Mental Health Support Program",
    description: "Creating accessible mental health resources and support groups in underserved communities.",
    category: "Health & Medical",
    currentAmount: 3.5,
    goalAmount: 8,
    percentFunded: 44,
    daysLeft: 18,
  },
  {
    id: 9,
    title: "Wildlife Conservation Initiative",
    description: "Protecting endangered species through habitat preservation and anti-poaching efforts.",
    category: "Environment",
    currentAmount: 7.2,
    goalAmount: 12,
    percentFunded: 60,
    daysLeft: 14,
  },
  {
    id: 10,
    title: "Scholarship Fund for First-Generation Students",
    description: "Helping first-generation college students achieve their educational dreams.",
    category: "Education",
    currentAmount: 6.5,
    goalAmount: 20,
    percentFunded: 32,
    daysLeft: 45,
  },
  {
    id: 11,
    title: "Decentralized Identity Research",
    description: "Researching and developing privacy-preserving decentralized identity solutions on Solana.",
    category: "Technology & Open Source",
    currentAmount: 12.3,
    goalAmount: 25,
    percentFunded: 49,
    daysLeft: 28,
  },
  {
    id: 12,
    title: "Community Food Bank Expansion",
    description: "Expanding our local food bank to serve more families facing food insecurity.",
    category: "Others",
    currentAmount: 4.8,
    goalAmount: 7,
    percentFunded: 69,
    daysLeft: 10,
  },
]

// Available categories for filtering
const categories: FundraiserCategory[] = [
  "Education",
  "Health & Medical",
  "Environment",
  "Community Projects",
  "Arts & Creative",
  "Technology & Open Source",
  "Emergency Relief",
  "Others",
]

export function BrowseFundraisers() {
  const [selectedCategory, setSelectedCategory] = useState<FundraiserCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter fundraisers based on selected category and search query
  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const matchesCategory = selectedCategory ? fundraiser.category === selectedCategory : true
    const matchesSearch =
      fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundraiser.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <ScrollArea className="h-[calc(100vh-3.5rem)]">
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Browse Fundraisers</h1>
          <p className="text-muted-foreground">Discover and support innovative projects on Solana</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fundraisers..."
              className="pl-9 bg-background border-border/50 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-purple-500/10 transition-colors py-1.5 px-3",
                  selectedCategory === category && "bg-purple-500 text-white hover:bg-purple-600 hover:text-white",
                )}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </Badge>
            ))}
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-2 ml-1"
                onClick={() => setSelectedCategory(null)}
              >
                Clear filter
              </Button>
            )}
          </div>
        </div>

        {filteredFundraisers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted/30 p-6 mb-4">
              <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-medium">No fundraisers found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              We couldn't find any fundraisers matching your criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFundraisers.map((fundraiser) => (
              <Link
                key={fundraiser.id}
                href={`/fundraiser/${fundraiser.id}`}
                className="block group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="h-40 rounded-md bg-muted/30"></div>
                  <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 hover:text-purple-500">
                    {fundraiser.category}
                  </Badge>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">{fundraiser.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{fundraiser.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${fundraiser.percentFunded}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{fundraiser.percentFunded}% Funded</span>
                      <span className="text-muted-foreground">
                        {fundraiser.currentAmount} SOL / {fundraiser.goalAmount} SOL
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Donate
                      </Button>
                      <span className="text-xs text-muted-foreground">{fundraiser.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
