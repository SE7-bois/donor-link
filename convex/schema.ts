import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    wallet_address: v.string(),
    nonce: v.string(),
    last_nonce_updated_at: v.string(),
    created_at: v.number(),
    last_login_at: v.number(),
    is_active: v.boolean(),
  }).index("by_wallet_address", ["wallet_address"]),

  // Example: User-specific data that needs authorization
  fundraisers: defineTable({
    title: v.string(),
    description: v.string(),
    owner_wallet_address: v.string(), // Links to users.wallet_address
    target_amount: v.number(),
    current_amount: v.number(),
    created_at: v.number(),
    is_active: v.boolean(),
  }).index("by_owner", ["owner_wallet_address"]),

  donations: defineTable({
    fundraiser_id: v.id("fundraisers"),
    donor_wallet_address: v.string(), // Links to users.wallet_address
    amount: v.number(),
    transaction_signature: v.string(),
    created_at: v.number(),
  }).index("by_donor", ["donor_wallet_address"])
    .index("by_fundraiser", ["fundraiser_id"]),
})

export default schema;