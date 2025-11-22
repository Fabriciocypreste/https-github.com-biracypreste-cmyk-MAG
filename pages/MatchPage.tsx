
import React, { useEffect, useState } from 'react';
import { getMatchById, getStandings } from '../services/futebolApi';
import { Match, Standing } from '../types/futebol';
import Navbar from '../components/Navbar';
import { Loader, Tv, Play, BarChart2, Users, History, AlertCircle } from 'lucide-react';
import StandingsTable from '../components/futebol/StandingsTable';
import { motion, AnimatePresence } from 'framer-motion';

const MatchPageLoader = () => (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-red-500" />
    </div>
);

export default function MatchPage() {
    const [match, setMatch] = useState<Match | null>(null);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('lineups');

    useEffect(() => {
        const fetchMatchData = async () => {
            const pathParts = window.location.pathname.split('/');
            const matchId = pathParts[pathParts.length - 1];

            if (matchId) {
                const [matchData, standingsData] = await Promise.all([
                    getMatchById(matchId),
                    getStandings(),
                ]);
                setMatch(matchData);
                setStandings(standingsData);
            }
            setLoading(false);
        };

        fetchMatchData();
    }, []);

    if (loading) return <MatchPageLoader />;

    if (!match) {
        return (
            <div className="h-screen w-screen bg-background flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Partida não encontrada</h1>
                    <a href="/" className="text-red-500 hover:underline mt-4 inline-block">Voltar ao Início</a>
                </div>
            </div>
        );
    }

    const homeColor = match.homeTeam.primaryColor || '#333';
    
    return (
        <div className="bg-background min-h-screen text-white">
            <Navbar activeCategory="Futebol" onMenuClick={() => { window.location.href = '/'; }} />

            {/* Hero */}
            <div 
                className="relative pt-28 pb-12 w-full flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(180deg, ${homeColor}20 0%, #141414 100%)` }}
            >
                <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-around text-center px-4">
                    <div className="flex flex-col items-center gap-4 w-1/3">
                        <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg" />
                        <h2 className="text-lg md:text-3xl font-bold leading-tight">{match.homeTeam.name}</h2>
                    </div>
                    <div className="w-1/3 flex flex-col items-center justify-center">
                        {match.status === 'live' || match.status === 'finished' ? (
                            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
                                {match.score?.home || 0} <span className="text-gray-600">-</span> {match.score?.away || 0}
                            </div>
                        ) : (
                             <div className="text-3xl md:text-5xl font-black text-gray-500 mb-2 tracking-tighter">VS</div>
                        )}
                        
                        {match.status === 'scheduled' && (
                            <div className="text-xl font-bold text-white mb-1">{match.time}</div>
                        )}
                        <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-medium">{match.competition}</div>
                        
                        {match.status === 'live' && (
                            <div className="mt-3 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-xs font-bold text-red-500 animate-pulse uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" /> Ao Vivo
                            </div>
                        )}
                         {match.status === 'finished' && (
                            <div className="mt-3 px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500/50 text-xs font-bold text-gray-400 uppercase">
                                Encerrado
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-4 w-1/3">
                        <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg" />
                        <h2 className="text-lg md:text-3xl font-bold leading-tight">{match.awayTeam.name}</h2>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Left/Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pre-game Tabs */}
                    <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="flex border-b border-white/10 bg-white/5">
                            <TabButton icon={<Users className="w-4 h-4" />} label="Escalações" active={activeTab === 'lineups'} onClick={() => setActiveTab('lineups')} />
                            <TabButton icon={<BarChart2 className="w-4 h-4" />} label="Estatísticas" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
                            <TabButton icon={<History className="w-4 h-4" />} label="Confrontos" active={activeTab === 'h2h'} onClick={() => setActiveTab('h2h')} />
                        </div>
                        <div className="p-6 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'lineups' && (
                                    <motion.div 
                                        key="lineups"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    >
                                        <LineupsView homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                                    </motion.div>
                                )}
                                {activeTab === 'stats' && (
                                    <motion.div 
                                        key="stats"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    >
                                        <StatsView homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                                    </motion.div>
                                )}
                                {activeTab === 'h2h' && (
                                    <motion.div 
                                        key="h2h"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    >
                                        <H2HView homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                     {/* How to Watch */}
                    <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 flex items-start gap-4">
                        <div className="p-3 bg-red-600/20 rounded-lg">
                             <Tv className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Onde Assistir</h3>
                            <p className="text-gray-400 text-sm">A partida será transmitida ao vivo com exclusividade nos seguintes canais:</p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 bg-white/10 rounded text-sm font-medium hover:bg-white/20 transition cursor-pointer">{match.broadcastChannel}</span>
                                <span className="px-3 py-1 bg-white/10 rounded text-sm font-medium hover:bg-white/20 transition cursor-pointer">Globoplay</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right/Sidebar Column */}
                <div className="space-y-8">
                    {/* Highlights */}
                    <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-red-500" /> Melhores Momentos</h3>
                         <div className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <Play className="w-5 h-5 fill-white text-white ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-xs font-bold">Pré-jogo: Aquecimento das equipes</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded hover:bg-white/5">
                            Ver galeria completa
                        </button>
                    </div>
                    
                    {/* Mini Standings */}
                    <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h3 className="font-bold text-sm uppercase tracking-wider">Classificação</h3>
                        </div>
                        <div className="p-2">
                            <StandingsTable standings={standings.slice(0, 5)} />
                        </div>
                        <a href="/futebol" className="block p-3 text-center text-xs font-bold text-red-500 hover:bg-white/5 transition-colors border-t border-white/10 uppercase tracking-wider">
                            Ver tabela completa
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-all ${active ? 'border-red-500 text-white bg-white/[0.02]' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]'}`}
    >
        {icon} {label}
    </button>
);

// --- Sub Components for Tabs ---

const LineupsView = ({ homeTeam, awayTeam }: { homeTeam: any, awayTeam: any }) => {
    const renderPlayer = (team: 'home' | 'away', role: string) => (
        <div className="flex flex-col items-center gap-1 transform hover:scale-110 transition-transform cursor-pointer z-10">
            <div 
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white`}
                style={{ backgroundColor: team === 'home' ? homeTeam.primaryColor : awayTeam.primaryColor }}
            >
                {Math.floor(Math.random() * 99) + 1}
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md bg-black/40 px-1.5 rounded">{role}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between px-4 text-sm font-bold">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{background: homeTeam.primaryColor}}></span>
                    {homeTeam.name} (4-3-3)
                </div>
                <div className="flex items-center gap-2">
                    {awayTeam.name} (4-4-2)
                    <span className="w-3 h-3 rounded-full" style={{background: awayTeam.primaryColor}}></span>
                </div>
            </div>

            {/* Soccer Pitch Visualization */}
            <div className="relative w-full aspect-[2/3] md:aspect-[16/9] bg-[#2c8f46] rounded-lg border-2 border-white/20 overflow-hidden shadow-inner">
                {/* Pitch Markings */}
                <div className="absolute inset-0 flex flex-col">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-1 bg-black/5" style={{ opacity: i % 2 === 0 ? 0.1 : 0 }} />
                    ))}
                </div>
                
                <div className="absolute top-0 left-0 w-full h-full border border-white/30 m-4 box-border" style={{width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)'}} />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/30" />
                
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-12 border-x border-b border-white/30" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-12 border-x border-t border-white/30" />

                <div className="absolute inset-0 py-8 flex flex-col justify-between">
                    {/* Away Team (Top) */}
                    <div className="flex flex-col gap-4 h-[45%] justify-start pt-4">
                        <div className="flex justify-center">{renderPlayer('away', 'GK')}</div>
                        <div className="flex justify-around px-12">{[1,2,3,4].map(i => renderPlayer('away', 'DEF'))}</div>
                        <div className="flex justify-around px-8">{[1,2,3,4].map(i => renderPlayer('away', 'MID'))}</div>
                        <div className="flex justify-around px-20">{[1,2].map(i => renderPlayer('away', 'FWD'))}</div>
                    </div>

                    {/* Home Team (Bottom) */}
                    <div className="flex flex-col-reverse gap-4 h-[45%] justify-start pb-4">
                        <div className="flex justify-center">{renderPlayer('home', 'GK')}</div>
                        <div className="flex justify-around px-12">{[1,2,3,4].map(i => renderPlayer('home', 'DEF'))}</div>
                        <div className="flex justify-around px-16">{[1,2,3].map(i => renderPlayer('home', 'MID'))}</div>
                        <div className="flex justify-around px-12">{[1,2,3].map(i => renderPlayer('home', 'FWD'))}</div>
                    </div>
                </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Escalações prováveis baseadas nos últimos jogos.
            </div>
        </div>
    );
};

const StatsView = ({ homeTeam, awayTeam }: { homeTeam: any, awayTeam: any }) => {
    const stats = [
        { label: 'Posse de Bola', home: 54, away: 46, unit: '%' },
        { label: 'Finalizações', home: 14, away: 8, unit: '' },
        { label: 'Chutes no Gol', home: 6, away: 3, unit: '' },
        { label: 'Escanteios', home: 7, away: 4, unit: '' },
        { label: 'Faltas', home: 10, away: 12, unit: '' },
        { label: 'Passes Certos', home: 420, away: 355, unit: '' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-center gap-2 w-20">
                    <img src={homeTeam.logoUrl} className="w-12 h-12 object-contain" alt="" />
                    <span className="text-xs font-bold">{homeTeam.name.substring(0, 3).toUpperCase()}</span>
                </div>
                 <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Estatísticas</span>
                <div className="flex flex-col items-center gap-2 w-20">
                    <img src={awayTeam.logoUrl} className="w-12 h-12 object-contain" alt="" />
                    <span className="text-xs font-bold">{awayTeam.name.substring(0, 3).toUpperCase()}</span>
                </div>
            </div>

            <div className="space-y-6">
                {stats.map((stat, idx) => {
                    const total = stat.home + stat.away;
                    const homePercent = total > 0 ? (stat.home / total) * 100 : 50;
                    return (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm font-bold text-gray-300 px-1">
                                <span>{stat.home}{stat.unit}</span>
                                <span className="text-gray-500 text-xs font-normal uppercase">{stat.label}</span>
                                <span>{stat.away}{stat.unit}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                                <div 
                                    className="h-full transition-all duration-1000" 
                                    style={{ width: `${homePercent}%`, backgroundColor: homeTeam.primaryColor || '#fff' }} 
                                />
                                <div 
                                    className="h-full transition-all duration-1000 flex-1" 
                                    style={{ backgroundColor: awayTeam.primaryColor || '#999' }} 
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const H2HView = ({ homeTeam, awayTeam }: { homeTeam: any, awayTeam: any }) => {
    // Mock History
    const history = [
        { date: '24/11/23', home: homeTeam, away: awayTeam, score: '2 - 1', winner: 'home' },
        { date: '10/06/23', home: awayTeam, away: homeTeam, score: '1 - 1', winner: 'draw' },
        { date: '05/12/22', home: homeTeam, away: awayTeam, score: '0 - 1', winner: 'away' },
        { date: '14/08/22', home: awayTeam, away: homeTeam, score: '2 - 2', winner: 'draw' },
        { date: '02/03/22', home: homeTeam, away: awayTeam, score: '3 - 0', winner: 'home' },
    ];

    return (
        <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-lg text-center">
                <p className="text-gray-400 text-sm mb-2">Últimos 5 confrontos</p>
                <div className="flex justify-center gap-8 font-bold text-2xl">
                    <div className="text-green-500">2 V</div>
                    <div className="text-gray-400">2 E</div>
                    <div className="text-red-500">1 D</div>
                </div>
            </div>

            <div className="space-y-3">
                {history.map((match, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#141414] border border-white/5 rounded hover:bg-white/5 transition-colors">
                        <div className="w-16 text-xs text-gray-500 text-center">{match.date}</div>
                        <div className="flex-1 flex items-center justify-end gap-2 text-sm font-bold">
                            <span className={match.winner === 'home' ? 'text-white' : 'text-gray-400'}>{match.home.name}</span>
                            {match.winner === 'home' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                        </div>
                        <div className="w-20 text-center font-mono font-bold bg-black/40 py-1 rounded mx-2">{match.score}</div>
                        <div className="flex-1 flex items-center justify-start gap-2 text-sm font-bold">
                            {match.winner === 'away' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                            <span className={match.winner === 'away' ? 'text-white' : 'text-gray-400'}>{match.away.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
