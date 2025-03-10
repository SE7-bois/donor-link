import { AspectRatio } from "./ui/aspect-ratio";
import { Progress } from "./ui/progress";

export default function CharityCard({
    title,
    description,
    fundraiserName,
    category,
    targetAmount,
    currentAmount,
    image
}: CharityCardProps) {
    const progress = (currentAmount / targetAmount) * 100;
    return (
        <div className="w-full bg-emphasized-element rounded-md overflow-hidden shadow-lg hover:shadow-key-element/20 transition-all duration-300 group">
            <AspectRatio ratio={16 / 9}>
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </AspectRatio>
            <Progress value={progress} className="bg-none"/>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold line-clamp-2">{title}</h3>
                    <p className="text-secondary-element text-xs shrink-0 ml-2">{category}</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <p className="text-secondary-element text-xs">{fundraiserName}</p>
                    <p className="text-secondary-element text-xs">${currentAmount.toLocaleString()} / ${targetAmount.toLocaleString()}</p>
                </div>
                <p className="text-sm text-secondary-element line-clamp-3">{description}</p>
            </div>
        </div>
    )
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