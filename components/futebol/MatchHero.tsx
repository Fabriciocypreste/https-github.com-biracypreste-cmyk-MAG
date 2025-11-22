
import React from 'react';
import { Match } from '../../types/futebol';
import { MonitorPlay, Ticket } from 'lucide-react';

interface MatchHeroProps {
  match: Match | null;
}

const MatchHero: React.FC<MatchHeroProps> = ({ match }) => {
  if (!match) {
    return <div className="h-[450px] bg-background animate-pulse" />;
  }

  const homeColor = match.homeTeam.primaryColor || '#333';
  const awayColor = match.awayTeam.primaryColor || '#555';

  return (
    <div 
      className="relative h-[450px] w-full flex items-center justify-center text-white overflow-hidden"
      style={{
        background: `linear-gradient(to right, ${homeColor}99, #141414 40%, #141414 60%, ${awayColor}99)`
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#141414] to-transparent" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-around text-center px-4">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-left-10 duration-500">
          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110" />
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">{match.homeTeam.name}</h2>
        </div>

        {/* Match Info */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-7xl md:text-9xl font-black text-gray-300 drop-shadow-lg animate-in fade-in zoom-in-50 duration-500">VS</span>
          <div className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 mt-2">
            <div className="font-bold text-lg">{match.date}, {match.time}</div>
            <div className="text-xs text-gray-400">{match.competition}</div>
          </div>
          {match.status === 'live' && (
             <div className="mt-4 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 font-bold text-sm uppercase">AO VIVO</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500">
          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110" />
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">{match.awayTeam.name}</h2>
        </div>
      </div>

      <div className="absolute bottom-10 z-20 flex gap-4">
        <button className="bg-red-600 text-white rounded-lg flex items-center gap-2 px-6 py-3 hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg font-bold">
            <MonitorPlay className="w-5 h-5" />
            Assistir Ao Vivo
        </button>
        <a href={`/futebol/partida/${match.id}`} className="bg-white/10 backdrop-blur-md text-white rounded-lg flex items-center gap-2 px-6 py-3 hover:bg-white/20 transition-all duration-300 hover:scale-105 font-bold border-2 border-transparent hover:border-[#FFD700]">
            <Ticket className="w-5 h-5" />
            Detalhes
        </a>
      </div>
    </div>
  );
};

export default MatchHero;
