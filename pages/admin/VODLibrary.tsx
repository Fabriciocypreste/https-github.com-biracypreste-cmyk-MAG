
import React, { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';
import { Film, Star, Save, Loader, Search } from 'lucide-react';
import { Movie } from '../../store';
import { requests, fetchMovies } from '../../services/tmdb';
import { getCuratedContent, updateCuratedContent, CuratedList } from '../../services/adminApi';

type CurationState = {
    heroCandidates: Set<number>;
    originals: Set<number>;
    trending: Set<number>;
};

export default function VODLibrary() {
  const [allContent, setAllContent] = useState<Movie[]>([]);
  const [curation, setCuration] = useState<CurationState>({
    heroCandidates: new Set(),
    originals: new Set(),
    trending: new Set()
  });
  const [initialCuration, setInitialCuration] = useState<CurationState>({
    heroCandidates: new Set(),
    originals: new Set(),
    trending: new Set()
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch all content from TMDB to populate library
      const allUrls = Object.values(requests);
      const allMoviesPromises = allUrls.map(url => fetchMovies(url));
      const allMoviesArrays = await Promise.all(allMoviesPromises);
      
      const flatMovies = allMoviesArrays.flat();
      const uniqueMovies = Array.from(new Map(flatMovies.map(m => [m.id, m])).values());
      setAllContent(uniqueMovies);

      // Fetch current curation state
      const curatedLists = await getCuratedContent();
      const heroSet = new Set(curatedLists.find(l => l.id === 'heroCandidates')?.movies.map(m => m.id));
      const originalsSet = new Set(curatedLists.find(l => l.id === 'originals')?.movies.map(m => m.id));
      const trendingSet = new Set(curatedLists.find(l => l.id === 'trending')?.movies.map(m => m.id));
      
      const currentCurationState = { heroCandidates: heroSet, originals: originalsSet, trending: trendingSet };
      setCuration(currentCurationState);
      setInitialCuration(currentCurationState);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const hasChanges = useMemo(() => {
    return JSON.stringify(Array.from(curation.heroCandidates)) !== JSON.stringify(Array.from(initialCuration.heroCandidates)) ||
           JSON.stringify(Array.from(curation.originals)) !== JSON.stringify(Array.from(initialCuration.originals)) ||
           JSON.stringify(Array.from(curation.trending)) !== JSON.stringify(Array.from(initialCuration.trending));
  }, [curation, initialCuration]);
  
  const handleToggle = (list: keyof CurationState, movieId: number) => {
    setCuration(prev => {
      const newList = new Set(prev[list]);
      if (newList.has(movieId)) {
        newList.delete(movieId);
      } else {
        newList.add(movieId);
      }
      return { ...prev, [list]: newList };
    });
  };

  const handleSaveChanges = async () => {
    const updatedLists: CuratedList[] = [
      { id: 'heroCandidates', movies: allContent.filter(m => curation.heroCandidates.has(m.id)) },
      { id: 'originals', movies: allContent.filter(m => curation.originals.has(m.id)) },
      { id: 'trending', movies: allContent.filter(m => curation.trending.has(m.id)) }
    ];
    await updateCuratedContent(updatedLists);
    setInitialCuration(curation); // Update initial state to reflect saved changes
    alert('Curadoria salva com sucesso!');
  };

  const filteredContent = useMemo(() => {
    return allContent.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allContent, searchTerm]);

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <Breadcrumbs items={[{ label: 'Biblioteca VOD' }]} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Biblioteca de Conteúdo (VOD)</h1>
        <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-[80px]"></th>
                <th className="py-3 px-4">Título</th>
                <th className="py-3 px-4 text-center">Herói</th>
                <th className="py-3 px-4 text-center">Original</th>
                <th className="py-3 px-4 text-center">Em Alta</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-20"><Loader className="w-8 h-8 animate-spin mx-auto text-red-500"/></td></tr>
              ) : (
                filteredContent.map(movie => (
                  <tr key={movie.id} className="border-b border-white/5 hover:bg-white/[.02] transition-colors">
                    <td className="p-2">
                        <img src={movie.thumbnailUrl} alt={movie.title} className="w-28 h-16 object-cover rounded-md" />
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-white text-sm">{movie.title}</p>
                      <p className="text-xs text-gray-500">{movie.year} • {movie.genre.slice(0, 2).join(', ')}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                        <button onClick={() => handleToggle('heroCandidates', movie.id)} title="Marcar como candidato a Herói">
                            <Star className={`w-5 h-5 transition-all ${curation.heroCandidates.has(movie.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`} />
                        </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                        <Toggle active={curation.originals.has(movie.id)} onChange={() => handleToggle('originals', movie.id)} />
                    </td>
                    <td className="py-4 px-4 text-center">
                         <Toggle active={curation.trending.has(movie.id)} onChange={() => handleToggle('trending', movie.id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
            <button 
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
        </div>
      )}
    </div>
  );
}

const Toggle = ({ active, onChange }: { active: boolean; onChange: () => void; }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? 'bg-red-600' : 'bg-gray-700'}`}
      role="switch"
      aria-checked={active}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);
