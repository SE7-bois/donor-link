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

type Category =
  | "Education"
  | "Healthcare"
  | "Environment"
  | "Community"
  | "Animal Welfare"
  | "Sports & Recreation"
  | "Arts & Creative"
  | "Technology"
  | "Emergency Relief";

const categories: Category[] = [
  "Education",
  "Healthcare",
  "Environment",
  "Community",
  "Animal Welfare",
  "Sports & Recreation",
  "Arts & Creative",
  "Technology",
  "Emergency Relief",
];

export function BrowseFundraisersConvex() {
  const fundraisers = useQuery(api.fundraisers.getPublicFundraisers);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Category mapping function
  const getCategoryFromTitle = (title: string): Category => {
    if (title.toLowerCase().includes('garden') || title.toLowerCase().includes('environment')) return 'Environment';
    if (title.toLowerCase().includes('medical') || title.toLowerCase().includes('health')) return 'Healthcare';
    if (title.toLowerCase().includes('school') || title.toLowerCase().includes('technology') || title.toLowerCase().includes('education')) return 'Education';
    if (title.toLowerCase().includes('animal') || title.toLowerCase().includes('shelter')) return 'Animal Welfare';
    if (title.toLowerCase().includes('sports') || title.toLowerCase().includes('youth')) return 'Sports & Recreation';
    if (title.toLowerCase().includes('arts') || title.toLowerCase().includes('theater')) return 'Arts & Creative';
    if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('blockchain')) return 'Technology';
    if (title.toLowerCase().includes('emergency') || title.toLowerCase().includes('relief')) return 'Emergency Relief';
    return 'Community';
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
    const category = getCategoryFromTitle(fundraiser.title);
    const matchesCategory = selectedCategory ? category === selectedCategory : true;
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
            const category = getCategoryFromTitle(fundraiser.title);
            const percentFunded = (fundraiser.current_amount / fundraiser.target_amount) * 100;

            return (
              <Link
                key={fundraiser._id}
                href={`/fundraisers/${fundraiser._id}`}
                className="block group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="h-40 rounded-md bg-muted/30"></div>
                  <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 hover:text-purple-500">
                    {category}
                  </Badge>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">{fundraiser.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{fundraiser.description}</p>
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
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Donate
                      </Button>
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