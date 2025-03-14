export default function AboutCard({ description, successMetrics }: { description: string, successMetrics: string[] }) {
  return (
    <div className="flex flex-col gap-4">
        <div>
        <h2 className='font-bold text-sm mb-1'>About</h2>
        <p className="text-xs">{description}</p>
      </div>
      <div>
        <h2 className="font-bold text-sm mb-1">Success Metrics</h2>
        <ul className="text-xs list-disc list-inside space-y-2">
        {successMetrics.map((metric) => (
          <li key={metric}>{metric}</li>
        ))}
      </ul>
      </div>
    </div>
  );
}
