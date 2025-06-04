export type FundraiserCategory =
  | "Education"
  | "Health & Medical"
  | "Environment"
  | "Community Projects"
  | "Arts & Creative"
  | "Technology & Open Source"
  | "Emergency Relief"
  | "Others";

// Updated Fundraiser type to match Convex schema
export type Fundraiser = {
  _id: string;
  title: string;
  description: string;
  tagline?: string;
  category?: FundraiserCategory[];
  owner_wallet_address: string;
  creator_name?: string;
  target_amount: number;
  current_amount: number;
  created_at: number;
  is_active: boolean;
  end_date?: number;
  media?: Array<{
    id: string;
    type: "image" | "video";
    url: string;
    alt: string;
    thumbnail?: string;
  }>;
  updates?: Array<{
    id: string;
    date: string;
    title: string;
    content: string;
    media?: Array<{
      id: string;
      type: "image" | "video";
      url: string;
      alt: string;
      thumbnail?: string;
    }>;
  }>;
  // Computed fields for UI compatibility (these are calculated in the query)
  percentFunded?: number;
  daysLeft?: number;
  endDate?: string;
  currentAmount?: number; // Alias for current_amount
  goalAmount?: number; // Alias for target_amount
  creatorName?: string; // Alias for creator_name
  creatorAddress?: string; // Alias for owner_wallet_address
  donorsCount?: number;
  is_owner?: boolean;
}

export const fundraisers: Fundraiser[] = [
  {
    _id: "1",
    title: "Coding Bootcamp for Underprivileged Youth",
    description:
      "Help provide coding education to underprivileged youth in urban areas, opening doors to tech careers.",
    category: ["Education"],
    owner_wallet_address: "DemoAddress1",
    creator_name: "Education Foundation",
    target_amount: 5000,
    current_amount: 3200,
    created_at: Date.now() - 12 * 24 * 60 * 60 * 1000, // 12 days ago
    is_active: true,
    end_date: Date.now() + 12 * 24 * 60 * 60 * 1000, // 12 days from now
    percentFunded: 64,
    daysLeft: 12,
    currentAmount: 3200,
    goalAmount: 5000,
  },
  {
    _id: "2",
    title: "Renewable Energy for Rural Schools",
    description: "Installing solar panels in rural schools to provide sustainable electricity for education.",
    category: ["Environment"],
    owner_wallet_address: "DemoAddress2",
    creator_name: "Green Energy Initiative",
    target_amount: 10000,
    current_amount: 8500,
    created_at: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    is_active: true,
    end_date: Date.now() + 8 * 24 * 60 * 60 * 1000, // 8 days from now
    percentFunded: 85,
    daysLeft: 8,
    currentAmount: 8500,
    goalAmount: 10000,
  },
  {
    _id: "3",
    title: "Community Garden Initiative",
    description: "Creating urban gardens to provide fresh produce and green spaces in underserved neighborhoods.",
    category: ["Community Projects"],
    owner_wallet_address: "DemoAddress3",
    creator_name: "Urban Gardens Collective",
    target_amount: 4000,
    current_amount: 2100,
    created_at: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    is_active: true,
    end_date: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
    percentFunded: 52,
    daysLeft: 15,
    currentAmount: 2100,
    goalAmount: 4000,
  },
  {
    _id: "4",
    title: "Emergency Medical Supplies for Clinic",
    description: "Providing essential medical supplies to a clinic serving low-income communities.",
    category: ["Health & Medical"],
    owner_wallet_address: "DemoAddress4",
    creator_name: "Community Health Center",
    target_amount: 7500,
    current_amount: 6800,
    created_at: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    is_active: true,
    end_date: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
    percentFunded: 91,
    daysLeft: 5,
    currentAmount: 6800,
    goalAmount: 7500,
  },
  {
    _id: "5",
    title: "Open Source Blockchain Development Tools",
    description: "Building developer tools to make blockchain development more accessible to everyone.",
    category: ["Technology & Open Source"],
    owner_wallet_address: "DemoAddress5",
    creator_name: "Dev Tools Foundation",
    target_amount: 12000,
    current_amount: 4200,
    created_at: Date.now() - 21 * 24 * 60 * 60 * 1000, // 21 days ago
    is_active: true,
    end_date: Date.now() + 21 * 24 * 60 * 60 * 1000, // 21 days from now
    percentFunded: 35,
    daysLeft: 21,
    currentAmount: 4200,
    goalAmount: 12000,
  },
  {
    _id: "6",
    title: "Local Theater Renovation Project",
    description: "Renovating a historic community theater to preserve arts and culture in our town.",
    category: ["Arts & Creative"],
    owner_wallet_address: "DemoAddress6",
    creator_name: "Historic Theater Society",
    target_amount: 15000,
    current_amount: 5300,
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    is_active: true,
    end_date: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    percentFunded: 35,
    daysLeft: 30,
    currentAmount: 5300,
    goalAmount: 15000,
  },
  {
    _id: "7",
    title: "Disaster Relief for Flood Victims",
    description: "Providing immediate assistance to families affected by recent flooding in coastal areas.",
    category: ["Emergency Relief"],
    owner_wallet_address: "DemoAddress7",
    creator_name: "Emergency Response Team",
    target_amount: 10000,
    current_amount: 9800,
    created_at: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    is_active: true,
    end_date: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    percentFunded: 98,
    daysLeft: 2,
    currentAmount: 9800,
    goalAmount: 10000,
  },
  {
    _id: "8",
    title: "Mental Health Support Program",
    description: "Creating accessible mental health resources and support groups in underserved communities.",
    category: ["Health & Medical"],
    owner_wallet_address: "DemoAddress8",
    creator_name: "Mental Health Alliance",
    target_amount: 8000,
    current_amount: 3500,
    created_at: Date.now() - 18 * 24 * 60 * 60 * 1000, // 18 days ago
    is_active: true,
    end_date: Date.now() + 18 * 24 * 60 * 60 * 1000, // 18 days from now
    percentFunded: 44,
    daysLeft: 18,
    currentAmount: 3500,
    goalAmount: 8000,
  },
  {
    _id: "9",
    title: "Wildlife Conservation Initiative",
    description: "Protecting endangered species through habitat preservation and anti-poaching efforts.",
    category: ["Environment"],
    owner_wallet_address: "DemoAddress9",
    creator_name: "Wildlife Protection Fund",
    target_amount: 12000,
    current_amount: 7200,
    created_at: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    is_active: true,
    end_date: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
    percentFunded: 60,
    daysLeft: 14,
    currentAmount: 7200,
    goalAmount: 12000,
  },
  {
    _id: "10",
    title: "Scholarship Fund for First-Generation Students",
    description: "Helping first-generation college students achieve their educational dreams.",
    category: ["Education"],
    owner_wallet_address: "DemoAddress10",
    creator_name: "Education Equity Foundation",
    target_amount: 20000,
    current_amount: 6500,
    created_at: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
    is_active: true,
    end_date: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
    percentFunded: 32,
    daysLeft: 45,
    currentAmount: 6500,
    goalAmount: 20000,
  },
  {
    _id: "11",
    title: "Decentralized Identity Research",
    description: "Researching and developing privacy-preserving decentralized identity solutions on Solana.",
    category: ["Technology & Open Source"],
    owner_wallet_address: "DemoAddress11",
    creator_name: "Crypto Research Lab",
    target_amount: 25000,
    current_amount: 12300,
    created_at: Date.now() - 28 * 24 * 60 * 60 * 1000, // 28 days ago
    is_active: true,
    end_date: Date.now() + 28 * 24 * 60 * 60 * 1000, // 28 days from now
    percentFunded: 49,
    daysLeft: 28,
    currentAmount: 12300,
    goalAmount: 25000,
  },
  {
    _id: "12",
    title: "Community Food Bank Expansion",
    description: "Expanding our local food bank to serve more families facing food insecurity.",
    category: ["Community Projects"],
    owner_wallet_address: "DemoAddress12",
    creator_name: "Community Food Network",
    target_amount: 7000,
    current_amount: 4800,
    created_at: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    is_active: true,
    end_date: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
    percentFunded: 69,
    daysLeft: 10,
    currentAmount: 4800,
    goalAmount: 7000,
  },
]

export const getFundraisers = async () => {
  return fundraisers;
}

export const categories: FundraiserCategory[] = [
  "Education",
  "Health & Medical",
  "Environment",
  "Community Projects",
  "Arts & Creative",
  "Technology & Open Source",
  "Emergency Relief",
  "Others",
]