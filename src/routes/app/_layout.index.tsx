import CharityCard from '@/components/CharityCard'
import CategoryFilter from '@/components/CategoryFilter'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/app/_layout/')({
  component: RouteComponent,
})

const charities = [
  {
    title: "Charity 1",
    description: "Description 1",
    fundraiserName: "Fundraiser 1",
    category: "Category 1",
    targetAmount: 1000,
    currentAmount: 500,
    image: "https://picsum.photos/300/169"
  },
  {
    title: "Charity 2",
    description: "Description 2",
    fundraiserName: "Fundraiser 2",
    category: "Category 2",
    targetAmount: 2000,
    currentAmount: 1000,
    image: "https://picsum.photos/300/169"
  },
  {
    title: "Charity 3",
    description: "Description 3",
    fundraiserName: "Fundraiser 3",
    category: "Category 3",
    targetAmount: 3000,
    currentAmount: 2000,
    image: "https://picsum.photos/300/169"
  },
  {
    title: "Charity 4",
    description: "Description 4",
    fundraiserName: "Fundraiser 4",
    category: "Category 4",
    targetAmount: 4000,
    currentAmount: 3000,
    image: "https://picsum.photos/300/169"
  },
]

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>();

  return (
    <>
        <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {charities.map((charity) => (
                <CharityCard key={charity.title} {...charity} />
            ))}
        </div>
    </>
  )
}