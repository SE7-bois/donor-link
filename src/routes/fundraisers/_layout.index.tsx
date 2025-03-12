import CharityCard from '@/components/CharityCard'
import CategoryFilter from '@/components/CategoryFilter'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getFundraisersPreview, getFundraiserByCategory } from '@/data/fundraisers'
import type { FundraiserPreview } from '@/data/fundraisers'

export const Route = createFileRoute('/fundraisers/_layout/')({
  component: RouteComponent,
  loader: () => getFundraisersPreview()
})

function RouteComponent() {

  const [selectedCategory, setSelectedCategory] = useState<string>("Top Picks");
  const allFundraisers = useLoaderData({from: '/fundraisers/_layout/'})!;
  const [filteredFundraisers, setFilteredFundraisers] = useState<FundraiserPreview[]>(allFundraisers);

  useEffect(() => {
    const fetchByCategories = async () => {
      if (selectedCategory === "Top Picks") {
        setFilteredFundraisers(allFundraisers);
      } else {
        const filtered = await getFundraiserByCategory(selectedCategory);
        setFilteredFundraisers(filtered || []);
      }
    };

    void fetchByCategories();
  }, [selectedCategory, allFundraisers]);
  
  return (
    <>
        <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
        />
        <div className='grid grid-cols-2 scrollbar-thin scrollbar-thumb-key-element scrollbar-track-emphasized-element md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filteredFundraisers.map((fundraiser) => (
                <CharityCard key={fundraiser.id} {...fundraiser} />
            ))}
        </div>
    </>
  )
}