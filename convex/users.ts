import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update user when they authenticate
export const createOrUpdateUser = mutation({
  args: {
    wallet_address: v.string(),
    nonce: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.wallet_address))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user's login time and nonce
      await ctx.db.patch(existingUser._id, {
        last_login_at: now,
        nonce: args.nonce,
        last_nonce_updated_at: new Date().toISOString(),
      });
      return existingUser._id;
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        wallet_address: args.wallet_address,
        nonce: args.nonce,
        last_nonce_updated_at: new Date().toISOString(),
        created_at: now,
        last_login_at: now,
        is_active: true,
      });
    }
  },
});

// Get user by wallet address
export const getUserByWallet = query({
  args: {
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.wallet_address))
      .first();
  },
});

// Helper function to verify user ownership (for use in other functions)
export const verifyUserOwnership = query({
  args: {
    wallet_address: v.string(),
    resource_owner_address: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the requesting user is the same as the resource owner
    return args.wallet_address === args.resource_owner_address;
  },
});

// Get user's own profile (authorized)
export const getMyProfile = query({
  args: {
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.wallet_address))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return {
      wallet_address: user.wallet_address,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      // Don't return sensitive fields like nonce
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    wallet_address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet_address", (q) => q.eq("wallet_address", args.wallet_address))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // For now, just return success since there are no fields to update
    // You can add other profile fields later if needed
    return "Profile updated successfully";
  },
}); 