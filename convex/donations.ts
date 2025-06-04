import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record a donation (called after Solana transaction is confirmed)
export const recordDonation = mutation({
  args: {
    fundraiser_id: v.id("fundraisers"),
    donor_wallet_address: v.string(),
    amount: v.number(),
    transaction_signature: v.string(),
    donor_display_name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify donor exists
    const donor = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.donor_wallet_address))
      .first();

    if (!donor) {
      throw new Error("Donor must be authenticated");
    }

    // Verify fundraiser exists
    const fundraiser = await ctx.db.get(args.fundraiser_id);
    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Record the donation
    const donationId = await ctx.db.insert("donations", {
      fundraiser_id: args.fundraiser_id,
      donor_wallet_address: args.donor_wallet_address,
      amount: args.amount,
      transaction_signature: args.transaction_signature,
      donor_display_name: args.donor_display_name,
      created_at: Date.now(),
    });

    // Update fundraiser current amount
    await ctx.db.patch(args.fundraiser_id, {
      current_amount: fundraiser.current_amount + args.amount,
    });

    return donationId;
  },
});

// Get user's own donation history (PRIVACY: only their own)
export const getMyDonations = query({
  args: {
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.wallet_address))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's donations with fundraiser details
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_donor", (q) => q.eq("donor_wallet_address", args.wallet_address))
      .order("desc")
      .collect();

    // Enrich with fundraiser details
    const donationsWithDetails = await Promise.all(
      donations.map(async (donation) => {
        const fundraiser = await ctx.db.get(donation.fundraiser_id);
        return {
          ...donation,
          fundraiser_title: fundraiser?.title || "Unknown",
          fundraiser_owner: fundraiser?.owner_wallet_address,
        };
      })
    );

    return donationsWithDetails;
  },
});

// Get donations for a fundraiser (PUBLIC: but anonymized)
export const getFundraiserDonations = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
  },
  handler: async (ctx, args) => {
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_fundraiser", (q) => q.eq("fundraiser_id", args.fundraiser_id))
      .order("desc")
      .take(100); // Limit for performance

    // Return anonymized donation data for public view
    return donations.map((donation) => ({
      amount: donation.amount,
      created_at: donation.created_at,
      transaction_signature: donation.transaction_signature,
      // Use display name if provided, otherwise anonymize wallet address
      donor_display: donation.donor_display_name ||
        `${donation.donor_wallet_address.slice(0, 6)}...${donation.donor_wallet_address.slice(-4)}`,
      // For recent donors compatibility
      id: donation._id,
      address: donation.donor_wallet_address,
      timestamp: formatTimeAgo(donation.created_at),
    }));
  },
});

// Helper function to format time ago
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Get donation statistics for a fundraiser
export const getFundraiserStats = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);
    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_fundraiser", (q) => q.eq("fundraiser_id", args.fundraiser_id))
      .collect();

    const totalDonors = new Set(donations.map(d => d.donor_wallet_address)).size;
    const totalDonations = donations.length;

    return {
      total_raised: fundraiser.current_amount,
      target_amount: fundraiser.target_amount,
      percentage_complete: (fundraiser.current_amount / fundraiser.target_amount) * 100,
      total_donors: totalDonors,
      total_donations: totalDonations,
      average_donation: totalDonations > 0 ? fundraiser.current_amount / totalDonations : 0,
    };
  },
});

// Get recent supporters for a fundraiser (for the sidebar)
export const getRecentSupporters = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_fundraiser", (q) => q.eq("fundraiser_id", args.fundraiser_id))
      .order("desc")
      .take(limit);

    return donations.map((donation) => ({
      id: donation._id,
      address: donation.donor_wallet_address,
      amount: donation.amount,
      timestamp: formatTimeAgo(donation.created_at),
      display_name: donation.donor_display_name,
    }));
  },
});

// Get all supporters for a fundraiser (for the modal)
export const getAllSupporters = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
  },
  handler: async (ctx, args) => {
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_fundraiser", (q) => q.eq("fundraiser_id", args.fundraiser_id))
      .order("desc")
      .collect();

    return donations.map((donation) => ({
      id: donation._id,
      walletAddress: donation.donor_wallet_address,
      amount: donation.amount,
      timestamp: new Date(donation.created_at).toISOString(),
      displayName: donation.donor_display_name,
    }));
  },
});

// Check if user has donated to a specific fundraiser
export const hasUserDonated = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_fundraiser", (q) => q.eq("fundraiser_id", args.fundraiser_id))
      .filter((q) => q.eq(q.field("donor_wallet_address"), args.wallet_address))
      .first();

    return !!donation;
  },
});

// Get leaderboard data - top donors by total amount donated
export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    // Get all donations
    const allDonations = await ctx.db
      .query("donations")
      .collect();

    // Group donations by donor wallet address and calculate totals
    const donorTotals = new Map<string, { totalDonated: number; donationCount: number; lastDonation: number }>();

    for (const donation of allDonations) {
      const existing = donorTotals.get(donation.donor_wallet_address);
      if (existing) {
        existing.totalDonated += donation.amount;
        existing.donationCount += 1;
        existing.lastDonation = Math.max(existing.lastDonation, donation.created_at);
      } else {
        donorTotals.set(donation.donor_wallet_address, {
          totalDonated: donation.amount,
          donationCount: 1,
          lastDonation: donation.created_at,
        });
      }
    }

    // Convert to array and sort by total donated (descending)
    const sortedDonors = Array.from(donorTotals.entries())
      .map(([walletAddress, data]) => ({
        walletAddress,
        totalDonated: data.totalDonated,
        donationCount: data.donationCount,
        lastDonation: data.lastDonation,
      }))
      .sort((a, b) => b.totalDonated - a.totalDonated)
      .slice(0, limit);

    // Enrich with user display names
    const leaderboardData = await Promise.all(
      sortedDonors.map(async (donor, index) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_wallet_address", (q) => q.eq("wallet_address", donor.walletAddress))
          .first();

        const rank = index + 1;
        return {
          ...donor,
          rank,
          displayName: user?.display_name || null,
          id: `${donor.walletAddress}-${rank}`, // Create a unique ID for the component
        };
      })
    );

    return leaderboardData;
  },
});

// Get user's position in leaderboard
export const getUserLeaderboardPosition = query({
  args: {
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all donations
    const allDonations = await ctx.db
      .query("donations")
      .collect();

    // Group donations by donor wallet address and calculate totals
    const donorTotals = new Map<string, number>();

    for (const donation of allDonations) {
      const existing = donorTotals.get(donation.donor_wallet_address) || 0;
      donorTotals.set(donation.donor_wallet_address, existing + donation.amount);
    }

    // Convert to array and sort by total donated (descending)
    const sortedDonors = Array.from(donorTotals.entries())
      .sort((a, b) => b[1] - a[1]);

    // Find user's position
    const userPosition = sortedDonors.findIndex(([walletAddress]) => walletAddress === args.wallet_address);

    if (userPosition === -1) {
      return null; // User hasn't donated yet
    }

    const userTotal = donorTotals.get(args.wallet_address) || 0;

    // Get user's display name
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.wallet_address))
      .first();

    return {
      rank: userPosition + 1,
      totalDonated: userTotal,
      walletAddress: args.wallet_address,
      displayName: user?.display_name || null,
      id: `${args.wallet_address}-${userPosition + 1}`,
    };
  },
}); 