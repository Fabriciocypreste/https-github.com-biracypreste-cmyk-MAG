import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Tv, Film, CreditCard, Settings, 
  Trophy, ChevronDown, ChevronRight, LogOut, Shield, Globe, Flag, FileJson, ListVideo
} from 'lucide-react';

export const Sidebar = () => {
  const [futebolOpen, setFutebolOpen] = useState(true);

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 h-screen flex flex-col text-gray-300 shadow-2xl z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 bg-black/20">
        <img 
          src="https://chemorena.com/redfliz.png" 
          alt="Stream Admin" 
          className="h-8 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal</div>
        <NavItem icon={<LayoutDashboard />} label="Dashboard" href="/admin/dashboard" />
        <NavItem icon={<Users />} label="Assinantes" href="/admin/users" />
        
        {/* Futebol Module Group */}
        <div className="pt-4 pb-1">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Esportes</div>
          <button 
            onClick={() => setFutebolOpen(!futebolOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-white/5 hover:text-white group transition-colors"
          >
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-3 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
              <span>Futebol</span>
            </div>
            {futebolOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          </button>
          
          {futebolOpen && (
            <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-white/10">
              <SubNavItem icon={<Shield />} label="Série A" href="/admin/futebol/serie-a" />
              <SubNavItem icon={<Globe />} label="Libertadores" href="/admin/futebol/libertadores" />
              <SubNavItem icon={<Flag />} label="Seleção Brasileira" href="/admin/futebol/selecao" />
              <SubNavItem icon={<FileJson />} label="Gerador JSON" href="/admin/futebol/json-generator" />
            </div>
          )}
        </div>

        <div className="pt-4">
            <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Conteúdo</div>
            <NavItem icon={<ListVideo />} label="Gerenciar M3U" href="/admin/m3u-playlist" />
            <NavItem icon={<Tv />} label="Canais Ao Vivo" href="/admin/live-channels" />
            <NavItem icon={<Film />} label="Biblioteca VOD" href="/admin/vod" />
        </div>

        <div className="pt-4">
            <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistema</div>
            <NavItem icon={<CreditCard />} label="Financeiro" href="/admin/finance" />
            <NavItem icon={<Settings />} label="Configurações" href="/admin/settings" />
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Administrador</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
            </p>
          </div>
        </div>
        <a 
            href="/" 
            className="flex items-center justify-center w-full py-2.5 bg-white/5 hover:bg-red-600/20 text-gray-300 hover:text-red-500 rounded-lg transition-all duration-200 text-sm font-bold gap-2 border border-white/5 hover:border-red-500/30 group"
        >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Site
        </a>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, href }: { icon: any, label: string, href: string }) => {
    const isActive = window.location.pathname === href;
    return (
        <a 
            href={href} 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group relative
            ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'hover:bg-white/5 hover:text-white text-gray-400'}`}
        >
            {React.cloneElement(icon, { className: `w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}` })}
            {label}
            {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"></div>}
        </a>
    );
};

const SubNavItem = ({ icon, label, href }: { icon: any, label: string, href: string }) => {
    const isActive = window.location.pathname === href;
    return (
        <a 
            href={href} 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 group
            ${isActive ? 'text-white bg-white/5 font-medium' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
        >
            {React.cloneElement(icon, { className: `w-4 h-4 transition-colors ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-white'}` })}
            {label}
        </a>
    );
};