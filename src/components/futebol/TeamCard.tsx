
import React from 'react';
import { Team } from '../../types/futebol';
import { MapPin } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  href?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, href }) => {
  // Default colors if not provided
  const primary = team.primaryColor || '#333333';
  const secondary = team.secondaryColor || '#000000';

  const content = (
    <>
      {/* Dynamic Background Gradient */}
      <div 
        className="absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-15"
        style={{ 
            background: `linear-gradient(135deg, ${primary}, ${secondary})` 
        }}
      />

      {/* Top Gradient Border */}
      <div 
        className="absolute top-0 left-0 w-full h-1.5 shadow-sm z-10"
        style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }}
      />

      {/* Logo Container */}
      <div className="w-32 h-32 relative flex items-center justify-center p-6 rounded-full bg-black/20 backdrop-blur-sm border border-white/5 transition-transform duration-300 group-hover:scale-110 z-10 shadow-inner">
        <img 
          src={team.logoUrl}
          alt={`${team.name} Logo`} 
          className="w-full h-full object-contain drop-shadow-xl relative z-10" 
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="text-center w-full relative z-10 flex flex-col items-center gap-2 mt-2">
        <h3 className="font-bold text-white text-xl leading-tight group-hover:text-gray-200 transition-colors px-2">
          {team.name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[160px]">{team.stadium || 'Estádio N/A'}</span>
        </div>
      </div>

      {/* Color Indicators */}
      <div className="flex items-center gap-2 mt-4 relative z-10 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
         <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: primary }} title="Cor Primária" />
         <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: secondary }} title="Cor Secundária" />
      </div>
    </>
  );
  
  const Component = href ? 'a' : 'div';
  const componentProps = href ? { href } : {};

  return (
    <Component
      {...componentProps}
      className="group relative bg-[#1E1E1E] rounded-xl p-6 flex flex-col items-center gap-4 border-2 border-transparent hover:border-[#FFD700] overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
    >
      {content}
    </Component>
  );
};
