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
    "Human Rights",
    "Economic Development",
    "Arts & Culture",
    "Community",
    "Global Issues"
]

export default function CategoryFilter({selectedCategory, onCategorySelect}: CategoryFilterProps) {
    return (
        <div className='bg-emphasized-element text-key-element p-4 rounded-md mb-4'>
            <h2 className="font-bold mb-3">Categories</h2>
            <div className='overflow-x-auto md:overflow-x-visible'>
                <div className='flex gap-2 flex-nowrap md:flex-wrap whitespace-nowrap pb-2 md:pb-0' 
                     style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    {categories.map((category) => (
                        <button 
                            key={category}
                            onClick={() => onCategorySelect(category)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors shrink-0 ${
                                selectedCategory === category 
                                ? 'bg-key-element text-emphasized-element font-bold' 
                                : 'bg-secondary-element text-key-element hover:bg-secondary-element/80'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}