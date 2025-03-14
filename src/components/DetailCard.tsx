import { Progress } from "./ui/progress";

export default function DetailCard({ targetAmount, currentAmount, dueDate }: DetailCardProps) {
  const percentage = (currentAmount / targetAmount) * 100;
  const endDate = new Date(dueDate);
  const now = new Date();
  
  const monthsDiff = (endDate.getFullYear() - now.getFullYear()) * 12 + 
                    (endDate.getMonth() - now.getMonth());
  
  const daysDiff = endDate.getDate() - now.getDate();
  const adjustedMonthsDiff = daysDiff < 0 ? monthsDiff - 1 : monthsDiff;

  let durationLeft;
  if (adjustedMonthsDiff < 0) {
    durationLeft = "Ended";
  } else if (adjustedMonthsDiff === 0) {
    durationLeft = "Ending this month";
  } else if (adjustedMonthsDiff === 1) {
    durationLeft = "1 month left";
  } else {
    durationLeft = `${adjustedMonthsDiff} months left`;
  }

  const targetAmountFormatted = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(targetAmount);
  const currentAmountFormatted = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentAmount);

  return (
    <div className="grid grid-cols-2 place-items-center bg-emphasized-element rounded-md px-2 py-4 text-sm">
        <p className="justify-self-start font-bold text-key-element">{currentAmountFormatted} raised</p>
        <p className="justify-self-end text-secondary-element">{percentage.toFixed(0)}%</p> 
        <p className="col-span-2 justify-self-start text-secondary-element mb-4">of {targetAmountFormatted} goal</p>
        <Progress value={percentage} className="col-span-2 rounded-md my-4 bg-background"/>
        <p className="justify-self-start text-secondary-element">Ends {endDate.toLocaleDateString()}</p>
        <p className="justify-self-end text-secondary-element">{durationLeft}</p>
    </div>
  )
}

type DetailCardProps = {
  targetAmount: number;
  currentAmount: number;
  dueDate: Date
}