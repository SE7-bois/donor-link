export interface Fundraiser {
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

export type FundraiserPreview = {
  id: string;
  title: string;
  description: string;
  fundraiserName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  image: string;
}

export const charities: Fundraiser[] = [
  {
    id: "1",
    title: "Charity 1",
    description: "Description 1",
    fundraiserName: "Fundraiser 1",
    category: "Education",
    targetAmount: 1000,
    currentAmount: 500,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-01-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: "Plan 1",
    timeline: ["Timeline 1", "Timeline 2", "Timeline 3"],
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 1",
      },
      {
        id: "2",
        name: "Jane Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 2",
      },
    ],
    fundAllocations: ["Fund Allocation 1", "Fund Allocation 2", "Fund Allocation 3"],
  },
  {
    id: "2",
    title: "Charity 2",
    description: "Description 2",
    fundraiserName: "Fundraiser 2",
    category: "Healthcare",
    targetAmount: 2000,
    currentAmount: 1000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-01-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: "Plan 1",
    timeline: ["Timeline 1", "Timeline 2", "Timeline 3"],
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 1",
      },
    ],
    fundAllocations: ["Fund Allocation 1", "Fund Allocation 2", "Fund Allocation 3"],
  },
  {
    id: "3",
    title: "Charity 3",
    description: "Description 3",
    fundraiserName: "Fundraiser 3",
    category: "Environment",
    targetAmount: 3000,
    currentAmount: 2000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-01-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: "Plan 1",
    timeline: ["Timeline 1", "Timeline 2", "Timeline 3"],
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 1",
      },
      {
        id: "2",
        name: "Jane Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 2",
      },
      {
        id: "3",
        name: "John Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 3",
      },
      {
        id: "4",
        name: "Jane Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 4",
      },
    ],
    fundAllocations: ["Fund Allocation 1", "Fund Allocation 2", "Fund Allocation 3"],
  },
  {
    id: "4",
    title: "Charity 4",
    description: "Description 4",
    fundraiserName: "Fundraiser 4",
    category: "Community",
    targetAmount: 4000,
    currentAmount: 3000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-01-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: "Plan 1",
    timeline: ["Timeline 1", "Timeline 2", "Timeline 3"],
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 1",
      },
      {
        id: "2",
        name: "Jane Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 2",
      },
    ],
    fundAllocations: ["Fund Allocation 1", "Fund Allocation 2", "Fund Allocation 3"],
  },
  {
    id: "5",
    title: "Charity 5",
    description: "Description 5",
    fundraiserName: "Fundraiser 5",
    category: "Global Issues",
    targetAmount: 1500,
    currentAmount: 750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-02-15"),
    successMetrics: ["Success Metric A", "Success Metric B", "Success Metric C"],
    plan: "Plan A",
    timeline: ["Timeline A", "Timeline B", "Timeline C"],
    teamMembers: [
      {
        id: "5",
        name: "Alice Smith",
        image: "https://picsum.photos/300/300",
        role: "Role X",
      },
    ],
    fundAllocations: ["Fund Allocation X", "Fund Allocation Y", "Fund Allocation Z"],
  },
  {
    id: "6",
    title: "Charity 6",
    description: "Description 6",
    fundraiserName: "Fundraiser 6",
    category: "Animal Welfare",
    targetAmount: 2500,
    currentAmount: 1250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-03-01"),
    successMetrics: ["Success Metric D", "Success Metric E", "Success Metric F"],
    plan: "Plan B",
    timeline: ["Timeline D", "Timeline E", "Timeline F"],
    teamMembers: [
      {
        id: "6",
        name: "Bob Johnson",
        image: "https://picsum.photos/300/300",
        role: "Role Y",
      },
      {
        id: "7",
        name: "Cathy Williams",
        image: "https://picsum.photos/300/300",
        role: "Role Z",
      },
    ],
    fundAllocations: ["Fund Allocation P", "Fund Allocation Q", "Fund Allocation R"],
  },
  {
    id: "7",
    title: "Charity 7",
    description: "Description 7",
    fundraiserName: "Fundraiser 7",
    category: "Human Rights",
    targetAmount: 3500,
    currentAmount: 1750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-03-15"),
    successMetrics: ["Success Metric G", "Success Metric H", "Success Metric I"],
    plan: "Plan C",
    timeline: ["Timeline G", "Timeline H", "Timeline I"],
    teamMembers: [
      {
        id: "8",
        name: "David Brown",
        image: "https://picsum.photos/300/300",
        role: "Role A",
      },
    ],
    fundAllocations: ["Fund Allocation S", "Fund Allocation T", "Fund Allocation U"],
  },
  {
    id: "8",
    title: "Charity 8",
    description: "Description 8",
    fundraiserName: "Fundraiser 8",
    category: "Economic Development",
    targetAmount: 4500,
    currentAmount: 2250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-04-01"),
    successMetrics: ["Success Metric J", "Success Metric K", "Success Metric L"],
    plan: "Plan D",
    timeline: ["Timeline J", "Timeline K", "Timeline L"],
    teamMembers: [
      {
        id: "9",
        name: "Emily Davis",
        image: "https://picsum.photos/300/300",
        role: "Role B",
      },
      {
        id: "10",
        name: "Frank Miller",
        image: "https://picsum.photos/300/300",
        role: "Role C",
      },
    ],
    fundAllocations: ["Fund Allocation V", "Fund Allocation W", "Fund Allocation X"],
  },
  {
    id: "9",
    title: "Charity 9",
    description: "Description 9",
    fundraiserName: "Fundraiser 9",
    category: "Arts & Culture",
    targetAmount: 5500,
    currentAmount: 2750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-04-15"),
    successMetrics: ["Success Metric M", "Success Metric N", "Success Metric O"],
    plan: "Plan E",
    timeline: ["Timeline M", "Timeline N", "Timeline O"],
    teamMembers: [
      {
        id: "11",
        name: "Grace Wilson",
        image: "https://picsum.photos/300/300",
        role: "Role D",
      },
    ],
    fundAllocations: ["Fund Allocation Y", "Fund Allocation Z", "Fund Allocation A"],
  },
  {
    id: "10",
    title: "Charity 10",
    description: "Description 10",
    fundraiserName: "Fundraiser 10",
    category: "Community",
    targetAmount: 6500,
    currentAmount: 3250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-05-01"),
    successMetrics: ["Success Metric P", "Success Metric Q", "Success Metric R"],
    plan: "Plan F",
    timeline: ["Timeline P", "Timeline Q", "Timeline R"],
    teamMembers: [
      {
        id: "12",
        name: "Henry Garcia",
        image: "https://picsum.photos/300/300",
        role: "Role E",
      },
      {
        id: "13",
        name: "Ivy Rodriguez",
        image: "https://picsum.photos/300/300",
        role: "Role F",
      },
    ],
    fundAllocations: ["Fund Allocation B", "Fund Allocation C", "Fund Allocation D"],
  },
  {
    id: "11",
    title: "Charity 11",
    description: "Description 11",
    fundraiserName: "Fundraiser 11",
    category: "Global Issues",
    targetAmount: 7500,
    currentAmount: 3750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-06-01"),
    successMetrics: ["Success Metric S", "Success Metric T", "Success Metric U"],
    plan: "Plan G",
    timeline: ["Timeline S", "Timeline T", "Timeline U"],
    teamMembers: [
      {
        id: "14",
        name: "Jack Martinez",
        image: "https://picsum.photos/300/300",
        role: "Role G",
      },
    ],
    fundAllocations: ["Fund Allocation E", "Fund Allocation F", "Fund Allocation G"],
  },
  {
    id: "12",
    title: "Charity 12",
    description: "Description 12",
    fundraiserName: "Fundraiser 12",
    category: "Animal Welfare",
    targetAmount: 8500,
    currentAmount: 4250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-07-01"),
    successMetrics: ["Success Metric V", "Success Metric W", "Success Metric X"],
    plan: "Plan H",
    timeline: ["Timeline V", "Timeline W", "Timeline X"],
    teamMembers: [
      {
        id: "15",
        name: "Karen Anderson",
        image: "https://picsum.photos/300/300",
        role: "Role H",
      },
      {
        id: "16",
        name: "Liam Thomas",
        image: "https://picsum.photos/300/300",
        role: "Role I",
      },
    ],
    fundAllocations: ["Fund Allocation H", "Fund Allocation I", "Fund Allocation J"],
  },
  {
    id: "13",
    title: "Charity 13",
    description: "Description 13",
    fundraiserName: "Fundraiser 13",
    category: "Human Rights",
    targetAmount: 9500,
    currentAmount: 4750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-08-01"),
    successMetrics: ["Success Metric Y", "Success Metric Z", "Success Metric AA"],
    plan: "Plan I",
    timeline: ["Timeline Y", "Timeline Z", "Timeline AA"],
    teamMembers: [
      {
        id: "17",
        name: "Mia Jackson",
        image: "https://picsum.photos/300/300",
        role: "Role J",
      },
    ],
    fundAllocations: ["Fund Allocation K", "Fund Allocation L", "Fund Allocation M"],
  },
  {
    id: "14",
    title: "Charity 14",
    description: "Description 14",
    fundraiserName: "Fundraiser 14",
    category: "Economic Development",
    targetAmount: 10500,
    currentAmount: 5250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-09-01"),
    successMetrics: ["Success Metric BB", "Success Metric CC", "Success Metric DD"],
    plan: "Plan J",
    timeline: ["Timeline BB", "Timeline CC", "Timeline DD"],
    teamMembers: [
      {
        id: "18",
        name: "Noah White",
        image: "https://picsum.photos/300/300",
        role: "Role K",
      },
      {
        id: "19",
        name: "Olivia Harris",
        image: "https://picsum.photos/300/300",
        role: "Role L",
      },
    ],
    fundAllocations: ["Fund Allocation N", "Fund Allocation O", "Fund Allocation P"],
  },
  {
    id: "15",
    title: "Charity 15",
    description: "Description 15",
    fundraiserName: "Fundraiser 15",
    category: "Arts & Culture",
    targetAmount: 11500,
    currentAmount: 5750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-10-01"),
    successMetrics: ["Success Metric EE", "Success Metric FF", "Success Metric GG"],
    plan: "Plan K",
    timeline: ["Timeline EE", "Timeline FF", "Timeline GG"],
    teamMembers: [
      {
        id: "20",
        name: "Owen Martin",
        image: "https://picsum.photos/300/300",
        role: "Role M",
      },
    ],
    fundAllocations: ["Fund Allocation Q", "Fund Allocation R", "Fund Allocation S"],
  },
  {
    id: "16",
    title: "Charity 16",
    description: "Description 16",
    fundraiserName: "Fundraiser 16",
    category: "Community",
    targetAmount: 12500,
    currentAmount: 6250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-11-01"),
    successMetrics: ["Success Metric HH", "Success Metric II", "Success Metric JJ"],
    plan: "Plan L",
    timeline: ["Timeline HH", "Timeline II", "Timeline JJ"],
    teamMembers: [
      {
        id: "21",
        name: "Penny Thompson",
        image: "https://picsum.photos/300/300",
        role: "Role N",
      },
      {
        id: "22",
        name: "Quinn Lewis",
        image: "https://picsum.photos/300/300",
        role: "Role O",
      },
    ],
    fundAllocations: ["Fund Allocation T", "Fund Allocation U", "Fund Allocation V"],
  },
  {
    id: "17",
    title: "Charity 17",
    description: "Description 17",
    fundraiserName: "Fundraiser 17",
    category: "Global Issues",
    targetAmount: 13500,
    currentAmount: 6750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2025-12-01"),
    successMetrics: ["Success Metric KK", "Success Metric LL", "Success Metric MM"],
    plan: "Plan M",
    timeline: ["Timeline KK", "Timeline LL", "Timeline MM"],
    teamMembers: [
      {
        id: "23",
        name: "Ryan Clark",
        image: "https://picsum.photos/300/300",
        role: "Role P",
      },
    ],
    fundAllocations: ["Fund Allocation W", "Fund Allocation X", "Fund Allocation Y"],
  },
  {
    id: "18",
    title: "Charity 18",
    description: "Description 18",
    fundraiserName: "Fundraiser 18",
    category: "Animal Welfare",
    targetAmount: 14500,
    currentAmount: 7250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2026-01-01"),
    successMetrics: ["Success Metric NN", "Success Metric OO", "Success Metric PP"],
    plan: "Plan N",
    timeline: ["Timeline NN", "Timeline OO", "Timeline PP"],
    teamMembers: [
      {
        id: "24",
        name: "Sophia Baker",
        image: "https://picsum.photos/300/300",
        role: "Role Q",
      },
      {
        id: "25",
        name: "Tyler Green",
        image: "https://picsum.photos/300/300",
        role: "Role R",
      },
    ],
    fundAllocations: ["Fund Allocation Z", "Fund Allocation AA", "Fund Allocation BB"],
  },
  {
    id: "19",
    title: "Charity 19",
    description: "Description 19",
    fundraiserName: "Fundraiser 19",
    category: "Human Rights",
    targetAmount: 15500,
    currentAmount: 7750,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2026-02-01"),
    successMetrics: ["Success Metric QQ", "Success Metric RR", "Success Metric SS"],
    plan: "Plan O",
    timeline: ["Timeline QQ", "Timeline RR", "Timeline SS"],
    teamMembers: [
      {
        id: "26",
        name: "Uma Nelson",
        image: "https://picsum.photos/300/300",
        role: "Role S",
      },
    ],
    fundAllocations: ["Fund Allocation CC", "Fund Allocation DD", "Fund Allocation EE"],
  },
  {
    id: "20",
    title: "Charity 20",
    description: "Description 20",
    fundraiserName: "Fundraiser 20",
    category: "Economic Development",
    targetAmount: 16500,
    currentAmount: 8250,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
      "https://picsum.photos/300/169",
    ],
    dueDate: new Date("2026-03-01"),
    successMetrics: ["Success Metric TT", "Success Metric UU", "Success Metric VV"],
    plan: "Plan P",
    timeline: ["Timeline TT", "Timeline UU", "Timeline VV"],
    teamMembers: [
      {
        id: "27",
        name: "Vincent Carter",
        image: "https://picsum.photos/300/300",
        role: "Role T",
      },
      {
        id: "28",
        name: "Willow Mitchell",
        image: "https://picsum.photos/300/300",
        role: "Role U",
      },
    ],
    fundAllocations: ["Fund Allocation FF", "Fund Allocation GG", "Fund Allocation HH"],
  },
];

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
      image: charity.images[0]
    }
  })
}

export const getFeaturedCharities = () => {
  return charities.slice(0, 10)
}

export const getFundraiserByCategory = (category: string) => {
  return charities
    .filter((charity) => category === charity.category)
    .map((charity) => ({
      id: charity.id,
      title: charity.title,
      description: charity.description,
      fundraiserName: charity.fundraiserName,
      category: charity.category,
      targetAmount: charity.targetAmount,
      currentAmount: charity.currentAmount,
      image: charity.images[0]
    }));
}