
import React from 'react';
import { Standing } from '../../types/futebol';

interface StandingsTableProps {
  standings: Standing[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
    if (!standings || standings.length === 0) return null;

    return (
        <div className="px-[4%] md:px-[60px] py-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6">Brasileirão Série A - Tabela</h2>
            <div className="bg-[#1E1E1E] rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            <th className="py-3 px-4">Clube</th>
                            <th className="py-3 px-4 text-center">P</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">J</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">V</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">E</th>
                            <th className="py-3 px-4 text-center hidden md:table-cell">D</th>
                            <th className="py-3 px-4 text-center">SG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((s, index) => (
                            <tr key={s.team.id} className="border-t border-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/30 cursor-pointer group">
                                <td className="py-3 px-4 text-center text-sm font-medium text-gray-300">
                                    <div className="flex items-center justify-center gap-2">
                                        {s.position}
                                        {index < 4 && <div className="w-1 h-4 bg-green-500 rounded-full" title="Zona de Libertadores"></div>}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <img src={s.team.logoUrl} alt={s.team.name} className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-125" />
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

export default StandingsTable;
