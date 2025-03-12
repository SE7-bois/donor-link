import { Progress } from "./ui/progress";

export default function DetailCard({ targetAmount, currentAmount, dueDate }: DetailCardProps) {

  const percentage = (currentAmount / targetAmount) * 100;
  const endDate = new Date(dueDate);
  const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="grid grid-cols-2 place-items-center bg-emphasized-element rounded-md p-2">
      <div className="col-span-2 flex justify-between">
        <p>{currentAmount} raised</p>
        <p>{percentage}%</p>
      </div>
      <div className="col-span-2">
        <p>of {targetAmount} goal</p>
      </div>
      <Progress value={percentage} className="col-span-2 rounded-md"/>
      <div className="col-span-2 flex justify-around">
        <p>Ends {remainingDays}</p>
        <p>{remainingDays === 0 ? "Today" : "Days left"}</p>
      </div>
    </div>
  )

}

type DetailCardProps = {
  targetAmount: number;
  currentAmount: number;
  dueDate: Date
}