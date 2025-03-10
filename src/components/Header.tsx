import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useState } from "react";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [_, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`mb-4 w-full p-4 flex bg-background/50 backdrop-blur-sm justify-between items-center ${isSticky ? 'sticky top-0 z-50' : ''}`}>
        <div>
            <Link to="/" className="text-lg font-bold">Donor Link</Link>
        </div>
        <div className="flex gap-4 items-center font-bold text-secondary-element">
            <Link to="/app" activeProps={{className: "text-key-element"}}>For Donors</Link>
            <Link to="/app" activeProps={{className: "text-key-element"}}>Create Fundraiser</Link>
            <button className="px-4 py-2 bg-emphasized-element text-key-element font-bold rounded-md hover:bg-key-element hover:text-emphasized-element transition-colors">Connect Wallet</button>
        </div>
    </header>
  )
}
