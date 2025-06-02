import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Record a donation (called after Solana transaction is confirmed)
export const recordDonation = mutation({
  args: {
    fundraiser_id: v.id("fundraisers"),
    donor_wallet_address: v.string(),
    amount: v.number(),
    transaction_signature: v.string(),
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
      // DON'T return donor_wallet_address for privacy
      donor_anonymized: `${donation.donor_wallet_address.slice(0, 6)}...${donation.donor_wallet_address.slice(-4)}`,
    }));
  },
});

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