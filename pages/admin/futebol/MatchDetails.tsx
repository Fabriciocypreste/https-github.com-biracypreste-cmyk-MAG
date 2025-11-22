
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../../components/shared/Breadcrumbs';
import { 
  Calendar, MapPin, Tv, Play, AlertCircle, 
  TrendingUp, History, MonitorPlay, Edit, Loader, Save, X, RefreshCw, Clock, Settings
} from 'lucide-react';
import { Match } from '../../../types/futebol';
import { getMatchById } from '../../../services/futebolApi';

export default function MatchDetails() {
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editing State
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchStatus, setMatchStatus] = useState<'scheduled' | 'live' | 'finished'>('scheduled');

  useEffect(() => {
    const fetchMatchData = async () => {
      const pathParts = window.location.pathname.split('/');
      const matchId = pathParts[pathParts.length - 1];
      if (matchId) {
        const matchData = await getMatchById(matchId);
        if (matchData) {
            setMatch(matchData);
            setHomeScore(matchData.score?.home || 0);
            setAwayScore(matchData.score?.away || 0);
            setMatchStatus(matchData.status);
        }
      }
      setIsLoading(false);
    };
    fetchMatchData();
  }, []);

  const handleSave = () => {
    if (match) {
        setMatch({
            ...match,
            score: { home: homeScore, away: awayScore },
            status: matchStatus
        });
        setIsEditing(false);
        // In a real app, you would call an API update here
    }
  };

  if (isLoading) {
    return <div className="bg-[#121212] min-h-screen flex items-center justify-center"><Loader className="w-12 h-12 animate-spin text-red-500" /></div>;
  }

  if (!match) {
    return <div className="bg-[#121212] min-h-screen flex items-center justify-center text-white"><p>Partida não encontrada.</p></div>;
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Breadcrumbs Container */}
      <div className="p-8 pb-0">
         <Breadcrumbs items={[
             { label: 'Futebol', href: '/admin/futebol/serie-a' }, 
             { label: 'Partidas' },
             { label: `${match.homeTeam.name} vs ${match.awayTeam.name}` }
         ]} />
      </div>

      {/* Hero Header */}
      <div className="relative w-full bg-[#1E1E1E] border-y border-white/5 mt-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
           <div className="absolute -left-20 top-0 w-1/2 h-full bg-gradient-to-r from-[var(--home-color)] to-transparent opacity-10" style={{ '--home-color': match.homeTeam.primaryColor || '#333' } as React.CSSProperties} />
           <div className="absolute -right-20 top-0 w-1/2 h-full bg-gradient-to-l from-[var(--away-color)] to-transparent opacity-10" style={{ '--away-color': match.awayTeam.primaryColor || '#555' } as React.CSSProperties} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Home Team */}
            <div className="flex flex-col items-center gap-4 w-1/3">
                <img 
                    src={match.homeTeam.logoUrl} 
                    alt={match.homeTeam.name} 
                    className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center">{match.homeTeam.name}</h2>
            </div>

            {/* Score / Time Board */}
            <div className="flex flex-col items-center justify-center w-1/3 z-10">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 mb-4 text-sm font-mono text-gray-300 flex items-center gap-2 shadow-inner">
                    <Calendar className="w-4 h-4 text-red-500" />
                    {match.date} • {match.time}
                </div>
                
                <div className="text-5xl md:text-7xl font-black tracking-tighter flex items-center gap-4 transition-all duration-300">
                  {isEditing ? (
                      <div className="flex items-center gap-4 bg-black/50 p-4 rounded-xl border border-white/10">
                          <input 
                            type="number" 
                            value={homeScore} 
                            onChange={(e) => setHomeScore(Number(e.target.value))}
                            className="w-20 bg-transparent text-center border-b-2 border-red-500 focus:outline-none"
                          />
                          <span className="text-gray-500 text-4xl">-</span>
                          <input 
                            type="number" 
                            value={awayScore} 
                            onChange={(e) => setAwayScore(Number(e.target.value))}
                            className="w-20 bg-transparent text-center border-b-2 border-red-500 focus:outline-none"
                          />
                      </div>
                  ) : (
                      match.status === 'finished' || match.status === 'live' ? (
                        <>
                          <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{match.score?.home ?? homeScore}</span>
                          <span className="text-gray-600 text-4xl md:text-6xl font-light opacity-50">:</span>
                          <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{match.score?.away ?? awayScore}</span>
                        </>
                      ) : (
                        <span className="text-gray-600 text-6xl font-bold opacity-30">VS</span>
                      )
                  )}
                </div>

                {match.status === 'live' && !isEditing && (
                    <div className="mt-4 px-4 py-1 bg-red-600 rounded text-white text-xs font-bold animate-pulse flex items-center gap-2 shadow-lg shadow-red-900/50">
                        <span className="w-2 h-2 bg-white rounded-full" /> AO VIVO
                    </div>
                )}

                <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {match.homeTeam.stadium || 'Estádio a definir'}
                </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-4 w-1/3">
                <img 
                    src={match.awayTeam.logoUrl} 
                    alt={match.awayTeam.name} 
                    className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center">{match.awayTeam.name}</h2>
            </div>
        </div>

        {/* Admin Action Bar */}
        <div className="relative border-t border-white/5 bg-black/20 backdrop-blur">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4" />
                        Transmissão: <span className="text-white font-medium">{match.broadcastChannel || 'A confirmar'}</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                             <select 
                                value={matchStatus} 
                                onChange={(e) => setMatchStatus(e.target.value as any)}
                                className="bg-gray-800 border border-gray-600 rounded px-3 text-sm focus:outline-none"
                             >
                                 <option value="scheduled">Agendado</option>
                                 <option value="live">Ao Vivo</option>
                                 <option value="finished">Finalizado</option>
                             </select>
                             <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded text-sm hover:bg-white/10 transition">Cancelar</button>
                             <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-bold flex items-center gap-2 shadow-lg">
                                <Save className="w-4 h-4" /> Salvar
                             </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
                            <Settings className="w-4 h-4" />
                            Gerenciar Partida
                        </button>
                    )}
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 text-sm font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105">
                        <MonitorPlay className="w-4 h-4" />
                        Painel de Transmissão
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Live Feed (If Live) */}
             {matchStatus === 'live' && (
                 <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500 animate-pulse">
                        <Clock className="w-5 h-5" /> Linha do Tempo (Ao Vivo)
                    </h3>
                    <div className="space-y-4 relative pl-4 border-l-2 border-gray-700">
                        <div className="relative pl-6">
                            <div className="absolute -left-[21px] top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E1E1E]" />
                            <span className="text-sm font-mono text-gray-400">42'</span>
                            <p className="font-bold text-white">Gol! {match.homeTeam.name}</p>
                            <p className="text-xs text-gray-500">Gabriel Silva (Assist. R. Augusto)</p>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute -left-[21px] top-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#1E1E1E]" />
                            <span className="text-sm font-mono text-gray-400">28'</span>
                            <p className="font-bold text-white">Cartão Amarelo</p>
                            <p className="text-xs text-gray-500">Zagueiro (Visitante)</p>
                        </div>
                         <div className="relative pl-6">
                            <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#1E1E1E]" />
                            <span className="text-sm font-mono text-gray-400">00'</span>
                            <p className="font-bold text-white">Início da Partida</p>
                        </div>
                    </div>
                 </div>
             )}

             {/* Probabilities (Odds) */}
             <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Probabilidades de Vitória
                </h3>
                 <div className="flex items-center gap-2 h-8 mb-2">
                     <div className="h-full bg-blue-600 rounded-l-md flex items-center justify-center text-xs font-bold" style={{width: '45%'}}>45%</div>
                     <div className="h-full bg-gray-600 flex items-center justify-center text-xs font-bold" style={{width: '25%'}}>25%</div>
                     <div className="h-full bg-red-600 rounded-r-md flex items-center justify-center text-xs font-bold" style={{width: '30%'}}>30%</div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400">
                     <span>{match.homeTeam.name}</span>
                     <span>Empate</span>
                     <span>{match.awayTeam.name}</span>
                 </div>
             </div>

             {/* Head to Head */}
             <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-500" />
                    Últimos Confrontos
                </h3>
                 <div className="space-y-3">
                     {[1,2,3].map((i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                             <span className="text-xs text-gray-500">10/08/23</span>
                             <div className="flex items-center gap-4 text-sm font-bold">
                                 <span>{match.homeTeam.name}</span>
                                 <span className="px-2 py-0.5 bg-gray-700 rounded">2 - 1</span>
                                 <span className="text-gray-400">{match.awayTeam.name}</span>
                             </div>
                             <span className="text-xs font-bold text-green-500 w-16 text-right">Casa Venceu</span>
                         </div>
                     ))}
                 </div>
             </div>
          </div>

          {/* Right Column: Media */}
          <div className="space-y-8">
             {/* Live Stream Status */}
             <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${match.status === 'live' ? 'bg-red-400' : 'bg-yellow-400'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${match.status === 'live' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                    </span>
                    <h3 className="font-bold">Status do Sinal</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    {match.status === 'live' ? 'Sinal recebido com qualidade 1080p.' : 'Aguardando feed da geradora.'}
                </p>
                <div className="p-3 bg-black/30 rounded text-xs font-mono text-gray-500 break-all border border-white/5 flex items-center justify-between">
                    <span className="truncate">rtmp://live.redflix.com/ingest/{match.id}</span>
                    <button className="text-blue-400 hover:text-white"><RefreshCw className="w-3 h-3" /></button>
                </div>
             </div>

             {/* Highlights / Media */}
             <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-500" />
                    Melhores Momentos
                </h3>
                <div className="space-y-4">
                    <div className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {matchStatus === 'live' || matchStatus === 'finished' ? (
                                <Play className="w-8 h-8 text-white opacity-50" />
                            ) : (
                                <p className="text-xs text-gray-500">Conteúdo disponível após início.</p>
                            )}
                        </div>
                    </div>
                    
                    <button className="w-full py-3 border border-dashed border-gray-700 rounded-lg text-gray-500 text-sm hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2 hover:bg-white/5">
                        <AlertCircle className="w-4 h-4" />
                        Gerenciar Highlights
                    </button>
                </div>
             </div>
          </div>

      </div>
    </div>
  );
}
