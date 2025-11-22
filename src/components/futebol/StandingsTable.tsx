import React from 'react';
import { Standing } from '../../types/futebol';

interface StandingsTableProps {
  standings: Standing[];
  highlightTeamId?: string;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, highlightTeamId }) => {
    if (!standings || standings.length === 0) return null;

    const getRowClass = (position: number) => {
        if (position <= 4) return 'border-l-4 border-green-500'; // Libertadores
        if (position <= 6) return 'border-l-4 border-blue-500'; // Pré-Libertadores
        if (position <= 12) return 'border-l-4 border-yellow-500'; // Sul-Americana
        if (position >= 17) return 'border-l-4 border-red-500'; // Rebaixamento
        return 'border-l-4 border-transparent';
    };

    return (
        <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-0 overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="py-3 px-4 w-16 text-center">#</th>
                            <th className="py-3 px-4">Clube</th>
                            <th className="py-3 px-4 text-center font-bold">P</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">J</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">V</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">E</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">D</th>
                            <th className="py-3 px-4 text-center">SG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((s) => (
                            <tr 
                                key={s.team.id} 
                                className={`
                                    border-t border-white/5 transition-colors 
                                    ${s.team.id === highlightTeamId ? 'bg-red-500/10' : 'hover:bg-white/5'}
                                    ${getRowClass(s.position)}
                                `}
                            >
                                <td className="py-3 px-4 text-center text-sm font-medium text-gray-300">
                                    {s.position}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <img src={s.team.logoUrl} alt={s.team.name} className="w-6 h-6 object-contain" />
                                        <span className="font-bold text-sm text-white truncate">{s.team.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center font-bold text-white text-sm">{s.points}</td>
                                <td className="py-3 px-4 text-center text-sm text-gray-400 hidden md:table-cell">{s.played}</td>
                                <td className="py-3 px-4 text-center text-sm text-gray-400 hidden md:table-cell">{s.wins}</td>
                                <td className="py-3 px-4 text-center text-sm text-gray-400 hidden md:table-cell">{s.draw}</td>
                                <td className="py-3 px-4 text-center text-sm text-gray-400 hidden md:table-cell">{s.losses}</td>
                                <td className={`py-3 px-4 text-center text-sm font-medium ${s.goalDifference > 0 ? 'text-green-400' : s.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                    {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};