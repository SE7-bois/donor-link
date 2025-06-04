import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  users: defineTable({
    wallet_address: v.string(),
    nonce: v.string(),
    last_nonce_updated_at: v.string(),
    created_at: v.number(),
    last_login_at: v.number(),
    is_active: v.boolean(),
    // Profile fields
    display_name: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    twitter: v.optional(v.string()),
    profile_image: v.optional(v.string()),
  }).index("by_wallet_address", ["wallet_address"]),

  // Enhanced fundraisers table to match dummy data structure
  fundraisers: defineTable({
    title: v.string(),
    description: v.string(), // This will support markdown content
    tagline: v.optional(v.string()),
    category: v.array(v.union(
      v.literal("Education"),
      v.literal("Health & Medical"),
      v.literal("Environment"),
      v.literal("Community Projects"),
      v.literal("Arts & Creative"),
      v.literal("Technology & Open Source"),
      v.literal("Emergency Relief"),
      v.literal("Others"))),
    owner_wallet_address: v.string(), // Links to users.wallet_address
    creator_name: v.optional(v.string()), // Display name for creator
    target_amount: v.number(),
    current_amount: v.number(),
    created_at: v.number(),
    is_active: v.boolean(),
    end_date: v.optional(v.number()), // When the fundraiser ends
    // Media gallery for the fundraiser
    media: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.string(),
      thumbnail: v.optional(v.string()), // For videos
    }))),
    // Updates array for fundraiser progress
    updates: v.optional(v.array(v.object({
      id: v.string(),
      date: v.string(),
      title: v.string(),
      content: v.string(), // This will support markdown content
      media: v.optional(v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("image"), v.literal("video")),
        url: v.string(),
        alt: v.string(),
        thumbnail: v.optional(v.string()),
      }))),
    }))),
  }).index("by_owner", ["owner_wallet_address"])
    .index("by_category", ["category"])
    .index("by_active", ["is_active"]),

  donations: defineTable({
    fundraiser_id: v.id("fundraisers"),
    donor_wallet_address: v.string(), // Links to users.wallet_address
    amount: v.number(),
    transaction_signature: v.string(),
    created_at: v.number(),
    // Optional display name for the donor (for public display)
    donor_display_name: v.optional(v.string()),
  }).index("by_donor", ["donor_wallet_address"])
    .index("by_fundraiser", ["fundraiser_id"])
    .index("by_created_at", ["created_at"]),
})

export default schema;