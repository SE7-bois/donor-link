"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useWallet } from "@solana/wallet-adapter-react";

type Category =
  | "Education"
  | "Health & Medical"
  | "Environment"
  | "Community Projects"
  | "Arts & Creative"
  | "Technology & Open Source"
  | "Emergency Relief"
  | "Others";

const categories: Category[] = [
  "Education",
  "Health & Medical",
  "Environment",
  "Community Projects",
  "Arts & Creative",
  "Technology & Open Source",
  "Emergency Relief",
  "Others",
];

export function BrowseFundraisersConvex() {
  const fundraisers = useQuery(api.fundraisers.getPublicFundraisers);
  const { publicKey } = useWallet();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the primary category from the fundraiser's category array
  const getPrimaryCategory = (categories: string[]): Category => {
    if (categories.length === 0) return 'Others';
    // Return the first category as the primary one
    return categories[0] as Category;
  };

  if (!fundraisers) {
    return (
      <div className="container py-6 md:py-10 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Browse Fundraisers</h1>
          <p className="text-muted-foreground">Loading fundraisers...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-card p-5">
              <div className="space-y-3">
                <div className="h-40 rounded-md bg-muted/30 animate-pulse"></div>
                <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
                <div className="h-6 bg-muted/30 rounded animate-pulse"></div>
                <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const primaryCategory = getPrimaryCategory(fundraiser.category);
    const matchesCategory = selectedCategory ? fundraiser.category.includes(selectedCategory) : true;
    const matchesSearch =
      fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundraiser.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
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
            {`We couldn't find any fundraisers matching your criteria. Try adjusting your filters or search terms.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFundraisers.map((fundraiser) => {
            const primaryCategory = getPrimaryCategory(fundraiser.category);
            const percentFunded = (fundraiser.current_amount / fundraiser.target_amount) * 100;
            const userWalletAddress = publicKey?.toBase58();
            const isOwner = userWalletAddress && userWalletAddress === fundraiser.owner_wallet_address;

            return (
              <Link
                key={fundraiser._id}
                href={`/fundraisers/${fundraiser._id}`}
                className="block group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm"
              >
                <div className="space-y-3">
                  {/* Media Preview */}
                  {fundraiser.media && fundraiser.media.length > 0 ? (
                    <div className="relative h-40 rounded-md overflow-hidden bg-muted/30">
                      {fundraiser.media[0]?.type === "image" ? (
                        <img
                          src={fundraiser.media[0]?.url}
                          alt={fundraiser.media[0]?.alt || fundraiser.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={fundraiser.media[0]?.thumbnail || fundraiser.media[0]?.url}
                            alt={fundraiser.media[0]?.alt || fundraiser.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              // Fallback to placeholder if thumbnail fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          {/* Video play icon overlay */}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="bg-black/60 rounded-full p-2">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Fallback placeholder (hidden by default, shown on error) */}
                      <div
                        className="absolute inset-0 bg-muted/30 flex items-center justify-center text-muted-foreground"
                        style={{ display: "none" }}
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21,15 16,10 5,21" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 rounded-md bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                    </div>
                  )}
                  <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 hover:text-purple-500">
                    {primaryCategory}
                  </Badge>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">{fundraiser.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {fundraiser.tagline || fundraiser.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${Math.min(percentFunded, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{percentFunded.toFixed(0)}% Funded</span>
                      <span className="text-muted-foreground">
                        ${fundraiser.current_amount.toLocaleString()} / ${fundraiser.target_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      {isOwner ? (
                        <Button size="sm" disabled className="bg-muted text-muted-foreground cursor-not-allowed">
                          Your Project
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          Donate
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {Math.max(0, Math.ceil((Date.now() - fundraiser.created_at) / (1000 * 60 * 60 * 24)))} days ago
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  )
} 