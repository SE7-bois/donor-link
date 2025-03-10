import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center">
        <div>
            <Link to="/" className="text-lg font-bold">Donor Link</Link>
        </div>
        <div className="flex gap-4 items-center">
            <Link to="/" activeProps={{className: "font-bold"}} activeOptions={{exact: true}}>For Donors</Link>
            <Link to="/" activeProps={{className: "font-bold"}}>Create Fundraiser</Link>
            <button className="px-4 py-2 bg-emphasized-element text-key-element font-bold rounded-md hover:bg-key-element hover:text-emphasized-element transition-colors">Connect Wallet</button>
        </div>
    </header>
  )
}
