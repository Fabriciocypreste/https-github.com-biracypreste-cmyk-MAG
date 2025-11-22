
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../../components/shared/Breadcrumbs';
import { Trophy, MapPin, Calendar, Play, Loader, Users, TrendingUp, Save, X, Plus, Trash2, UserPlus } from 'lucide-react';
import { getAllTeams } from '../../../services/futebolApi';
import { Team } from '../../../types/futebol';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Squad Data Generator
const generateSquad = (teamId: string) => {
  const positions = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD'];
  return Array.from({ length: 22 }, (_, i) => ({
    id: `${teamId}-p-${i}`,
    name: `Jogador ${i + 1}`,
    number: i + 1,
    position: positions[i % 11] || 'SUB',
    age: Math.floor(Math.random() * 15) + 18,
    matches: Math.floor(Math.random() * 30),
    goals: Math.floor(Math.random() * 10),
  }));
};

export default function TeamProfile() {
  const [team, setTeam] = useState<Team | null>(null);
  const [squad, setSquad] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Squad Modal
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', position: 'MID' });

  useEffect(() => {
    const fetchTeamData = async () => {
      const pathParts = window.location.pathname.split('/');
      const teamId = pathParts[pathParts.length - 1];
      if (teamId) {
        const allTeams = await getAllTeams();
        const foundTeam = allTeams.find(t => t.id === teamId);
        setTeam(foundTeam || null);
        if (foundTeam) {
            setSquad(generateSquad(foundTeam.id));
        }
      }
      setIsLoading(false);
    };
    fetchTeamData();
  }, []);

  const handleAddPlayer = (e: React.FormEvent) => {
      e.preventDefault();
      const player = {
          id: `new-${Date.now()}`,
          name: newPlayer.name,
          number: Number(newPlayer.number),
          position: newPlayer.position,
          age: 20, // default
          matches: 0,
          goals: 0
      };
      setSquad([...squad, player]);
      setNewPlayer({ name: '', number: '', position: 'MID' });
  };

  const handleRemovePlayer = (id: string) => {
      setSquad(squad.filter(p => p.id !== id));
  };

  if (isLoading) {
    return <div className="bg-[#121212] min-h-screen flex items-center justify-center"><Loader className="w-12 h-12 animate-spin text-red-500" /></div>;
  }

  if (!team) {
    return <div className="bg-[#121212] min-h-screen flex items-center justify-center text-white"><p>Time não encontrado.</p></div>;
  }

  const TabButton = ({ id, label, icon }: any) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === id ? 'border-red-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
    >
        {icon} {label}
    </button>
  );

  return (
    <div className="bg-[#121212] min-h-screen text-white relative">
      {/* Dynamic Header with Team Colors */}
      <div 
        className="relative h-80 w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor || '#333'} 0%, ${team.secondaryColor || '#000'} 100%)`
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        
        <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-end pb-8">
            <div className="flex items-end gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/20 flex items-center justify-center">
                    <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain drop-shadow-lg" />
                </div>
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">Série A</span>
                        <div className="flex gap-1">
                            {['W', 'W', 'D', 'L', 'W'].map((r, i) => (
                                <span key={i} className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-gray-500' : 'bg-red-500'}`}>
                                    {r}
                                </span>
                            ))}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">{team.name}</h1>
                    <div className="flex items-center gap-6 mt-4 text-sm font-medium text-gray-300">
                        {team.founded && <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500" /> Fundado em {team.founded}</span>}
                        {team.stadium && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> {team.stadium}</span>}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 bg-[#121212] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 flex">
              <TabButton id="overview" label="Visão Geral" icon={<TrendingUp className="w-4 h-4" />} />
              <TabButton id="squad" label="Elenco" icon={<Users className="w-4 h-4" />} />
              <TabButton id="matches" label="Partidas" icon={<Calendar className="w-4 h-4" />} />
          </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-8 py-8 pb-20">
        <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
                <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Col: Stats & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Next Match Banner */}
                        <div className="bg-gradient-to-r from-[#1E1E1E] to-[#252525] rounded-xl p-1 border border-white/10 shadow-xl">
                            <div className="bg-[#121212]/50 rounded-lg p-6 flex items-center justify-between backdrop-blur-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-red-500 font-bold text-xs uppercase tracking-wider">Próximo Jogo</span>
                                    <h3 className="text-xl font-bold text-white">Brasileirão Série A • Rodada 32</h3>
                                    <span className="text-gray-400 text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Domingo, 16:00</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <img src={team.logoUrl} className="w-16 h-16 object-contain" alt="" />
                                    <span className="text-2xl font-black text-gray-600">VS</span>
                                    <div className="w-16 h-16 bg-gray-800 rounded-full border border-white/10 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">Adv</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                 <p className="text-gray-500 text-xs font-bold uppercase">Gols Marcados</p>
                                 <p className="text-3xl font-black text-white mt-2">45</p>
                                 <p className="text-green-500 text-xs mt-1 font-medium">+12 vs média</p>
                             </div>
                             <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                 <p className="text-gray-500 text-xs font-bold uppercase">Posse de Bola</p>
                                 <p className="text-3xl font-black text-white mt-2">58%</p>
                                 <p className="text-gray-400 text-xs mt-1 font-medium">Média da temporada</p>
                             </div>
                             <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                 <p className="text-gray-500 text-xs font-bold uppercase">Jogos sem Sofrer Gols</p>
                                 <p className="text-3xl font-black text-white mt-2">12</p>
                                 <p className="text-green-500 text-xs mt-1 font-medium">Top 3 da liga</p>
                             </div>
                        </div>

                        {/* Highlights */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Melhores Momentos</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-white/5 hover:border-red-500/50 transition-all">
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                                                <Play className="w-5 h-5 fill-white text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-sm font-medium truncate text-white">Gols: {team.name} {3-i} x {i} Adversário</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Col: Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500" /> Artilheiro
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden border-2 border-white/10">
                                     <img src="https://placehold.co/100x100/2a2a2a/FFF?text=J10" alt="Player" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">Gabriel Silva</p>
                                    <p className="text-red-500 font-bold text-xl">18 <span className="text-xs text-gray-400 font-normal uppercase">Gols</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Últimas Notícias</h3>
                            <div className="space-y-4">
                                <div className="group cursor-pointer">
                                    <p className="text-xs text-gray-500 mb-1">Há 2 horas</p>
                                    <p className="text-sm font-medium text-gray-200 group-hover:text-red-500 transition-colors">Técnico define escalação para o clássico de domingo.</p>
                                </div>
                                <div className="border-t border-white/5" />
                                <div className="group cursor-pointer">
                                    <p className="text-xs text-gray-500 mb-1">Ontem</p>
                                    <p className="text-sm font-medium text-gray-200 group-hover:text-red-500 transition-colors">Clube anuncia novo patrocinador master para 2025.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'squad' && (
                <motion.div 
                    key="squad"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Elenco Atual</h2>
                        <button 
                            onClick={() => setIsSquadModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Gerenciar Elenco
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {squad.map((player) => (
                            <div key={player.id} className="bg-[#1E1E1E] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-all group">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/50 transition-colors">
                                        <img src={`https://placehold.co/100x100/2a2a2a/FFF?text=${player.number}`} alt={player.name} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border border-gray-700">
                                        {player.number}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-white">{player.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${player.position === 'GK' ? 'bg-yellow-900/30 text-yellow-500' : player.position === 'FWD' ? 'bg-red-900/30 text-red-500' : 'bg-blue-900/30 text-blue-500'}`}>
                                            {player.position}
                                        </span>
                                        <span className="text-xs text-gray-500">{player.age} anos</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'matches' && (
                <motion.div 
                    key="matches"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                >
                     <h2 className="text-2xl font-bold mb-6">Calendário da Temporada</h2>
                     {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="bg-[#1E1E1E] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="flex flex-col items-center min-w-[60px]">
                                    <span className="text-gray-400 text-xs uppercase font-bold">Out</span>
                                    <span className="text-2xl font-bold text-white">{20 + i}</span>
                                </div>
                                <div className="h-10 w-px bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-4 flex-1">
                                     <div className="flex items-center gap-3 w-32 justify-end">
                                        <span className="font-bold text-right">{team.name}</span>
                                        <img src={team.logoUrl} className="w-8 h-8 object-contain" alt="" />
                                     </div>
                                     <div className="px-3 py-1 bg-black/40 rounded text-sm font-mono font-bold border border-white/10">
                                        {i === 0 ? '2 - 1' : 'VS'}
                                     </div>
                                     <div className="flex items-center gap-3 w-32">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full" />
                                        <span className="font-bold">Adversário</span>
                                     </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {team.stadium}</span>
                                {i === 0 ? (
                                    <span className="px-2 py-1 bg-green-900/20 text-green-500 text-xs font-bold rounded border border-green-500/20">Vitória</span>
                                ) : (
                                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-bold rounded border border-white/10 transition-colors">
                                        Detalhes
                                    </button>
                                )}
                            </div>
                        </div>
                     ))}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Squad Manager Modal */}
      {isSquadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1E1E1E] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-red-500" />
                        Gerenciar Elenco
                    </h2>
                    <button onClick={() => setIsSquadModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Add Player Form */}
                    <form onSubmit={handleAddPlayer} className="bg-black/30 p-4 rounded-lg border border-white/5 mb-6">
                        <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Adicionar Jogador
                        </h3>
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Nome</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-[#1E1E1E] border border-white/10 rounded px-3 py-2 text-sm focus:border-red-500 outline-none"
                                    placeholder="Nome do Atleta"
                                    value={newPlayer.name}
                                    onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                                />
                            </div>
                            <div className="w-20">
                                <label className="text-xs text-gray-500 mb-1 block">Número</label>
                                <input 
                                    required
                                    type="number" 
                                    className="w-full bg-[#1E1E1E] border border-white/10 rounded px-3 py-2 text-sm focus:border-red-500 outline-none"
                                    placeholder="#"
                                    value={newPlayer.number}
                                    onChange={(e) => setNewPlayer({...newPlayer, number: e.target.value})}
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-gray-500 mb-1 block">Posição</label>
                                <select 
                                    className="w-full bg-[#1E1E1E] border border-white/10 rounded px-3 py-2 text-sm focus:border-red-500 outline-none"
                                    value={newPlayer.position}
                                    onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                                >
                                    <option value="GK">Goleiro</option>
                                    <option value="DEF">Defensor</option>
                                    <option value="MID">Meio-Campo</option>
                                    <option value="FWD">Atacante</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Player List */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-300 mb-3">Jogadores Inscritos ({squad.length})</h3>
                        <div className="space-y-2">
                            {squad.map(player => (
                                <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                                            {player.number}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{player.name}</p>
                                            <p className="text-[10px] text-gray-500">{player.position}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemovePlayer(player.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <button onClick={() => setIsSquadModalOpen(false)} className="px-4 py-2 bg-white text-black rounded font-bold hover:bg-gray-200 transition-colors">
                        Concluir
                    </button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
}
