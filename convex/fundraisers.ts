import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new fundraiser (user must be authenticated)
export const createFundraiser = mutation({
  args: {
    owner_wallet_address: v.string(),
    title: v.string(),
    description: v.string(),
    target_amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.owner_wallet_address))
      .first();

    if (!user) {
      throw new Error("User must be authenticated to create fundraiser");
    }

    return await ctx.db.insert("fundraisers", {
      title: args.title,
      description: args.description,
      owner_wallet_address: args.owner_wallet_address,
      target_amount: args.target_amount,
      current_amount: 0,
      created_at: Date.now(),
      is_active: true,
    });
  },
});

// Get all public fundraisers (anyone can see these)
export const getPublicFundraisers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("fundraisers")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("desc")
      .take(50); // Limit to prevent huge responses
  },
});

// Get user's own fundraisers (authorization required)
export const getMyFundraisers = query({
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

    return await ctx.db
      .query("fundraisers")
      .withIndex("by_owner", (q) => q.eq("owner_wallet_address", args.wallet_address))
      .order("desc")
      .collect();
  },
});

// Update fundraiser (only owner can update)
export const updateFundraiser = mutation({
  args: {
    fundraiser_id: v.id("fundraisers"),
    wallet_address: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);

    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Authorization check: only owner can update
    if (fundraiser.owner_wallet_address !== args.wallet_address) {
      throw new Error("Not authorized to update this fundraiser");
    }

    const updateData: any = {};
    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined) updateData.description = args.description;
    if (args.is_active !== undefined) updateData.is_active = args.is_active;

    await ctx.db.patch(args.fundraiser_id, updateData);
    return "Fundraiser updated successfully";
  },
});

// Get single fundraiser details (public, but with authorization hints)
export const getFundraiser = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
    viewer_wallet_address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);

    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Return fundraiser with ownership info
    return {
      ...fundraiser,
      is_owner: args.viewer_wallet_address === fundraiser.owner_wallet_address,
    };
  },
}); 