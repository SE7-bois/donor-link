import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new fundraiser (user must be authenticated)
export const createFundraiser = mutation({
  args: {
    owner_wallet_address: v.string(),
    title: v.string(),
    description: v.string(),
    tagline: v.optional(v.string()),
    category: v.array(v.union(v.literal("Education"), v.literal("Health & Medical"), v.literal("Environment"), v.literal("Community Projects"), v.literal("Arts & Creative"), v.literal("Technology & Open Source"), v.literal("Emergency Relief"), v.literal("Others"))),
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

    // Validate fundraiser goal amount (max $1M USD)
    const MAX_FUNDRAISER_GOAL = 1000000; // $1 Million USD
    if (args.target_amount > MAX_FUNDRAISER_GOAL) {
      throw new Error(`Fundraiser goal cannot exceed $${MAX_FUNDRAISER_GOAL.toLocaleString()} USD`);
    }

    if (args.target_amount <= 0) {
      throw new Error("Fundraiser goal must be greater than $0");
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
      updates: [],
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
    category: v.array(v.union(v.literal("Education"), v.literal("Health & Medical"), v.literal("Environment"), v.literal("Community Projects"), v.literal("Arts & Creative"), v.literal("Technology & Open Source"), v.literal("Emergency Relief"), v.literal("Others"))),
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
    category: v.optional(v.array(v.union(v.literal("Education"), v.literal("Health & Medical"), v.literal("Environment"), v.literal("Community Projects"), v.literal("Arts & Creative"), v.literal("Technology & Open Source"), v.literal("Emergency Relief"), v.literal("Others")))),
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

    // Validate target amount if being updated (max $1M USD)
    if (args.target_amount !== undefined) {
      const MAX_FUNDRAISER_GOAL = 1000000; // $1 Million USD
      if (args.target_amount > MAX_FUNDRAISER_GOAL) {
        throw new Error(`Fundraiser goal cannot exceed $${MAX_FUNDRAISER_GOAL.toLocaleString()} USD`);
      }

      if (args.target_amount <= 0) {
        throw new Error("Fundraiser goal must be greater than $0");
      }
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

// Get single fundraiser details (returns pure schema object)
export const getFundraiser = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);

    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Return the pure database object matching the schema
    return fundraiser;
  },
});

// Get single fundraiser with computed UI fields (for components that need extra data)
export const getFundraiserWithStats = query({
  args: {
    fundraiser_id: v.id("fundraisers"),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);

    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Calculate additional fields for UI compatibility
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

    // Return fundraiser with computed fields for UI
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
    };
  },
});

// Generate upload URL for media files
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Store uploaded file metadata
export const storeFileMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    type: v.union(v.literal("image"), v.literal("video")),
    alt: v.string(),
    thumbnail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);

    return {
      id: args.storageId,
      type: args.type,
      url: url ? url : "",
      alt: args.alt,
      thumbnail: args.thumbnail,
    };
  },
});

// Delete fundraiser (only owner can delete)
export const deleteFundraiser = mutation({
  args: {
    fundraiser_id: v.id("fundraisers"),
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    const fundraiser = await ctx.db.get(args.fundraiser_id);

    if (!fundraiser) {
      throw new Error("Fundraiser not found");
    }

    // Authorization check: only owner can delete
    if (fundraiser.owner_wallet_address !== args.wallet_address) {
      throw new Error("Not authorized to delete this fundraiser");
    }

    // Check if fundraiser has any donations
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_fundraiser", (q) => q.eq("fundraiser_id", args.fundraiser_id))
      .collect();

    if (donations.length > 0) {
      throw new Error("Cannot delete fundraiser with existing donations. Please deactivate it instead.");
    }

    // Delete the fundraiser
    await ctx.db.delete(args.fundraiser_id);

    return "Fundraiser deleted successfully";
  },
}); 