import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import Modal from './components/Modal';
import AIChat from './components/AIChat';
import { useStore, Movie } from './store';
import { getFeaturedMatch, getUpcomingMatches, getStandings, getAllTeams } from './services/futebolApi';
import { getAllContent } from './services/m3uService';
import { Match, Standing, Team } from './types/futebol';
import { motion, AnimatePresence } from 'framer-motion';
import LiveChannelsGrid from './components/LiveChannelsGrid';
import SearchResultsGrid from './components/SearchResultsGrid';
import FutebolPage from './pages/FutebolPage';
import { ListX, Clock, WifiOff } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';

export default function StreamingApp() {
  const { isModalOpen, myList, watchLaterList, searchQuery, setSearchQuery } = useStore();
  
  const [activeCategory, setActiveCategory] = useState('Início');
  const [isLoading, setIsLoading] = useState(true);

  // M3U Content
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [liveChannels, setLiveChannels] = useState<Movie[]>([]);

  // Futebol Content
  const [featuredMatch, setFeaturedMatch] = useState<Match | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  
  const showHero = ['Início', 'Séries', 'Filmes'].includes(activeCategory) && searchQuery.trim() === '';

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);

      // Fetch M3U content
      const m3uContent = await getAllContent();

      const allMovies = m3uContent.filter(c => c.media_type === 'movie');
      const allSeries = m3uContent.filter(c => c.media_type === 'tv' && !c.genre.some(g => g.toLowerCase().includes('canais')));
      const allLiveChannels = m3uContent.filter(c => c.genre.some(g => g.toLowerCase().includes('canais')));
      
      setMovies(allMovies);
      setSeries(allSeries);
      setLiveChannels(allLiveChannels);
      
      const heroCandidates = [...allMovies, ...allSeries];
      if (heroCandidates.length > 0) {
        setHeroMovie(heroCandidates[Math.floor(Math.random() * heroCandidates.length)]);
      }

      // Fetch Futebol content
      const [fMatch, uMatches, serieAStandings, teams] = await Promise.all([
        getFeaturedMatch(),
        getUpcomingMatches(),
        getStandings(),
        getAllTeams()
      ]);
      setFeaturedMatch(fMatch);
      setUpcomingMatches(uMatches);
      setStandings(serieAStandings);
      setAllTeams(teams);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const allContent = useMemo(() => [...movies, ...series, ...liveChannels], [movies, series, liveChannels]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allContent.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allContent, searchQuery]);

  const handleMenuClick = (category: string) => {
      setSearchQuery(''); // Clear search when changing category
      setActiveCategory(category);
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    
    if (allContent.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <WifiOff className="w-16 h-16 text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Nenhum conteúdo encontrado</h2>
                <p className="text-gray-400 max-w-md">
                    Parece que nenhuma lista M3U foi sincronizada. Por favor, vá para o{' '}
                    <a href="/admin/m3u-playlist" className="text-red-500 hover:underline font-bold">Painel de Administração</a>{' '}
                    para adicionar e sincronizar uma playlist.
                </p>
          </div>
        )
    }

    switch (activeCategory) {
      case 'Séries':
        return (
          <>
            <Row title="Séries Populares" data={series.slice(0, 20)} isTop10={true} />
            <Row title="Adicionadas Recentemente" data={series.slice(20, 40)} />
          </>
        );
      case 'Filmes':
        return (
          <>
            <Row title="Filmes em Alta" data={movies.slice(0, 20)} isTop10={true} />
            <Row title="Ação e Aventura" data={movies.filter(m => m.genre.some(g => g.toLowerCase().includes('aç')))} />
            <Row title="Suspense" data={movies.filter(m => m.genre.some(g => g.toLowerCase().includes('suspense')))} />
          </>
        );
      case 'Futebol':
        return (
          <FutebolPage 
            featuredMatch={featuredMatch}
            upcomingMatches={upcomingMatches}
            standings={standings}
            teams={allTeams}
          />
        );
      case 'Canais Ao Vivo':
        return <LiveChannelsGrid channels={liveChannels} />;
      case 'Minha Lista':
        return (
          <div className="space-y-8 md:space-y-16">
            {myList.length > 0 ? (
              <Row title="Minha Lista" data={myList} />
            ) : (
              <EmptyListMessage
                icon={<ListX className="w-16 h-16 text-gray-600 mb-2" />}
                rowTitle="Minha Lista"
                title="Sua lista está vazia"
                message="Adicione séries e filmes à sua lista para que eles apareçam aqui. Procure pelo ícone '+' ou '✓' nos cards."
              />
            )}

            {watchLaterList.length > 0 ? (
              <Row title="Assistir Mais Tarde" data={watchLaterList} />
            ) : (
              <EmptyListMessage
                icon={<Clock className="w-16 h-16 text-gray-600 mb-2" />}
                rowTitle="Assistir Mais Tarde"
                title="Nada para assistir mais tarde"
                message="Adicione títulos a esta lista para encontrá-los facilmente depois. Procure pelo ícone de relógio nos cards."
              />
            )}
          </div>
        );
      case 'Início':
      default:
        return (
          <>
            <Row title="Em Alta" data={[...movies, ...series].sort(() => 0.5 - Math.random()).slice(0, 20)} />
            <Row title="Top 10 Filmes" data={movies.slice(0, 10)} isTop10={true} />
            <Row title="Séries para Maratonar" data={series.slice(0, 20)} />
            <Row title="Filmes de Ação" data={movies.filter(m => m.genre.some(g => g.toLowerCase().includes('aç'))).slice(0, 20)} />
            <Row title="Séries de Crime" data={series.filter(m => m.genre.some(g => g.toLowerCase().includes('crime'))).slice(0, 20)} />
          </>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-white font-sans antialiased">
      <Navbar activeCategory={activeCategory} onMenuClick={handleMenuClick} />
      
      <AnimatePresence>
        {showHero && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Hero movie={heroMovie} />
            </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`relative z-20 pb-20 flex flex-col overflow-hidden min-h-[500px] ${showHero ? '-mt-32 lg:-mt-48' : 'pt-28'}`}>
        {searchQuery.trim().length > 0 ? (
          <SearchResultsGrid results={searchResults} query={searchQuery} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 md:gap-12"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && <Modal />}
      </AnimatePresence>

      <AIChat />
      
      <Footer />
    </div>
  );
}

const EmptyListMessage = ({ icon, title, rowTitle, message }: { icon: React.ReactNode, title: string, rowTitle: string, message: string }) => (
  <div className="space-y-0.5 md:space-y-2">
      <h2 className="text-sm font-semibold text-[#e5e5e5] md:text-xl lg:text-2xl z-50 relative pl-[4%] md:pl-[60px]">
        {rowTitle}
      </h2>
      <div className="flex items-center gap-4 rounded-lg p-8 text-center justify-center flex-col min-h-[250px]">
          {icon}
          <h3 className="font-bold text-xl text-gray-400">{title}</h3>
          <p className="text-gray-500 text-sm max-w-md">{message}</p>
      </div>
  </div>
);


function Footer() {
  return (
    <footer className="max-w-[1000px] mx-auto w-full py-16 px-4 text-[#808080] text-sm">
       <div className="mb-8">
         <img 
            src="https://chemorena.com/redfliz.png" 
            alt="RedFlix" 
            className="h-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
          />
      </div>
      <div className="flex gap-6 mb-4">
        <SocialIcon />
        <SocialIcon />
        <SocialIcon />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Audiodescrição</li>
          <li className="hover:underline cursor-pointer">Relações com Investidores</li>
          <li className="hover:underline cursor-pointer">Avisos Legais</li>
        </ul>
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Centro de Ajuda</li>
          <li className="hover:underline cursor-pointer">Carreiras</li>
          <li className="hover:underline cursor-pointer">Preferências de Cookies</li>
        </ul>
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Cartões Pré-pagos</li>
          <li className="hover:underline cursor-pointer">Termos de Uso</li>
          <li className="hover:underline cursor-pointer">Informações Corporativas</li>
        </ul>
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Imprensa</li>
          <li className="hover:underline cursor-pointer">Privacidade</li>
          <li className="hover:underline cursor-pointer">Entre em Contato</li>
          {/* Admin Panel Link */}
          <li className="pt-4">
             <a href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors duration-300 font-medium group">
                <ShieldCheck className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                Painel Admin
             </a>
          </li>
        </ul>
      </div>
      <div className="mt-8 border border-[#808080] p-2 w-fit cursor-pointer hover:text-white">
        Código do Serviço
      </div>
      <div className="mt-4 text-[11px]">
        © 2025 RedFlix, Inc.
      </div>
    </footer>
  )
}

function SocialIcon() {
  return (
    <svg className="w-6 h-6 text-white cursor-pointer hover:opacity-80" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
  )
}