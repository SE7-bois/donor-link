export const charities = [
    {
      id: "1",
      title: "Charity 1",
      description: "Description 1",
      fundraiserName: "Fundraiser 1",
      category: "Category 1",
      targetAmount: 1000,
      currentAmount: 500,
      image: "https://picsum.photos/300/169"
    },
    {
      id: "2",
      title: "Charity 2",
      description: "Description 2",
      fundraiserName: "Fundraiser 2",
      category: "Category 2",
      targetAmount: 2000,
      currentAmount: 1000,
      image: "https://picsum.photos/300/169"
    },
    {
      id: "3",
      title: "Charity 3",
      description: "Description 3",
      fundraiserName: "Fundraiser 3",
      category: "Category 3",
      targetAmount: 3000,
      currentAmount: 2000,
      image: "https://picsum.photos/300/169"
    },
    {
      id: "4",
      title: "Charity 4",
      description: "Description 4",
      fundraiserName: "Fundraiser 4",
      category: "Category 4",
      targetAmount: 4000,
      currentAmount: 3000,
      image: "https://picsum.photos/300/169"
    },
]

export const getFundraiser = (id: string) => {
    return charities.find((charity) => charity.id === id);
}