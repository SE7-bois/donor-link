type UserCardProps = {
    id: string;
    name: string;
    image: string;
    role: string;
}

export default function UserCard({ id, name, image, role }: UserCardProps) {
  return (
    <div className="w-full h-fit flex bg-emphasized-element rounded-md p-4">
      <div>
        <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4" />
      </div>
      <div className="self-center">
        <h1 className="text-xl font-bold  overflow-clip">{name}</h1>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}
