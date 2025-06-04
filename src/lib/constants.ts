// Platform-wide financial limits
export const FINANCIAL_LIMITS = {
  // Maximum fundraiser goal amount in USD
  MAX_FUNDRAISER_GOAL: 1000000,

  // Maximum single donation amount in USD
  MAX_DONATION_AMOUNT: 1000000,

  // Minimum donation amount in USD
  MIN_DONATION_AMOUNT: 0.01,

  // Minimum fundraiser goal in USD
  MIN_FUNDRAISER_GOAL: 1,
} as const;

// Human-readable versions for UI display
export const FINANCIAL_LIMITS_DISPLAY = {
  MAX_FUNDRAISER_GOAL_FORMATTED: "$1,000,000",
  MAX_DONATION_AMOUNT_FORMATTED: "$1,000,000",
} as const; 