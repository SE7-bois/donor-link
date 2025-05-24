export type FundraiserCategory =
  | "Education"
  | "Health & Medical"
  | "Environment"
  | "Community Projects"
  | "Arts & Creative"
  | "Technology & Open Source"
  | "Emergency Relief"
  | "Others";

export type Fundraiser = {
  id: number;
  title: string;
  description: string;
  category: FundraiserCategory;
  currentAmount: number;
  goalAmount: number
  percentFunded: number
  daysLeft: number
}

export const fundraisers: Fundraiser[] = [
  {
    id: 1,
    title: "Coding Bootcamp for Underprivileged Youth",
    description:
      "Help provide coding education to underprivileged youth in urban areas, opening doors to tech careers.",
    category: "Education",
    currentAmount: 3.2,
    goalAmount: 5,
    percentFunded: 64,
    daysLeft: 12,
  },
  {
    id: 2,
    title: "Renewable Energy for Rural Schools",
    description: "Installing solar panels in rural schools to provide sustainable electricity for education.",
    category: "Environment",
    currentAmount: 8.5,
    goalAmount: 10,
    percentFunded: 85,
    daysLeft: 8,
  },
  {
    id: 3,
    title: "Community Garden Initiative",
    description: "Creating urban gardens to provide fresh produce and green spaces in underserved neighborhoods.",
    category: "Community Projects",
    currentAmount: 2.1,
    goalAmount: 4,
    percentFunded: 52,
    daysLeft: 15,
  },
  {
    id: 4,
    title: "Emergency Medical Supplies for Clinic",
    description: "Providing essential medical supplies to a clinic serving low-income communities.",
    category: "Health & Medical",
    currentAmount: 6.8,
    goalAmount: 7.5,
    percentFunded: 91,
    daysLeft: 5,
  },
  {
    id: 5,
    title: "Open Source Blockchain Development Tools",
    description: "Building developer tools to make blockchain development more accessible to everyone.",
    category: "Technology & Open Source",
    currentAmount: 4.2,
    goalAmount: 12,
    percentFunded: 35,
    daysLeft: 21,
  },
  {
    id: 6,
    title: "Local Theater Renovation Project",
    description: "Renovating a historic community theater to preserve arts and culture in our town.",
    category: "Arts & Creative",
    currentAmount: 5.3,
    goalAmount: 15,
    percentFunded: 35,
    daysLeft: 30,
  },
  {
    id: 7,
    title: "Disaster Relief for Flood Victims",
    description: "Providing immediate assistance to families affected by recent flooding in coastal areas.",
    category: "Emergency Relief",
    currentAmount: 9.8,
    goalAmount: 10,
    percentFunded: 98,
    daysLeft: 2,
  },
  {
    id: 8,
    title: "Mental Health Support Program",
    description: "Creating accessible mental health resources and support groups in underserved communities.",
    category: "Health & Medical",
    currentAmount: 3.5,
    goalAmount: 8,
    percentFunded: 44,
    daysLeft: 18,
  },
  {
    id: 9,
    title: "Wildlife Conservation Initiative",
    description: "Protecting endangered species through habitat preservation and anti-poaching efforts.",
    category: "Environment",
    currentAmount: 7.2,
    goalAmount: 12,
    percentFunded: 60,
    daysLeft: 14,
  },
  {
    id: 10,
    title: "Scholarship Fund for First-Generation Students",
    description: "Helping first-generation college students achieve their educational dreams.",
    category: "Education",
    currentAmount: 6.5,
    goalAmount: 20,
    percentFunded: 32,
    daysLeft: 45,
  },
  {
    id: 11,
    title: "Decentralized Identity Research",
    description: "Researching and developing privacy-preserving decentralized identity solutions on Solana.",
    category: "Technology & Open Source",
    currentAmount: 12.3,
    goalAmount: 25,
    percentFunded: 49,
    daysLeft: 28,
  },
  {
    id: 12,
    title: "Community Food Bank Expansion",
    description: "Expanding our local food bank to serve more families facing food insecurity.",
    category: "Others",
    currentAmount: 4.8,
    goalAmount: 7,
    percentFunded: 69,
    daysLeft: 10,
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