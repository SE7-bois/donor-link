import CharityCard from '@/components/CharityCard'
import CategoryFilter from '@/components/CategoryFilter'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/app/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>();

  return (
    <>
        <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
        />
        <div>
            <CharityCard />
            <CharityCard />
            <CharityCard />
            <CharityCard />
            <CharityCard />
            <CharityCard />
            <CharityCard />
            <CharityCard />
        </div>
    </>
  )
}
