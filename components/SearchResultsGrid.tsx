
import React from 'react';
import { Movie } from '../store';
import MovieCard from './MovieCard';

interface SearchResultsGridProps {
  results: Movie[];
  query: string;
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({ results, query }) => {
  if (results.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Nenhum resultado encontrado para "{query}"</h2>
        <p className="text-gray-400 max-w-md">Tente buscar por outro título, ator ou gênero.</p>
      </div>
    );
  }

  return (
    <div className="px-[4%] md:px-[60px] py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-8 text-white">Resultados para "{query}"</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-24">
        {results.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsGrid;
