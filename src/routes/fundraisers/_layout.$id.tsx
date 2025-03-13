import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getFundraiserDetail } from '@/data/fundraisers'
import { AspectRatio } from '@/components/ui/aspect-ratio';
import DetailCard from '@/components/DetailCard';
import DonateCard from '@/components/DonateCard';

export const Route = createFileRoute('/fundraisers/_layout/$id')({
  component: RouteComponent,
  loader: ({params}) => getFundraiserDetail(params.id)
})

function RouteComponent() {
  const fundraiser = useLoaderData({from: '/fundraisers/_layout/$id'})!;
  const isActive = new Date(fundraiser.dueDate) > new Date();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-2 relative z-0'>
      <div className='lg:col-span-3'>
        <AspectRatio ratio={16 / 9}>
          <img src={fundraiser.images[0]} className="object-cover w-full h-full rounded-md" />
        </AspectRatio>
        
        <div className='mt-4 relative'>
          <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-key-element scrollbar-track-emphasized-element'>
            {fundraiser.images.slice(1).map((image, index) => (
              <div key={index} className='shrink-0 w-[100px] md:w-[150px]'>
                <AspectRatio ratio={16 / 9}>
                  <img src={image} className="object-cover w-full h-full rounded-sm" />
                </AspectRatio>
              </div>
            ))}
          </div>
        </div> 
      </div>
      
      <div className='space-y-4'>
        <h1 className='font-bold'>{fundraiser.title}</h1>
        <DetailCard targetAmount={fundraiser.targetAmount} currentAmount={fundraiser.currentAmount} dueDate={fundraiser.dueDate} />
        <DonateCard status={isActive} />
      </div>
    </div>
  )
}
