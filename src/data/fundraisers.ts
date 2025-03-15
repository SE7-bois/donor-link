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
  plan: Plan;
  teamMembers: TeamMember[];
  fundAllocations: FundAllocation[];
}

type TeamMember = {
  id: string;
  name: string;
  image: string;
  role: string;
}

type FundAllocation = {
  from: string;
  to: string;
  amount: number;
}

type TimelineItem = {
  title: string;
  description: string;
  duration: string;
}

type Plan = {
  plan: string;
  timeline: TimelineItem[];
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
    title: "Education for All",
    description: "Providing educational resources to underprivileged children in rural areas.",
    fundraiserName: "Yayasan Pendidikan Harapan",
    category: "Education",
    targetAmount: 1000,
    currentAmount: 800,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2023-11-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: {
      plan: "Plan 1",
      timeline: [
        {
          title: "Initial Phase",
          description: "Setting up the foundation",
          duration: "2 months"
        },
        {
          title: "Development",
          description: "Main development phase",
          duration: "4 months"
        },
        {
          title: "Completion",
          description: "Final touches and launch",
          duration: "2 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Initial Phase",
        amount: 400
      },
      {
        from: "Donations",
        to: "Development",
        amount: 300
      },
      {
        from: "Donations",
        to: "Completion",
        amount: 300
      }
    ],
  },
  {
    id: "2",
    title: "Healthcare for All",
    description: "Improving healthcare access in remote areas through mobile clinics.",
    fundraiserName: "Layanan Kesehatan Indonesia",
    category: "Healthcare",
    targetAmount: 2000,
    currentAmount: 1500,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-06-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: {
      plan: "Plan 2",
      timeline: [
        {
          title: "Research Phase",
          description: "Initial research and planning",
          duration: "3 months"
        },
        {
          title: "Implementation",
          description: "Implementing the solutions",
          duration: "6 months"
        },
        {
          title: "Evaluation",
          description: "Evaluating the results",
          duration: "3 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "1",
        name: "John Doe",
        image: "https://picsum.photos/300/300",
        role: "Role 1",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Research Phase",
        amount: 800
      },
      {
        from: "Donations",
        to: "Implementation",
        amount: 800
      },
      {
        from: "Donations",
        to: "Evaluation",
        amount: 400
      }
    ],
  },
  {
    id: "3",
    title: "Green Future",
    description: "Promoting sustainable practices in urban areas to combat climate change.",
    fundraiserName: "Inisiatif Hijau Indonesia",
    category: "Environment",
    targetAmount: 3000,
    currentAmount: 2500,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-01-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: {
      plan: "Environmental Conservation Initiative",
      timeline: [
        {
          title: "Site Assessment",
          description: "Evaluating target conservation areas",
          duration: "2 months"
        },
        {
          title: "Resource Mobilization",
          description: "Gathering necessary resources and permits",
          duration: "3 months"
        },
        {
          title: "Implementation",
          description: "Executing conservation strategies",
          duration: "7 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Site Assessment",
        amount: 1000
      },
      {
        from: "Donations",
        to: "Resource Mobilization",
        amount: 1000
      },
      {
        from: "Donations",
        to: "Implementation",
        amount: 1000
      }
    ],
  },
  {
    id: "4",
    title: "Community Empowerment",
    description: "Empowering local communities through skill development and job training.",
    fundraiserName: "Pemberdayaan Masyarakat Mandiri",
    category: "Community",
    targetAmount: 4000,
    currentAmount: 3000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-11-01"),
    successMetrics: ["Success Metric 1", "Success Metric 2", "Success Metric 3"],
    plan: {
      plan: "Community Development Program",
      timeline: [
        {
          title: "Community Engagement",
          description: "Initial meetings and planning with community leaders",
          duration: "1 month"
        },
        {
          title: "Needs Assessment",
          description: "Identifying key areas for improvement",
          duration: "2 months"
        },
        {
          title: "Project Implementation",
          description: "Executing community development initiatives",
          duration: "9 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Community Engagement",
        amount: 1333
      },
      {
        from: "Donations",
        to: "Needs Assessment",
        amount: 1333
      },
      {
        from: "Donations",
        to: "Project Implementation",
        amount: 1334
      }
    ],
  },
  {
    id: "5",
    title: "Global Health",
    description: "Supporting global health initiatives to combat infectious diseases.",
    fundraiserName: "Solidaritas Kesehatan Dunia",
    category: "Global Issues",
    targetAmount: 1500,
    currentAmount: 1200,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-10-01"),
    successMetrics: ["Success Metric A", "Success Metric B", "Success Metric C"],
    plan: {
      plan: "Global Impact Initiative",
      timeline: [
        {
          title: "Research & Analysis",
          description: "Global situation analysis and strategy development",
          duration: "3 months"
        },
        {
          title: "Partnership Building",
          description: "Establishing international partnerships",
          duration: "4 months"
        },
        {
          title: "Program Launch",
          description: "Rolling out the initiative globally",
          duration: "5 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "5",
        name: "Alice Smith",
        image: "https://picsum.photos/300/300",
        role: "Role X",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Research & Analysis",
        amount: 500
      },
      {
        from: "Donations",
        to: "Partnership Building",
        amount: 500
      },
      {
        from: "Donations",
        to: "Program Launch",
        amount: 500
      }
    ],
  },
  {
    id: "6",
    title: "Pawsitive Future",
    description: "Rescuing and rehabilitating stray animals, providing them with a second chance.",
    fundraiserName: "Perlindungan Satwa Nusantara",
    category: "Animal Welfare",
    targetAmount: 2500,
    currentAmount: 2000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-09-15"),
    successMetrics: ["Success Metric D", "Success Metric E", "Success Metric F"],
    plan: {
      plan: "Animal Protection Program",
      timeline: [
        {
          title: "Shelter Setup",
          description: "Establishing animal shelter facilities",
          duration: "2 months"
        },
        {
          title: "Medical Infrastructure",
          description: "Setting up veterinary services",
          duration: "3 months"
        },
        {
          title: "Outreach Program",
          description: "Community education and adoption program",
          duration: "7 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Shelter Setup",
        amount: 833
      },
      {
        from: "Donations",
        to: "Medical Infrastructure",
        amount: 833
      },
      {
        from: "Donations",
        to: "Outreach Program",
        amount: 834
      }
    ],
  },
  {
    id: "7",
    title: "Justice for All",
    description: "Advocating for human rights and legal support for marginalized communities.",
    fundraiserName: "Pembela Hak Asasi Manusia",
    category: "Human Rights",
    targetAmount: 3500,
    currentAmount: 3200,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-08-01"),
    successMetrics: ["Success Metric G", "Success Metric H", "Success Metric I"],
    plan: {
      plan: "Human Rights Advocacy Program",
      timeline: [
        {
          title: "Research & Documentation",
          description: "Gathering evidence and documenting cases",
          duration: "3 months"
        },
        {
          title: "Legal Framework",
          description: "Establishing legal support network",
          duration: "4 months"
        },
        {
          title: "Advocacy Campaign",
          description: "Launching public awareness campaign",
          duration: "5 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "8",
        name: "David Brown",
        image: "https://picsum.photos/300/300",
        role: "Role A",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Research & Documentation",
        amount: 1166
      },
      {
        from: "Donations",
        to: "Legal Framework",
        amount: 1167
      },
      {
        from: "Donations",
        to: "Advocacy Campaign",
        amount: 1167
      }
    ],
  },
  {
    id: "8",
    title: "Prosperity Initiative",
    description: "Promoting economic development through skill-building and entrepreneurship.",
    fundraiserName: "Gerakan Ekonomi Maju",
    category: "Economic Development",
    targetAmount: 4500,
    currentAmount: 4000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-07-15"),
    successMetrics: ["Success Metric J", "Success Metric K", "Success Metric L"],
    plan: {
      plan: "Economic Empowerment Initiative",
      timeline: [
        {
          title: "Market Analysis",
          description: "Analyzing local economic conditions",
          duration: "2 months"
        },
        {
          title: "Skills Training",
          description: "Implementing vocational training programs",
          duration: "6 months"
        },
        {
          title: "Business Incubation",
          description: "Supporting small business development",
          duration: "4 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Market Analysis",
        amount: 1500
      },
      {
        from: "Donations",
        to: "Skills Training",
        amount: 1500
      },
      {
        from: "Donations",
        to: "Business Incubation",
        amount: 1500
      }
    ],
  },
  {
    id: "9",
    title: "Cultural Harmony",
    description: "Preserving and promoting traditional arts and cultural heritage.",
    fundraiserName: "Pelestarian Budaya Bangsa",
    category: "Arts & Culture",
    targetAmount: 5500,
    currentAmount: 3000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-04-15"),
    successMetrics: ["Success Metric M", "Success Metric N", "Success Metric O"],
    plan: {
      plan: "Cultural Heritage Preservation",
      timeline: [
        {
          title: "Cultural Mapping",
          description: "Identifying key cultural assets",
          duration: "3 months"
        },
        {
          title: "Preservation Planning",
          description: "Developing preservation strategies",
          duration: "4 months"
        },
        {
          title: "Community Programs",
          description: "Implementing cultural programs",
          duration: "5 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "11",
        name: "Grace Wilson",
        image: "https://picsum.photos/300/300",
        role: "Role D",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Cultural Mapping",
        amount: 1833
      },
      {
        from: "Donations",
        to: "Preservation Planning",
        amount: 1833
      },
      {
        from: "Donations",
        to: "Community Programs",
        amount: 1834
      }
    ],
  },
  {
    id: "10",
    title: "Community Uplift",
    description: "Improving infrastructure and facilities in underserved communities.",
    fundraiserName: "Infrastruktur Untuk Negeri",
    category: "Community",
    targetAmount: 6500,
    currentAmount: 5000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-05-01"),
    successMetrics: ["Success Metric P", "Success Metric Q", "Success Metric R"],
    plan: {
      plan: "Community Infrastructure Development",
      timeline: [
        {
          title: "Infrastructure Assessment",
          description: "Evaluating community infrastructure needs",
          duration: "2 months"
        },
        {
          title: "Project Planning",
          description: "Detailed planning and stakeholder engagement",
          duration: "3 months"
        },
        {
          title: "Construction Phase",
          description: "Building and upgrading facilities",
          duration: "7 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Infrastructure Assessment",
        amount: 2166
      },
      {
        from: "Donations",
        to: "Project Planning",
        amount: 2167
      },
      {
        from: "Donations",
        to: "Construction Phase",
        amount: 2167
      }
    ],
  },
  {
    id: "11",
    title: "Climate Action Now",
    description: "Addressing climate change through sustainable practices and renewable energy.",
    fundraiserName: "Aksi Iklim Global",
    category: "Global Issues",
    targetAmount: 7500,
    currentAmount: 4000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-06-01"),
    successMetrics: ["Success Metric S", "Success Metric T", "Success Metric U"],
    plan: {
      plan: "Global Climate Action",
      timeline: [
        {
          title: "Research Phase",
          description: "Climate impact assessment and planning",
          duration: "3 months"
        },
        {
          title: "Technology Implementation",
          description: "Deploying sustainable solutions",
          duration: "6 months"
        },
        {
          title: "Community Education",
          description: "Training and awareness programs",
          duration: "3 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "14",
        name: "Jack Martinez",
        image: "https://picsum.photos/300/300",
        role: "Role G",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Research Phase",
        amount: 2500
      },
      {
        from: "Donations",
        to: "Technology Implementation",
        amount: 2500
      },
      {
        from: "Donations",
        to: "Community Education",
        amount: 2500
      }
    ],
  },
  {
    id: "12",
    title: "Wildlife Protection",
    description: "Conserving endangered wildlife species and their natural habitats.",
    fundraiserName: "Konservasi Alam Liar",
    category: "Animal Welfare",
    targetAmount: 8500,
    currentAmount: 7000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-07-01"),
    successMetrics: ["Success Metric V", "Success Metric W", "Success Metric X"],
    plan: {
      plan: "Wildlife Conservation Program",
      timeline: [
        {
          title: "Habitat Assessment",
          description: "Evaluating wildlife habitats",
          duration: "2 months"
        },
        {
          title: "Protection Measures",
          description: "Implementing conservation strategies",
          duration: "5 months"
        },
        {
          title: "Monitoring Program",
          description: "Setting up wildlife monitoring systems",
          duration: "5 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Habitat Assessment",
        amount: 2833
      },
      {
        from: "Donations",
        to: "Protection Measures",
        amount: 2833
      },
      {
        from: "Donations",
        to: "Monitoring Program",
        amount: 2834
      }
    ],
  },
  {
    id: "13",
    title: "Human Rights Education",
    description: "Educating communities about human rights and promoting equality.",
    fundraiserName: "Edukasi Hak Asasi",
    category: "Human Rights",
    targetAmount: 9500,
    currentAmount: 5000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-08-01"),
    successMetrics: ["Success Metric Y", "Success Metric Z", "Success Metric AA"],
    plan: {
      plan: "Human Rights Education Initiative",
      timeline: [
        {
          title: "Curriculum Development",
          description: "Creating comprehensive human rights education materials",
          duration: "4 months"
        },
        {
          title: "Teacher Training",
          description: "Training educators in human rights education",
          duration: "3 months"
        },
        {
          title: "Program Implementation",
          description: "Rolling out education programs in schools",
          duration: "5 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "17",
        name: "Mia Jackson",
        image: "https://picsum.photos/300/300",
        role: "Role J",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Curriculum Development",
        amount: 3166
      },
      {
        from: "Donations",
        to: "Teacher Training",
        amount: 3167
      },
      {
        from: "Donations",
        to: "Program Implementation",
        amount: 3167
      }
    ],
  },
  {
    id: "14",
    title: "Microfinance Support",
    description: "Providing financial assistance to small businesses and entrepreneurs.",
    fundraiserName: "Dana Usaha Mikro",
    category: "Economic Development",
    targetAmount: 10500,
    currentAmount: 10000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-09-01"),
    successMetrics: ["Success Metric BB", "Success Metric CC", "Success Metric DD"],
    plan: {
      plan: "Microfinance Support Program",
      timeline: [
        {
          title: "Financial Assessment",
          description: "Evaluating potential beneficiaries and needs",
          duration: "3 months"
        },
        {
          title: "Financial Education",
          description: "Providing financial literacy training",
          duration: "4 months"
        },
        {
          title: "Loan Distribution",
          description: "Implementing microfinance program",
          duration: "5 months"
        }
      ]
    },
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
    fundAllocations: [
      {
        from: "Donations",
        to: "Financial Assessment",
        amount: 3500
      },
      {
        from: "Donations",
        to: "Financial Education",
        amount: 3500
      },
      {
        from: "Donations",
        to: "Loan Distribution",
        amount: 3500
      }
    ],
  },
  {
    id: "15",
    title: "Youth Arts Program",
    description: "Providing art education and resources for young aspiring artists.",
    fundraiserName: "Sanggar Seni Muda",
    category: "Arts & Culture",
    targetAmount: 11500,
    currentAmount: 6000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-10-01"),
    successMetrics: ["Success Metric EE", "Success Metric FF", "Success Metric GG"],
    plan: {
      plan: "Youth Arts Program",
      timeline: [
        {
          title: "Program Design",
          description: "Developing arts education curriculum",
          duration: "2 months"
        },
        {
          title: "Resource Acquisition",
          description: "Securing art supplies and facilities",
          duration: "3 months"
        },
        {
          title: "Program Launch",
          description: "Starting youth arts classes and workshops",
          duration: "7 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "20",
        name: "Owen Martin",
        image: "https://picsum.photos/300/300",
        role: "Role M",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Program Design",
        amount: 3833
      },
      {
        from: "Donations",
        to: "Resource Acquisition",
        amount: 3833
      },
      {
        from: "Donations",
        to: "Program Launch",
        amount: 3834
      }
    ],
  },
  {
    id: "16",
    title: "Rural Healthcare Access",
    description: "Extending healthcare services to remote communities through mobile units.",
    fundraiserName: "Akses Kesehatan Desa",
    category: "Healthcare",
    targetAmount: 12500,
    currentAmount: 7000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2025-11-01"),
    successMetrics: ["Success Metric HH", "Success Metric II", "Success Metric JJ"],
    plan: {
      plan: "Rural Healthcare Access",
      timeline: [
        {
          title: "Needs Analysis",
          description: "Assessing healthcare gaps in rural areas",
          duration: "2 months"
        },
        {
          title: "Mobile Clinic Setup",
          description: "Establishing mobile healthcare units",
          duration: "4 months"
        },
        {
          title: "Service Delivery",
          description: "Providing healthcare services to rural communities",
          duration: "6 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "21",
        name: "Patricia Lee",
        image: "https://picsum.photos/300/300",
        role: "Role N",
      },
      {
        id: "22",
        name: "Quinn Chen",
        image: "https://picsum.photos/300/300",
        role: "Role O",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Needs Analysis",
        amount: 4166
      },
      {
        from: "Donations",
        to: "Mobile Clinic Setup",
        amount: 4167
      },
      {
        from: "Donations",
        to: "Service Delivery",
        amount: 4167
      }
    ],
  },
  {
    id: "17",
    title: "Digital Education",
    description: "Bridging the digital divide in education through digital resources and training.",
    fundraiserName: "Literasi Digital Indonesia",
    category: "Education",
    targetAmount: 13500,
    currentAmount: 13000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-12-01"),
    successMetrics: ["Success Metric KK", "Success Metric LL", "Success Metric MM"],
    plan: {
      plan: "Digital Education Initiative",
      timeline: [
        {
          title: "Technology Assessment",
          description: "Evaluating digital infrastructure needs",
          duration: "2 months"
        },
        {
          title: "Equipment Distribution",
          description: "Providing digital learning devices",
          duration: "3 months"
        },
        {
          title: "Digital Training",
          description: "Training teachers and students in digital tools",
          duration: "7 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "23",
        name: "Rachel Kim",
        image: "https://picsum.photos/300/300",
        role: "Role P",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Technology Assessment",
        amount: 4500
      },
      {
        from: "Donations",
        to: "Equipment Distribution",
        amount: 4500
      },
      {
        from: "Donations",
        to: "Digital Training",
        amount: 4500
      }
    ],
  },
  {
    id: "18",
    title: "Sustainable Agriculture",
    description: "Promoting sustainable farming practices for environmental preservation.",
    fundraiserName: "Pertanian Berkelanjutan",
    category: "Environment",
    targetAmount: 14500,
    currentAmount: 10000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2026-01-01"),
    successMetrics: ["Success Metric NN", "Success Metric OO", "Success Metric PP"],
    plan: {
      plan: "Sustainable Agriculture Program",
      timeline: [
        {
          title: "Farm Selection",
          description: "Identifying participating farms",
          duration: "2 months"
        },
        {
          title: "Training Program",
          description: "Teaching sustainable farming methods",
          duration: "4 months"
        },
        {
          title: "Implementation",
          description: "Converting to sustainable practices",
          duration: "6 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "24",
        name: "Samuel Taylor",
        image: "https://picsum.photos/300/300",
        role: "Role Q",
      },
      {
        id: "25",
        name: "Tina Clark",
        image: "https://picsum.photos/300/300",
        role: "Role R",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Farm Selection",
        amount: 4833
      },
      {
        from: "Donations",
        to: "Training Program",
        amount: 4833
      },
      {
        from: "Donations",
        to: "Implementation",
        amount: 4834
      }
    ],
  },
  {
    id: "19",
    title: "Youth Empowerment",
    description: "Empowering youth through education, skills training, and mentorship programs.",
    fundraiserName: "Generasi Maju Indonesia",
    category: "Community",
    targetAmount: 15500,
    currentAmount: 9000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2026-02-01"),
    successMetrics: ["Success Metric QQ", "Success Metric RR", "Success Metric SS"],
    plan: {
      plan: "Youth Empowerment Program",
      timeline: [
        {
          title: "Community Survey",
          description: "Assessing youth needs and interests",
          duration: "2 months"
        },
        {
          title: "Program Development",
          description: "Creating youth-focused initiatives",
          duration: "4 months"
        },
        {
          title: "Implementation",
          description: "Running youth programs and activities",
          duration: "6 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "26",
        name: "Uma Patel",
        image: "https://picsum.photos/300/300",
        role: "Role S",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Community Survey",
        amount: 5166
      },
      {
        from: "Donations",
        to: "Program Development",
        amount: 5167
      },
      {
        from: "Donations",
        to: "Implementation",
        amount: 5167
      }
    ],
  },
  {
    id: "20",
    title: "Mental Health Support",
    description: "Providing mental health services and raising awareness about mental health issues.",
    fundraiserName: "Kesehatan Jiwa Sejahtera",
    category: "Healthcare",
    targetAmount: 16500,
    currentAmount: 15000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2026-03-01"),
    successMetrics: ["Success Metric TT", "Success Metric UU", "Success Metric VV"],
    plan: {
      plan: "Mental Health Support Initiative",
      timeline: [
        {
          title: "Service Planning",
          description: "Designing mental health support services",
          duration: "3 months"
        },
        {
          title: "Staff Training",
          description: "Training mental health professionals",
          duration: "4 months"
        },
        {
          title: "Program Launch",
          description: "Starting mental health support services",
          duration: "5 months"
        }
      ]
    },
    teamMembers: [
      {
        id: "27",
        name: "Victor Wong",
        image: "https://picsum.photos/300/300",
        role: "Role T",
      },
      {
        id: "28",
        name: "Wendy Zhang",
        image: "https://picsum.photos/300/300",
        role: "Role U",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Service Planning",
        amount: 5500
      },
      {
        from: "Donations",
        to: "Staff Training",
        amount: 5500
      },
      {
        from: "Donations",
        to: "Program Launch",
        amount: 5500
      }
    ],
  },
  {
    id: "21",
    title: "Clean Water Initiative",
    description: "Providing clean water access to underprivileged communities in Greater Jakarta",
    category: "Community",
    targetAmount: 50000,
    currentAmount: 45000,
    images: [
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
      "https://picsum.photos/1280/720",
    ],
    dueDate: new Date("2024-12-31"),
    successMetrics: [
      "Successfully do a feasibility study",
      "Successfully earn a permit",
      "Sucessfully installed 5000 working water filters",
    ],
    fundraiserName: "Badan Amal Indonesia",
    plan: {
      plan: "Clean Water Access Program",
      timeline: [
        {
          title: "Feasibility Study",
          description:
            "Conducting comprehensive analysis of water needs and implementation requirements",
          duration: "3 months",
        },
        {
          title: "Permit Acquisition",
          description: "Obtaining necessary permits and approvals from authorities",
          duration: "2 months",
        },
        {
          title: "Water Filter Installation",
          description: "Installing and testing 5000 water filters in target communities",
          duration: "7 months",
        },
      ],
    },
    teamMembers: [
      {
        id: "29",
        name: "Xavier Lee",
        image: "https://picsum.photos/300/300",
        role: "Project Manager",
      },
      {
        id: "30",
        name: "Yara Singh",
        image: "https://picsum.photos/300/300",
        role: "Technical Lead",
      },
    ],
    fundAllocations: [
      {
        from: "Donations",
        to: "Feasibility Study",
        amount: 16666
      },
      {
        from: "Donations",
        to: "Permit Acquisition",
        amount: 16667
      },
      {
        from: "Donations",
        to: "Water Filter Installation",
        amount: 16667
      }
    ],
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
  const startIndex = Math.floor(Math.random() * (charities.length - 10));
  const endIndex = startIndex + 10;
  return charities.slice(startIndex, endIndex)
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