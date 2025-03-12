interface Fundraiser {
  id: string;
  title: string;
  description: string;
  fundraiserName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  images: string[];
  dueDate: Date;
  successMetrics: string[];
  plan: string;
  timeline: string[];
  teamMembers: TeamMember[];
  fundAllocations: string[];
}

type TeamMember = {
  id: string;
  name: string;
  image: string;
  role: string;
}

export const charities = [
    {
      id: "1",
      title: "Charity 1",
      description: "Description 1",
      fundraiserName: "Fundraiser 1",
      category: "Category 1",
      targetAmount: 1000,
      currentAmount: 500,
      images: ["https://picsum.photos/300/169", "https://picsum.photos/300/169", "https://picsum.photos/300/169"],
      dueDate: new Date("2025-01-01")
    },
    {
      id: "2",
      title: "Charity 2",
      description: "Description 2",
      fundraiserName: "Fundraiser 2",
      category: "Category 2",
      targetAmount: 2000,
      currentAmount: 1000,
      images: ["https://picsum.photos/300/169", "https://picsum.photos/300/169", "https://picsum.photos/300/169"],
      dueDate: new Date("2025-01-01")
    },
    {
      id: "3",
      title: "Charity 3",
      description: "Description 3",
      fundraiserName: "Fundraiser 3",
      category: "Category 3",
      targetAmount: 3000,
      currentAmount: 2000,
      images: ["https://picsum.photos/300/169", "https://picsum.photos/300/169", "https://picsum.photos/300/169"],
      dueDate: new Date("2025-01-01")
    },
    {
      id: "4",
      title: "Charity 4",
      description: "Description 4",
      fundraiserName: "Fundraiser 4",
      category: "Category 4",
      targetAmount: 4000,
      currentAmount: 3000,
      images: ["https://picsum.photos/300/169", "https://picsum.photos/300/169", "https://picsum.photos/300/169"],
      dueDate: new Date("2025-01-01")
    },
]

export const getFundraiserDetail = (id: string) => {
    return charities.find((charity) => charity.id === id);
}

export const getFundraisersPreview = () => {
  return charities.map((charity) =>{
    return {
      id: charity.id,
      title: charity.title,
      description: charity.description,
      fundraiserName: charity.fundraiserName,
      category: charity.category,
      targetAmount: charity.targetAmount,
      currentAmount: charity.currentAmount,
      image: charity.images[0] // Just preview the main image
    }
  })
}