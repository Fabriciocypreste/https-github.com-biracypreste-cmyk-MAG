
import React from 'react';
import { Breadcrumbs } from '../../../components/shared/Breadcrumbs';
import { Trophy, Calendar, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_SQUAD = [
    { id: 1, name: 'Alisson', position: 'Goleiro', club: 'Liverpool', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/0/0c/Liverpool_FC.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/123490-1711382436.jpg', number: 1 },
    { id: 2, name: 'Ederson', position: 'Goleiro', club: 'Man City', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/a/a2/Manchester_City_FC_logo.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/129199-1684313636.jpg', number: 23 },
    { id: 3, name: 'Marquinhos', position: 'Defensor', club: 'PSG', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/a/a7/Paris_Saint-Germain_F.C..svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/181783-1711462014.jpg', number: 4 },
    { id: 4, name: 'Éder Militão', position: 'Defensor', club: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/9/98/Real_Madrid.png', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/401530-1698754700.jpg', number: 3 },
    { id: 5, name: 'Casemiro', position: 'Meio-campo', club: 'Man United', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/a/a1/Man_Utd_FC_.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/121226-1698418041.jpg', number: 5 },
    { id: 6, name: 'Bruno G.', position: 'Meio-campo', club: 'Newcastle', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/f/f9/Newcastle_United_Logo.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/393339-1698668962.jpg', number: 8 },
    { id: 7, name: 'Lucas Paquetá', position: 'Meio-campo', club: 'West Ham', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/c/c2/West_Ham_United_FC_logo.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/393323-1698669466.jpg', number: 7 },
    { id: 8, name: 'Neymar Jr', position: 'Atacante', club: 'Al-Hilal', clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Al-Hilal_FC_logo.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/68290-1711461877.jpg', number: 10 },
    { id: 9, name: 'Vinícius Jr', position: 'Atacante', club: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/9/98/Real_Madrid.png', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/371998-1711461945.jpg', number: 20 },
    { id: 10, name: 'Rodrygo', position: 'Atacante', club: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/9/98/Real_Madrid.png', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/412363-1711461993.jpg', number: 21 },
    { id: 11, name: 'Raphinha', position: 'Atacante', club: 'Barcelona', clubLogo: 'https://upload.wikimedia.org/wikipedia/pt/4/43/FCBarcelona.svg', photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/372077-1711461841.jpg', number: 11 },
];

const MOCK_MATCHES = [
    { id: 1, opponent: 'Venezuela', opponentLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/100px-Flag_of_Venezuela.svg.png', competition: 'Eliminatórias Copa 2026', date: '2025-10-12T21:30:00', location: 'Arena Pantanal' },
    { id: 2, opponent: 'Uruguai', opponentLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/100px-Flag_of_Uruguay.svg.png', competition: 'Eliminatórias Copa 2026', date: '2025-10-17T21:00:00', location: 'Estádio Centenário' },
    { id: 3, opponent: 'Colômbia', opponentLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/100px-Flag_of_Colombia.svg.png', competition: 'Eliminatórias Copa 2026', date: '2025-11-16T21:00:00', location: 'Metropolitano' },
];

export default function SelecaoPage() {

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <Breadcrumbs items={[{ label: 'Futebol' }, { label: 'Seleção Brasileira' }]} />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-yellow-400/80 via-green-500/80 to-blue-600/80 rounded-xl p-8 mb-8 overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://www.svgrepo.com/show/23126/star.svg)', backgroundSize: '50px' }}
        />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <img src="https://upload.wikimedia.org/wikipedia/pt/4/43/Escudo_da_CBF_2019.svg" alt="CBF Logo" className="w-24 h-24 drop-shadow-lg" />
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Seleção Brasileira</h1>
                    <div className="flex items-center gap-2 mt-2 text-yellow-300 font-bold">
                        <Trophy className="w-5 h-5" />
                        <Trophy className="w-5 h-5" />
                        <Trophy className="w-5 h-5" />
                        <Trophy className="w-5 h-5" />
                        <Trophy className="w-5 h-5" />
                        <span className="text-white/80 text-sm ml-2">PENTA CAMPEÃO MUNDIAL</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 text-center">
                <div className="bg-black/20 p-4 rounded-lg border border-white/10 w-32">
                    <p className="text-xs font-bold text-gray-400 uppercase">Ranking FIFA</p>
                    <p className="text-2xl font-black text-white">5º</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/10 w-32">
                    <p className="text-xs font-bold text-gray-400 uppercase">Artilheiro</p>
                    <p className="text-2xl font-black text-white">Neymar Jr</p>
                </div>
            </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Próximos Jogos */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-red-500" /> Próximos Jogos</h2>
            <div className="space-y-4">
              {MOCK_MATCHES.map(match => {
                  const matchDate = new Date(match.date);
                  return (
                    <div key={match.id} className="bg-[#1E1E1E] rounded-xl border border-white/5 p-4 flex items-center justify-between hover:border-yellow-400/50 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center w-16 text-center">
                                <span className="text-xs font-bold text-gray-400">{matchDate.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                                <span className="text-lg font-black text-white">{matchDate.getDate()}</span>
                                <span className="text-xs text-gray-500">{matchDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div>
                                <p className="text-sm font-bold text-white flex items-center gap-2">Brasil <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/100px-Flag_of_Brazil.svg.png" className="w-5" alt="Brasil"/> vs <img src={match.opponentLogo} className="w-5" alt={match.opponent} /> {match.opponent}</p>
                                <p className="text-xs text-gray-400">{match.competition}</p>
                            </div>
                       </div>
                       <div className="text-right">
                            <p className="text-xs text-gray-400 flex items-center gap-1 justify-end"><MapPin className="w-3 h-3"/>{match.location}</p>
                       </div>
                    </div>
                  );
              })}
            </div>
          </section>

          {/* Última Convocação */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Última Convocação</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {MOCK_SQUAD.map(player => (
                <div key={player.id} className="bg-[#1E1E1E] border border-white/5 rounded-xl p-3 text-center group hover:-translate-y-1 transition-transform">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                        <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover rounded-full border-2 border-gray-700 group-hover:border-yellow-400 transition-colors" />
                        <div className="absolute -bottom-1 -right-1 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border border-gray-700">
                            {player.number}
                        </div>
                    </div>
                    <p className="font-bold text-sm text-white truncate">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.position}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <img src={player.clubLogo} alt={player.club} className="w-3 h-3 object-contain" />
                        <p className="text-[10px] text-gray-500">{player.club}</p>
                    </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        {/* Notícias e Destaques */}
        <div className="space-y-6">
            <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">Notícias da Seleção</h3>
                <div className="space-y-4">
                    <a href="#" className="block group">
                        <p className="text-xs text-gray-500 mb-1">Fonte: GE • Há 3 horas</p>
                        <p className="font-medium text-gray-200 group-hover:text-yellow-400 transition-colors">Dorival Júnior esboça time titular para amistoso contra a Espanha.</p>
                    </a>
                    <div className="border-t border-white/10" />
                     <a href="#" className="block group">
                        <p className="text-xs text-gray-500 mb-1">Fonte: UOL • Ontem</p>
                        <p className="font-medium text-gray-200 group-hover:text-yellow-400 transition-colors">Nova camisa para a Copa América é lançada com sucesso de vendas.</p>
                    </a>
                     <div className="border-t border-white/10" />
                     <a href="#" className="block group">
                        <p className="text-xs text-gray-500 mb-1">Fonte: ESPN • 2 dias atrás</p>
                        <p className="font-medium text-gray-200 group-hover:text-yellow-400 transition-colors">Neymar avança em recuperação e pode retornar antes do previsto.</p>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
