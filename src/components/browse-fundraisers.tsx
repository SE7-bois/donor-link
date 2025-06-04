"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { categories, type FundraiserCategory, type Fundraiser } from "~/data/fundraisers";

export function BrowseFundraisers({ fundraisers }: { fundraisers: Fundraiser[] }) {
  const [selectedCategory, setSelectedCategory] = useState<FundraiserCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const matchesCategory = selectedCategory ? fundraiser.category?.includes(selectedCategory) : true;
    const matchesSearch =
      fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundraiser.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          {filteredFundraisers.map((fundraiser) => (
            <Link
              key={fundraiser._id}
              href={`/fundraisers/${fundraiser._id}`}
              className="block group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="h-40 rounded-md bg-muted/30"></div>
                <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 hover:text-purple-500">
                  {fundraiser.category?.join(", ")}
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
                      {fundraiser.currentAmount || fundraiser.current_amount} SOL / {fundraiser.goalAmount || fundraiser.target_amount} SOL
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
  )
}
