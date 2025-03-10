import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`mb-4 w-full p-4 bg-background/50 backdrop-blur-sm ${isSticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="relative">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-lg font-bold">Donor Link</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center font-bold text-secondary-element">
            <Link to="/app" activeProps={{className: "text-key-element"}}>For Donors</Link>
            <Link to="/app" activeProps={{className: "text-key-element"}}>Create Fundraiser</Link>
            <button className="px-4 py-2 bg-emphasized-element text-key-element font-bold rounded-md hover:bg-key-element hover:text-emphasized-element transition-colors">
              Connect Wallet
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-secondary-element active:bg-emphasized-element active:text-key-element active:rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation - Now absolutely positioned */}
        <div className={`md:hidden absolute left-0 right-0 top-[calc(100%+1rem)] bg-background/95 backdrop-blur-sm rounded-md shadow-lg transform transition-all duration-200 ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <nav className="flex flex-col p-4 gap-4 items-start font-bold text-secondary-element">
            <Link 
              to="/app" 
              activeProps={{className: "text-key-element"}}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For Donors
            </Link>
            <Link 
              to="/app" 
              activeProps={{className: "text-key-element"}}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Fundraiser
            </Link>
            <button className="w-full px-4 py-2 bg-emphasized-element text-key-element font-bold rounded-md hover:bg-key-element hover:text-emphasized-element transition-colors">
              Connect Wallet
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}