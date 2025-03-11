import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getFundraiser } from '@/data/fundraisers'

export const Route = createFileRoute('/fundraisers/_layout/$id')({
  component: RouteComponent,
  loader: ({params}) => getFundraiser(params.id)
})

function RouteComponent() {
  const fundraiser = useLoaderData({from: '/fundraisers/_layout/$id'})!;
  return (
    <div>
      <p>{fundraiser.title}</p>
      <p>{fundraiser.description}</p>
      <p>{fundraiser.image}</p>
      <p>{fundraiser.targetAmount}</p>
      <p>{fundraiser.currentAmount}</p>
      <p>{fundraiser.category}</p>
      <p>{fundraiser.fundraiserName}</p>
    </div>
  )
}
