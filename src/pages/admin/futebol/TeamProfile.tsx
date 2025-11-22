
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../../components/shared/Breadcrumbs';
import { Trophy, MapPin, Calendar, Play, Loader, Users, TrendingUp, Save, X, Plus, Trash2, UserPlus, ExternalLink } from 'lucide-react';
import { getAllTeams, getSoccerNews, getSportsDbTeam, getSportsDbPlayersByTeamId } from '../../../services/futebolApi';
import { Team, NewsItem, SportsDbPlayer } from '../../../types/futebol';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamProfile() {
  const [team, setTeam] = useState<Team | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [squad, setSquad] = useState<SportsDbPlayer[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Squad Modal State
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', position: 'MID' });

  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true);
      const pathParts = window.location.pathname.split('/');
      const teamId = pathParts[pathParts.length - 1];
      if (teamId) {
        const allTeams = await getAllTeams();
        const foundTeam = allTeams.find(t => t.id === teamId);
        
        if (foundTeam) {
          setTeam(foundTeam);
          const [sportsDbData, newsData] = await Promise.all([
            getSportsDbTeam(foundTeam.name),
            getSoccerNews(foundTeam.slug)
          ]);
          
          if (sportsDbData) {
            setDetails(sportsDbData);
            setTeam(prevTeam => prevTeam ? ({
              ...prevTeam,
              bannerUrl: sportsDbData.strTeamBanner,
              description: sportsDbData.strDescriptionPT || sportsDbData.strDescriptionEN,
              stadiumCapacity: sportsDbData.intStadiumCapacity,
            }) : null);

            const squadData = await getSportsDbPlayersByTeamId(sportsDbData.idTeam);
            setSquad(squadData);
          }
          setNews(newsData);
        }
      }
      setIsLoading(false);
    };
    fetchTeamData();
  }, []);
  
  const handleAddPlayer = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPlayer.name || !newPlayer.number) return;

      const player: SportsDbPlayer = {
          idPlayer: `new-${Date.now()}`,
          strPlayer: newPlayer.name,
          strNumber: newPlayer.number,
          strPosition: newPlayer.position,
          strCutout: `https://placehold.co/100x100/2a2a2a/FFF?text=${newPlayer.name.substring(0,2)}`
      };
      setSquad(prevSquad => [...prevSquad, player]);
      setNewPlayer({ name: '', number: '', position: 'MID' });
  };

  const handleRemovePlayer = (id: string) => {
      setSquad(squad.filter(p => p.idPlayer !== id));
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
      <div 
        className="relative h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${team.bannerUrl || ''})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
        
        <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-end pb-8">
            <div className="flex items-end gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full p-6 shadow-2xl border-2 border-white/20 flex items-center justify-center">
                    <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain drop-shadow-lg" />
                </div>
                <div className="mb-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">{team.name}</h1>
                    <div className="flex items-center gap-6 mt-4 text-sm font-medium text-gray-300">
                        {team.founded && <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500" /> Fundado em {team.founded}</span>}
                        {team.stadium && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> {team.stadium}</span>}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-[#121212] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 flex">
              <TabButton id="overview" label="Visão Geral" icon={<TrendingUp className="w-4 h-4" />} />
              <TabButton id="squad" label="Elenco" icon={<Users className="w-4 h-4" />} />
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 pb-20">
        <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
                <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-8">
                        {team.description && (
                            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-bold mb-2">Sobre o Clube</h3>
                                <p className="text-sm text-gray-300 leading-relaxed max-h-48 overflow-y-auto pr-2">{team.description}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                 <p className="text-gray-500 text-xs font-bold uppercase">Gols Marcados</p>
                                 <p className="text-3xl font-black text-white mt-2">45</p>
                             </div>
                             <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                 <p className="text-gray-500 text-xs font-bold uppercase">Posse de Bola</p>
                                 <p className="text-3xl font-black text-white mt-2">58%</p>
                             </div>
                             <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                                 <p className="text-gray-500 text-xs font-bold uppercase">Jogos s/ Sofrer Gols</p>
                                 <p className="text-3xl font-black text-white mt-2">12</p>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Últimas Notícias</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {news.length > 0 ? news.slice(0, 5).map((item, i) => (
                                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                                        <p className="text-xs text-gray-500 mb-1">{new Date(item.pubDate).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-sm font-medium text-gray-200 group-hover:text-red-500 transition-colors">{item.title}</p>
                                    </a>
                                )) : <p className="text-sm text-gray-500">Nenhuma notícia encontrada.</p>}
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
                            <div key={player.idPlayer} className="bg-[#1E1E1E] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-all group">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/50 transition-colors">
                                        <img src={player.strCutout || `https://placehold.co/100x100/2a2a2a/FFF?text=${player.strNumber || '?'}`} alt={player.strPlayer} />
                                    </div>
                                    {player.strNumber && (
                                        <div className="absolute -bottom-1 -right-1 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border border-gray-700">
                                            {player.strNumber}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-white line-clamp-1">{player.strPlayer}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${player.strPosition === 'Goalkeeper' ? 'bg-yellow-900/30 text-yellow-500' : player.strPosition === 'Forward' ? 'bg-red-900/30 text-red-500' : 'bg-blue-900/30 text-blue-500'}`}>
                                            {player.strPosition}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

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
                                    <option value="Goalkeeper">Goleiro</option>
                                    <option value="Defender">Defensor</option>
                                    <option value="Midfielder">Meio-Campo</option>
                                    <option value="Forward">Atacante</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    <div>
                        <h3 className="text-sm font-bold text-gray-300 mb-3">Jogadores Inscritos ({squad.length})</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {squad.map(player => (
                                <div key={player.idPlayer} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                                            {player.strNumber || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{player.strPlayer}</p>
                                            <p className="text-[10px] text-gray-500">{player.strPosition}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemovePlayer(player.idPlayer)}
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
