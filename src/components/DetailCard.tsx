import { Progress } from "./ui/progress";

export default function DetailCard({ targetAmount, currentAmount, dueDate }: DetailCardProps) {

  const percentage = (currentAmount / targetAmount) * 100;
  const endDate = new Date(dueDate);
  const durationInMonths = endDate.getMonth() - new Date().getMonth();
  const durationLeft = durationInMonths < 0 ? "Ended" : `${durationInMonths} months left`;
  const targetAmountFormatted = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(targetAmount);
  const currentAmountFormatted = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentAmount);

  return (
    <div className="grid grid-cols-2 place-items-center bg-emphasized-element rounded-md p-2 text-sm">
        <p className="justify-self-start font-bold text-key-element">{currentAmountFormatted} raised</p>
        <p className="justify-self-end text-secondary-element">{percentage.toFixed(0)}%</p> 
        <p className="col-span-2 justify-self-start text-secondary-element mb-4">of {targetAmountFormatted} goal</p>
        <Progress value={percentage} className="col-span-2 rounded-md mb-2 bg-background"/>
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