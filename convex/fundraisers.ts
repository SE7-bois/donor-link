import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new fundraiser (user must be authenticated)
export const createFundraiser = mutation({
  args: {
    owner_wallet_address: v.string(),
    title: v.string(),
    description: v.string(),
    tagline: v.optional(v.string()),
    category: v.string(),
    creator_name: v.optional(v.string()),
    target_amount: v.number(),
    end_date: v.optional(v.number()),
    media: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.string(),
      thumbnail: v.optional(v.string()),
    }))),
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
      tagline: args.tagline,
      category: args.category,
      owner_wallet_address: args.owner_wallet_address,
      creator_name: args.creator_name,
      target_amount: args.target_amount,
      current_amount: 0,
      created_at: Date.now(),
      is_active: true,
      end_date: args.end_date,
      media: args.media,
      updates: [], // Initialize with empty updates array
    });
  },
});

// Add update to fundraiser
export const addFundraiserUpdate = mutation({
  args: {
    fundraiser_id: v.id("fundraisers"),
    wallet_address: v.string(),
    title: v.string(),
    content: v.string(),
    media: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.string(),
      thumbnail: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);

    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Authorization check: only owner can add updates
    if (fundraiser.owner_wallet_address !== args.wallet_address) {
      throw new Error("Not authorized to update this fundraiser");
    }

    const newUpdate = {
      id: `update-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      title: args.title,
      content: args.content,
      media: args.media,
    };

    const currentUpdates = fundraiser.updates || [];
    await ctx.db.patch(args.fundraiser_id, {
      updates: [newUpdate, ...currentUpdates], // Add new update to the beginning
    });

    return "Update added successfully";
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

// Get fundraisers by category
export const getFundraisersByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fundraisers")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("desc")
      .take(50);
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
    tagline: v.optional(v.string()),
    category: v.optional(v.string()),
    creator_name: v.optional(v.string()),
    target_amount: v.optional(v.number()),
    end_date: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
    media: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.string(),
      thumbnail: v.optional(v.string()),
    }))),
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
    if (args.tagline !== undefined) updateData.tagline = args.tagline;
    if (args.category !== undefined) updateData.category = args.category;
    if (args.creator_name !== undefined) updateData.creator_name = args.creator_name;
    if (args.target_amount !== undefined) updateData.target_amount = args.target_amount;
    if (args.end_date !== undefined) updateData.end_date = args.end_date;
    if (args.is_active !== undefined) updateData.is_active = args.is_active;
    if (args.media !== undefined) updateData.media = args.media;

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

    // Calculate additional fields for compatibility with the UI
    const percentFunded = fundraiser.target_amount > 0
      ? Math.round((fundraiser.current_amount / fundraiser.target_amount) * 100)
      : 0;

    // Calculate days left if end_date is set
    let daysLeft = null;
    if (fundraiser.end_date) {
      const now = Date.now();
      const timeDiff = fundraiser.end_date - now;
      daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    }

    // Format end date
    let endDate = null;
    if (fundraiser.end_date) {
      endDate = new Date(fundraiser.end_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Return fundraiser with computed fields and ownership info
    return {
      ...fundraiser,
      // Add computed fields for UI compatibility
      percentFunded,
      daysLeft,
      endDate,
      // Add aliases for UI compatibility
      currentAmount: fundraiser.current_amount,
      goalAmount: fundraiser.target_amount,
      creatorName: fundraiser.creator_name || "Anonymous",
      creatorAddress: fundraiser.owner_wallet_address,
      donorsCount: 0, // Will be calculated from donations
      is_owner: args.viewer_wallet_address === fundraiser.owner_wallet_address,
    };
  },
}); 