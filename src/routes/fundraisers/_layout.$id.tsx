import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getFundraiserDetail } from '@/data/fundraisers'
import { AspectRatio } from '@/components/ui/aspect-ratio';
import DetailCard from '@/components/DetailCard';

export const Route = createFileRoute('/fundraisers/_layout/$id')({
  component: RouteComponent,
    loader: ({params}) => getFundraiserDetail(params.id)
})

function RouteComponent() {
  
  const fundraiser = useLoaderData({from: '/fundraisers/_layout/$id'})!;

  return (
    <div className='grid grid-cols-4 gap-4'>
      <div className='col-span-3'>
        <AspectRatio ratio={16 / 9}>
          <img src={fundraiser.images[0]} />
        </AspectRatio>
      </div>
      <div>
        <p>{fundraiser.title}</p>
        <DetailCard targetAmount={fundraiser.targetAmount} currentAmount={fundraiser.currentAmount} dueDate={fundraiser.dueDate} />
      </div>
    </div>
  )
}
