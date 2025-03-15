import Timeline from './Timeline';

type TimelineItemProps = {
    title: string;
    description: string;
    duration: string;
}

type PlanProps = {
    plan: string;
    timeline: TimelineItemProps[];
}

export default function PlanCard({ plan }: { plan: PlanProps }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-bold text-secondary-element mb-2">Timeline</h3>
        <Timeline items={plan.timeline} />
      </div>
    </div>
  );
}