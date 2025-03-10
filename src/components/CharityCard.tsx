export default function CharityCard({title, description, fundraiserName, category, targetAmount, currentAmount, image}: CharityCardProps) {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}

type CharityCardProps = {
    title: string;
    description: string;
    fundraiserName: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
    image: string;
}