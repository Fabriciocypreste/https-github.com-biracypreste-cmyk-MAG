import React, { useEffect, useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const TOP_OFFSET = 66;

interface NavbarProps {
  activeCategory: string;
  onMenuClick: (category: string) => void;
}

export default function Navbar({ activeCategory, onMenuClick }: NavbarProps) {
  const [showBackground, setShowBackground] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuItemClick = (label: string) => {
    onMenuClick(label);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-[70] transition-colors duration-500 ${showBackground ? 'bg-background' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex flex-row items-center transition-all duration-500">
        {/* Logo */}
        <div onClick={() => handleMenuItemClick('Início')} className="mr-8 cursor-pointer block">
          <img 
            src="https://chemorena.com/redfliz.png" 
            alt="RedFlix" 
            className="h-8 md:h-10 object-contain hover:opacity-90 transition-opacity"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-row gap-6 text-sm text-[#e5e5e5]">
          <NavItem label="Início" active={activeCategory === 'Início'} onClick={() => handleMenuItemClick('Início')} />
          <NavItem label="Séries" active={activeCategory === 'Séries'} onClick={() => handleMenuItemClick('Séries')} />
          <NavItem label="Filmes" active={activeCategory === 'Filmes'} onClick={() => handleMenuItemClick('Filmes')} />
          <NavItem label="Canais Ao Vivo" active={activeCategory === 'Canais Ao Vivo'} onClick={() => handleMenuItemClick('Canais Ao Vivo')} />
          <NavItem label="Bombando" active={activeCategory === 'Bombando'} onClick={() => handleMenuItemClick('Bombando')} />
          <NavItem label="Minha Lista" active={activeCategory === 'Minha Lista'} onClick={() => handleMenuItemClick('Minha Lista')} />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex flex-row gap-2 text-sm text-white cursor-pointer relative items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className="font-bold">Navegar</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          
          {isMobileMenuOpen && (
            <div className="absolute top-8 left-0 bg-black/95 border-t-2 border-white flex flex-col w-48 text-center py-2 rounded-b-md shadow-xl z-[80]">
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Início' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Início'); }}>Início</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Séries' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Séries'); }}>Séries</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Filmes' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Filmes'); }}>Filmes</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Canais Ao Vivo' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Canais Ao Vivo'); }}>Canais Ao Vivo</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Bombando' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Bombando'); }}>Bombando</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Minha Lista' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Minha Lista'); }}>Minha Lista</div>
            </div>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex flex-row ml-auto gap-4 md:gap-6 items-center">
          <div className="cursor-pointer hover:text-gray-300 transition">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="cursor-pointer hover:text-gray-300 transition">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          
          {/* Profile Dropdown Trigger */}
          <div className="flex flex-row items-center gap-2 cursor-pointer group relative">
            <div className="w-8 h-8 rounded overflow-hidden border border-transparent group-hover:border-white transition-colors">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <ChevronDown className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-180 hidden md:block" />
          </div>
        </div>
      </div>
    </nav>
  );
}

// FIX: Added the NavItem component definition to resolve the 'Cannot find name' errors.
const NavItem = ({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`cursor-pointer transition-colors duration-300 ${active ? 'text-white font-bold' : 'text-gray-300 hover:text-gray-400'}`}
  >
    {label}
  </div>
);