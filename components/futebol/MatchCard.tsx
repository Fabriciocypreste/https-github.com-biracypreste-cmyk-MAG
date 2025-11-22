
import React from 'react';
import { Match } from '../../types/futebol';
import { Tv } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <a href={`/futebol/partida/${match.id}`} className="block group">
        <div className="relative flex-shrink-0 w-[300px] h-[180px] bg-[#1E1E1E] rounded-lg border-2 border-white/10 overflow-hidden shadow-lg hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105">
        <div className="p-4 flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{match.competition}</span>
            <span className="flex items-center gap-1.5">
                <Tv className="w-3 h-3" /> {match.broadcastChannel}
            </span>
            </div>

            {/* Teams */}
            <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2 w-2/5">
                <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-bold text-center truncate w-full">{match.homeTeam.name}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-lg font-mono text-gray-500">VS</span>
                {match.status === 'live' && (
                <span className="mt-1 text-xs font-bold text-red-500 animate-pulse">AO VIVO</span>
                )}
            </div>
            <div className="flex flex-col items-center gap-2 w-2/5">
                <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-bold text-center truncate w-full">{match.awayTeam.name}</span>
            </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-300 font-medium">
            {match.date}, {match.time}
            </div>
        </div>
        </div>
    </a>
  );
};

export default MatchCard;
