import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getFeaturedCharities } from '@/data/fundraisers'
import CharityCard from '@/components/CharityCard'
import type { Fundraiser } from '@/data/fundraisers'

export const Route = createFileRoute('/_layout/')({
  component: HomeComponent,
})

function HomeComponent() {
  const featuredCharities: Fundraiser[] = getFeaturedCharities()

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className='text-center text-xl w-[70%] lg:w-[40%]'>
        <h1 className='font-bold'>Turn Your Capital Gain into Charitable Impact</h1>
        <p>Donate to your favorite causes without converting your crypto assets to fiat first.</p>
      </div>

      <div className='w-full space-y-4'>
        <h2 className='text-center font-bold'>Featured Charities</h2>
        <div className='relative'>
          <div className='flex gap-6 overflow-x-auto pb-6 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-key-element scrollbar-track-emphasized-element'>
            {featuredCharities.map((charity) => (
              <div key={charity.id} className="snap-start w-[300px] shrink-0  bg-emphasized-element rounded-md">
                <CharityCard {...charity} image={charity.images[0]}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    
    </div>
  )
}
