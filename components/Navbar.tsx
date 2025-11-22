
import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const TOP_OFFSET = 66;

interface NavbarProps {
  activeCategory: string;
  onMenuClick: (category: string) => void;
}

export default function Navbar({ activeCategory, onMenuClick }: NavbarProps) {
  const [showBackground, setShowBackground] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { searchQuery, setSearchQuery, toggleChat } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false);
        }
    };
    if (isProfileMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleMenuItemClick = (label: string) => {
    onMenuClick(label);
    setIsMobileMenuOpen(false);
    // Clearing search query is handled by the parent component now
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearchBlur = () => {
      if (searchQuery.trim() === '') {
          setIsSearchOpen(false);
      }
  }

  return (
    <motion.nav 
        initial={{ backgroundColor: 'rgba(20, 20, 20, 0)' }}
        animate={{ backgroundColor: showBackground ? 'rgba(20, 20, 20, 1)' : 'rgba(20, 20, 20, 0)' }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-[70]"
    >
      {/* Gradient overlay that is always present but mostly visible when bg is transparent */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-[-1]" />
      
      <div className="px-4 md:px-12 py-4 flex flex-row items-center">
        <div onClick={() => handleMenuItemClick('Início')} className="mr-8 cursor-pointer block">
          <img 
            src="https://chemorena.com/redfliz.png" 
            alt="RedFlix" 
            className="h-8 md:h-10 object-contain hover:opacity-90 transition-opacity"
          />
        </div>

        <div className="hidden md:flex flex-row gap-6 text-sm text-[#e5e5e5]">
          <NavItem label="Início" active={activeCategory === 'Início'} onClick={() => handleMenuItemClick('Início')} />
          <NavItem label="Séries" active={activeCategory === 'Séries'} onClick={() => handleMenuItemClick('Séries')} />
          <NavItem label="Filmes" active={activeCategory === 'Filmes'} onClick={() => handleMenuItemClick('Filmes')} />
          <NavItem label="Futebol" active={activeCategory === 'Futebol'} onClick={() => handleMenuItemClick('Futebol')} />
          <NavItem label="Canais Ao Vivo" active={activeCategory === 'Canais Ao Vivo'} onClick={() => handleMenuItemClick('Canais Ao Vivo')} />
          <NavItem label="Minha Lista" active={activeCategory === 'Minha Lista'} onClick={() => handleMenuItemClick('Minha Lista')} />
        </div>

        <div className="md:hidden flex flex-row gap-2 text-sm text-white cursor-pointer relative items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className="font-bold">Navegar</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          {isMobileMenuOpen && (
            <div className="absolute top-8 left-0 bg-black/95 border-t-2 border-white flex flex-col w-48 text-center py-2 rounded-b-md shadow-xl z-[80]">
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Início' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Início'); }}>Início</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Séries' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Séries'); }}>Séries</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Filmes' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Filmes'); }}>Filmes</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Futebol' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Futebol'); }}>Futebol</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Canais Ao Vivo' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Canais Ao Vivo'); }}>Canais Ao Vivo</div>
               <div className={`py-3 hover:bg-gray-800 ${activeCategory === 'Minha Lista' ? 'font-bold text-white' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleMenuItemClick('Minha Lista'); }}>Minha Lista</div>
            </div>
          )}
        </div>

        <div className="flex flex-row ml-auto gap-4 md:gap-6 items-center">
          <div className="flex items-center gap-4 transition-all duration-300">
             <AnimatePresence>
                {isSearchOpen && (
                   <motion.div
                       initial={{ width: 0, opacity: 0 }}
                       animate={{ width: 250, opacity: 1 }}
                       exit={{ width: 0, opacity: 0 }}
                       transition={{ duration: 0.3 }}
                       className="relative"
                   >
                       <input
                           ref={searchInputRef}
                           type="text"
                           placeholder="Títulos, gêneros..."
                           className="w-full bg-black/80 border border-white/50 rounded-md py-1.5 pl-4 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onBlur={handleSearchBlur}
                       />
                   </motion.div>
                )}
             </AnimatePresence>
             <div className="cursor-pointer hover:text-gray-300 transition" onClick={() => setIsSearchOpen(prev => !prev)}>
                <Search className="w-5 h-5 md:w-6 md:h-6" />
             </div>
          </div>
          
          <div className="cursor-pointer hover:text-gray-300 transition" onClick={toggleChat} title="Assistente IA">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
          </div>
          
          <div className="cursor-pointer hover:text-gray-300 transition">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          
          <div ref={profileMenuRef} className="relative">
            <div onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex flex-row items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded overflow-hidden border border-transparent group-hover:border-white transition-colors">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : 'rotate-0'} hidden md:block`} />
            </div>
            {isProfileMenuOpen && (
                <div className="absolute top-12 right-0 bg-black/95 border border-white/20 flex flex-col w-48 text-left py-2 rounded-md shadow-xl z-[80] animate-in fade-in duration-150">
                    <ProfileMenuItem label="Gerenciar Perfis" />
                    <ProfileMenuItem label="Conta" />
                    <ProfileMenuItem label="Central de Ajuda" />
                    <div className="border-t border-gray-600 my-1" />
                    <ProfileMenuItem label="Sair da RedFlix" isRed={true} />
                </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

const NavItem = ({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`cursor-pointer transition-colors duration-300 ${active ? 'text-white font-bold' : 'text-gray-300 hover:text-gray-400'}`}
  >
    {label}
  </div>
);

const ProfileMenuItem = ({ label, isRed = false }: { label: string; isRed?: boolean }) => (
    <a href="#" className={`px-4 py-2 text-sm ${isRed ? 'text-red-500' : 'text-gray-300'} hover:bg-gray-800 hover:text-white transition-colors block w-full text-left`}>
        {label}
    </a>
);
