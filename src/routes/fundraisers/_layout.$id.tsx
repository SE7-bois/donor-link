import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getFundraiserDetail } from '@/data/fundraisers'
import { AspectRatio } from '@/components/ui/aspect-ratio';
import DetailCard from '@/components/DetailCard';
import DonateCard from '@/components/DonateCard';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AboutCard from '@/components/AboutCard';
import PlanCard from '@/components/PlanCard';
import UserCard from '@/components/UserCard';
import SankeyChart from '@/components/SankeyChart';

const formatValue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const Route = createFileRoute('/fundraisers/_layout/$id')({
  component: RouteComponent,
  loader: ({params}) => getFundraiserDetail(params.id)
})

function RouteComponent() {
  const fundraiser = useLoaderData({from: '/fundraisers/_layout/$id'})!;
  const active = new Date(fundraiser.dueDate) > new Date();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className='flex flex-col gap-8'>
      {/* Image Gallery Section */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        <div className='lg:col-span-3 space-y-4'>
          <AspectRatio ratio={16 / 9}>
            <img 
              src={fundraiser.images[activeImageIndex]} 
              className="object-cover w-full h-full rounded-md transition-all duration-300" 
              alt={`${fundraiser.title} - Image ${activeImageIndex + 1}`}
            />
          </AspectRatio>
          
          <div className='relative'>
            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-key-element/50 scrollbar-track-emphasized-element hover:scrollbar-thumb-key-element/80'>
              {fundraiser.images.map((image, index) => (
                <div key={index} className="shrink-0 p-1">
                  <button 
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-[100px] md:w-[150px] rounded-sm overflow-hidden transition-all duration-300 ${
                      activeImageIndex === index 
                        ? 'ring-2 ring-offset-2 ring-offset-background ring-key-element' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={image} 
                        className="object-cover w-full h-full" 
                        alt={`${fundraiser.title} - Preview ${index + 1}`}
                      />
                    </AspectRatio>
                  </button>
                </div>
              ))}
            </div>
          </div> 
        </div>
        
        <div className='space-y-8'>
          <h1 className='font-bold'>{fundraiser.title}</h1>
          <DetailCard targetAmount={fundraiser.targetAmount} currentAmount={fundraiser.currentAmount} dueDate={fundraiser.dueDate} />
          <DonateCard status={active} />
        </div>
      </div>
      
      <Tabs defaultValue="about" className='col-span-4'>
        <TabsList className='w-full bg-emphasized-element mb-4'>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="fundAllocation">Fund Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <AboutCard 
            description={fundraiser.description}
            successMetrics={fundraiser.successMetrics}
          />
        </TabsContent>
        <TabsContent value="plan" className="space-y-4">
          <h2 className='text-xl font-bold text-key-element'>Timeline</h2>
          <PlanCard plan={fundraiser.plan} />
        </TabsContent>
        <TabsContent value="team">
          <h2 className='font-bold text-secondary-element'>Meet Our Team</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {fundraiser.teamMembers.map(member => (
              <UserCard key={member.id} {...member} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="fundAllocation">
          <div className="space-y-8">
            <SankeyChart data={fundraiser.fundAllocations} />
            <div className="space-y-4">
              {fundraiser.fundAllocations.map((allocation, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-emphasized-element rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-key-element">{allocation.from} → {allocation.to}</p>
                    <p className="text-sm text-secondary-element">{formatValue(allocation.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
