

import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumbs } from '../../../components/shared/Breadcrumbs';
import { Calendar, Tv, Plus, X, Save, Upload, Palette, Loader, Shield, ChevronLeft, ChevronRight, Trophy, Users, Clock, Edit, FileJson } from 'lucide-react';
import { Team, Match } from '../../../types/futebol';
import { TeamCard } from '../../../components/futebol/TeamCard';
import { getUpcomingMatches, getAllTeams } from '../../../services/futebolApi';

const jsonExample = `{
  "name": "Nome do Time",
  "slug": "nome-do-time",
  "logoUrl": "https://...",
  "primaryColor": "#FF0000",
  "secondaryColor": "#000000",
  "founded": 1910,
  "stadium": "Nome do Estádio"
}`;

// FIX: Moved TabButton component out of SerieAPage to avoid re-creation on every render and to fix potential typing issues.
const TabButton = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center ${
      active
        ? 'border-red-500 text-white'
        : 'border-transparent text-gray-500 hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

export default function SerieAPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'manual' | 'json'>('manual');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  
  // New Team Form State
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    logoUrl: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    stadium: '',
    founded: new Date().getFullYear()
  });

  // New Match Form State
  const [matchFormData, setMatchFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '',
    channel: 'Premiere'
  });

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const [fetchedTeams, fetchedMatches] = await Promise.all([
            getAllTeams(),
            getUpcomingMatches()
        ]);
        setTeams(fetchedTeams);
        setUpcomingMatches(fetchedMatches);
        setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMatchFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetTeamModal = () => {
    setIsTeamModalOpen(false);
    setTeamFormData({
      name: '',
      logoUrl: '',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      stadium: '',
      founded: new Date().getFullYear()
    });
    setJsonInput('');
    setJsonError(null);
    setModalTab('manual');
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);

    let newTeam: Team | null = null;

    if (modalTab === 'manual') {
      const finalLogoUrl = teamFormData.logoUrl.trim() 
          ? teamFormData.logoUrl 
          : `https://placehold.co/150x150/1a1a1a/FFFFFF/png?text=${teamFormData.name.substring(0,3).toUpperCase()}`;

      newTeam = {
        id: Date.now().toString(),
        slug: teamFormData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: teamFormData.name,
        logoUrl: finalLogoUrl,
        primaryColor: teamFormData.primaryColor,
        secondaryColor: teamFormData.secondaryColor,
        stadium: teamFormData.stadium,
        founded: Number(teamFormData.founded)
      };
    } else { // JSON tab
      try {
        const parsed = JSON.parse(jsonInput);
        
        if (!parsed.name || !parsed.logoUrl) {
          setJsonError("O JSON deve conter pelo menos as propriedades 'name' e 'logoUrl'.");
          return;
        }

        newTeam = {
          id: parsed.id || Date.now().toString(),
          slug: parsed.slug || parsed.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: parsed.name,
          logoUrl: parsed.logoUrl,
          primaryColor: parsed.primaryColor || '#000000',
          secondaryColor: parsed.secondaryColor || '#ffffff',
          stadium: parsed.stadium || 'Estádio Desconhecido',
          founded: parsed.founded || new Date().getFullYear(),
        };

      } catch (error) {
        setJsonError('Formato de JSON inválido. Por favor, verifique a sintaxe.');
        return;
      }
    }

    if (newTeam) {
        setTeams(prevTeams => [...prevTeams, newTeam as Team]);
        resetTeamModal();
    }
  };


  const handleMatchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const homeTeam = teams.find(t => t.id === matchFormData.homeTeamId);
      const awayTeam = teams.find(t => t.id === matchFormData.awayTeamId);
      
      if (!homeTeam || !awayTeam) return;

      const newMatch: Match = {
          id: Date.now().toString(),
          homeTeam,
          awayTeam,
          competition: 'Brasileirão Série A',
          date: new Date(matchFormData.date).toLocaleDateString('pt-BR'),
          time: matchFormData.time,
          status: 'scheduled',
          broadcastChannel: matchFormData.channel
      };

      setUpcomingMatches([newMatch, ...upcomingMatches]);
      setIsMatchModalOpen(false);
      setMatchFormData({ homeTeamId: '', awayTeamId: '', date: '', time: '', channel: 'Premiere' });
  }

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white relative">
      <Breadcrumbs items={[{ label: 'Futebol' }, { label: 'Brasileirão Série A' }]} />

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg shadow-green-900/20 border border-white/10">
                <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-black tracking-tight">Série A</h1>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Temporada 2025 • Em Andamento
                </p>
            </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsMatchModalOpen(true)}
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-white/10 rounded-lg text-sm font-bold transition-all flex items-center gap-2 hover:border-white/20"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            Agendar Jogo
          </button>
          <button 
            onClick={() => setIsTeamModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Novo Time
          </button>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-5 flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase">Clubes Inscritos</p>
                  <p className="text-2xl font-black text-white">{teams.length}</p>
              </div>
          </div>
          <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-5 flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase">Líder (Simulado)</p>
                  <p className="text-2xl font-black text-white">{teams[0]?.name || 'N/A'}</p>
              </div>
          </div>
          <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-5 flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-red-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-red-500" />
              </div>
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase">Jogos Agendados</p>
                  <p className="text-2xl font-black text-white">{upcomingMatches.length}</p>
              </div>
          </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-red-500" />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Teams Grid */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Clubes da Série A
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} href={`/admin/futebol/times/${team.id}`} />
              ))}
              
              {/* Add Button in Grid */}
              <button 
                onClick={() => setIsTeamModalOpen(true)}
                className="group bg-[#1E1E1E] border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-red-500/50 hover:bg-red-500/5 transition-all min-h-[200px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-red-500" />
                </div>
                <span className="text-gray-400 font-medium group-hover:text-white">Adicionar Time</span>
              </button>
            </div>
          </section>

          {/* Next Matches Section (Carousel) */}
          <section>
             <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                Próximos Jogos
            </h2>
            <div className="relative group/slider">
                <div 
                  className={`absolute top-0 bottom-0 left-0 z-[60] w-14 bg-black/50 hover:bg-black/70 m-auto h-full cursor-pointer flex items-center justify-center transition opacity-0 group-hover/slider:opacity-100 ${!isMoved && 'hidden'}`}
                  onClick={() => handleScroll('left')}
                >
                  <ChevronLeft className="w-9 h-9 text-white" />
                </div>
                
                <div 
                    ref={rowRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar py-4 scroll-smooth pr-[60px]"
                >
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="flex-shrink-0 w-[280px] snap-start bg-[#1E1E1E] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all group cursor-pointer shadow-lg relative overflow-hidden">
                      {match.status === 'live' && <div className="absolute top-0 right-0 px-2 py-1 bg-red-600 text-[10px] font-bold uppercase">Ao Vivo</div>}
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-4 mt-2">
                        <span className="bg-black/30 px-2 py-1 rounded text-[10px] font-mono border border-white/5">{match.date} • {match.time}</span>
                        <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold border border-green-500/20 px-1.5 py-0.5 rounded bg-green-500/5"><Tv className="w-3 h-3" /> {match.broadcastChannel || 'TV'}</span>
                      </div>
                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex flex-col items-center gap-2 w-1/3">
                           <div className="w-14 h-14 p-2 bg-black/20 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                                <img src={match.homeTeam.logoUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt={match.homeTeam.name} />
                           </div>
                           <span className="text-xs font-bold text-center truncate w-full text-gray-300 group-hover:text-white">{match.homeTeam.name}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-gray-700 group-hover:text-red-500 transition-colors">VS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-1/3">
                           <div className="w-14 h-14 p-2 bg-black/20 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                                <img src={match.awayTeam.logoUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt={match.awayTeam.name} />
                           </div>
                           <span className="text-xs font-bold text-center truncate w-full text-gray-300 group-hover:text-white">{match.awayTeam.name}</span>
                        </div>
                      </div>
                      <a href={`/admin/futebol/partidas/${match.id}`} className="w-full mt-auto bg-white/5 hover:bg-white/10 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-colors block text-center border border-white/5 hover:border-white/20 text-gray-300 hover:text-white">
                        Gerenciar Partida
                      </a>
                    </div>
                  ))}
                  
                   <button 
                     onClick={() => setIsMatchModalOpen(true)}
                     className="flex-shrink-0 w-[100px] snap-start bg-[#1E1E1E]/50 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                   >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400 text-center px-2">Agendar</span>
                   </button>
                </div>
                
                <div 
                  className="absolute top-0 bottom-0 right-0 z-[60] w-14 bg-black/50 hover:bg-black/70 m-auto h-full cursor-pointer flex items-center justify-center transition opacity-0 group-hover/slider:opacity-100"
                  onClick={() => handleScroll('right')}
                >
                  <ChevronRight className="w-9 h-9 text-white" />
                </div>
            </div>
          </section>
        </div>
      )}

      {/* Add Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] w-full max-w-lg rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                Adicionar Novo Time
              </h2>
              <button onClick={resetTeamModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FIX: The TabButton component requires children, but they were missing. Added content for both manual and JSON tabs. */}
            <div className="flex border-b border-white/10 px-4">
                <TabButton active={modalTab === 'manual'} onClick={() => { setModalTab('manual'); setJsonError(null); }}>
                    <Edit className="w-4 h-4 mr-2" /> Manual
                </TabButton>
                <TabButton active={modalTab === 'json'} onClick={() => { setModalTab('json'); setJsonError(null); }}>
                    <FileJson className="w-4 h-4 mr-2" /> JSON
                </TabButton>
            </div>
            
            <form onSubmit={handleTeamSubmit} className="p-6">
              {modalTab === 'manual' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Clube</label>
                        <input 
                        required
                        type="text" 
                        name="name"
                        value={teamFormData.name}
                        onChange={handleTeamInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                        placeholder="Ex: Sport Club Corinthians Paulista"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                        <Upload className="w-3 h-3" /> URL do Logo
                        </label>
                        <input 
                        type="url" 
                        name="logoUrl"
                        value={teamFormData.logoUrl}
                        onChange={handleTeamInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                        placeholder="https://... (Deixe em branco para automático)"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Estádio</label>
                        <input 
                            required
                            type="text" 
                            name="stadium"
                            value={teamFormData.stadium}
                            onChange={handleTeamInputChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                            placeholder="Ex: Maracanã"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Ano de Fundação</label>
                        <input 
                            required
                            type="number" 
                            name="founded"
                            min="1850"
                            max={new Date().getFullYear()}
                            value={teamFormData.founded}
                            onChange={handleTeamInputChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                            placeholder="Ex: 1910"
                        />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 p-4 bg-black/20 rounded-lg border border-white/5">
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Palette className="w-3 h-3" /> Cor Primária
                        </label>
                        <div className="flex items-center gap-3">
                            <input 
                            type="color" 
                            name="primaryColor"
                            value={teamFormData.primaryColor}
                            onChange={handleTeamInputChange}
                            className="h-10 w-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                            />
                            <span className="text-xs font-mono text-gray-400 bg-black px-2 py-1 rounded border border-white/10">{teamFormData.primaryColor}</span>
                        </div>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Palette className="w-3 h-3" /> Cor Secundária
                        </label>
                        <div className="flex items-center gap-3">
                            <input 
                            type="color" 
                            name="secondaryColor"
                            value={teamFormData.secondaryColor}
                            onChange={handleTeamInputChange}
                            className="h-10 w-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                            />
                            <span className="text-xs font-mono text-gray-400 bg-black px-2 py-1 rounded border border-white/10">{teamFormData.secondaryColor}</span>
                        </div>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <label className="block text-sm font-medium text-gray-400">
                        Cole o objeto JSON do time aqui
                    </label>
                    <textarea 
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='{ "name": "Time Exemplo", "logoUrl": "..." }'
                        className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all resize-none"
                    />
                    <div className="text-xs text-gray-500 bg-black/40 p-3 rounded-lg border border-white/10 mt-2">
                        <p className="font-bold mb-2 text-gray-400">Exemplo de formato (campos obrigatórios: name, logoUrl):</p>
                        <pre className="whitespace-pre-wrap font-mono">{jsonExample}</pre>
                    </div>
                    {jsonError && <p className="text-red-500 text-sm mt-2">{jsonError}</p>}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button 
                  type="button"
                  onClick={resetTeamModal}
                  className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                >
                  <Save className="w-4 h-4" />
                  Salvar Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Match Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] w-full max-w-lg rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Agendar Nova Partida
              </h2>
              <button onClick={() => setIsMatchModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleMatchSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  {/* Home Team */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mandante</label>
                    <select 
                        name="homeTeamId"
                        required
                        value={matchFormData.homeTeamId}
                        onChange={handleMatchInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                    >
                        <option value="">Selecione...</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  {/* Away Team */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Visitante</label>
                    <select 
                        name="awayTeamId"
                        required
                        value={matchFormData.awayTeamId}
                        onChange={handleMatchInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                    >
                        <option value="">Selecione...</option>
                        {teams.filter(t => t.id !== matchFormData.homeTeamId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Data</label>
                    <input 
                        type="date" 
                        name="date"
                        required
                        value={matchFormData.date}
                        onChange={handleMatchInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Horário</label>
                    <input 
                        type="time" 
                        name="time"
                        required
                        value={matchFormData.time}
                        onChange={handleMatchInputChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
              </div>

              {/* Broadcast Channel */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Canal de Transmissão</label>
                <select 
                    name="channel"
                    value={matchFormData.channel}
                    onChange={handleMatchInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                >
                    <option value="Premiere">Premiere</option>
                    <option value="Globo">TV Globo</option>
                    <option value="SporTV">SporTV</option>
                    <option value="TNT">TNT Sports</option>
                    <option value="CazéTV">CazéTV</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsMatchModalOpen(false)}
                  className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                >
                  <Save className="w-4 h-4" />
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}