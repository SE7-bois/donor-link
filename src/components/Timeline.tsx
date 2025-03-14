interface TimelineItemProps {
  title: string;
  description: string;
  duration: string;
}

interface TimelineProps {
  items: TimelineItemProps[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative pl-8 space-y-8">
      {/* Vertical line */}
      <div className="absolute left-2.5 top-3 bottom-3 w-[2px] bg-secondary-element/30" />
      
      {/* Timeline items */}
      {items.map((item, index) => (
        <div key={index} className="relative">
          {/* Circle marker */}
          <div className="absolute -left-8 top-1.5 w-5 h-5 rounded-full border-2 border-secondary-element/30 bg-emphasized-element" />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="text-base font-medium text-key-element">{item.title}</h3>
              <p className="text-sm text-secondary-element">{item.description}</p>
            </div>
            <span className="text-sm text-secondary-element whitespace-nowrap">
              {item.duration}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 