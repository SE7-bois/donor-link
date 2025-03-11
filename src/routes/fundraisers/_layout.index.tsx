import CharityCard from '@/components/CharityCard'
import CategoryFilter from '@/components/CategoryFilter'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useState } from 'react'
import { charities, getFundraisersPreview } from '@/data/fundraisers'

export const Route = createFileRoute('/fundraisers/_layout/')({
  component: RouteComponent,
  loader: () => getFundraisersPreview()
})

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const fundraisersPreview = useLoaderData({from: '/fundraisers/_layout/'})!;
  
  return (
    <>
        <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {fundraisersPreview.map((fundraiser) => (
                <CharityCard key={fundraiser.id} {...fundraiser} />
            ))}
        </div>
    </>
  )
}
// TODO: Differentiate between getFundraisersPreview and getFundraiserDetail(id)