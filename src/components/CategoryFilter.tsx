type CategoryFilterProps = {
    selectedCategory?: string;
    onCategorySelect: (category: string) => void;
}

const categories = [
    "Top Picks",
    "Education",
    "Healthcare",
    "Environment",
    "Animal Welfare",
    "Human Rights & Social Justice",
    "Poverty Alleviation & Economic Development",
    "Arts & Culture",
    "Community Development",
    "Global Issues"
]

export default function CategoryFilter({selectedCategory, onCategorySelect}: CategoryFilterProps) {
    return (
        <div className='bg-emphasized-element text-key-element p-4 rounded-md mb-4'>
            <h2>Categories</h2>
            <div className='flex gap-2 flex-wrap'>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategorySelect(category)}
                        className={`p-2 rounded-md ${
                            selectedCategory === category 
                            ? 'bg-key-element text-emphasized-element' 
                            : 'bg-secondary-element text-key-element'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    )
}