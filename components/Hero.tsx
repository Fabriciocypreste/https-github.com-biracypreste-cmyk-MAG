import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie, useStore } from '../store';

interface HeroProps {
  movie: Movie | null;
}

export default function Hero({ movie }: HeroProps) {
  const { openModal } = useStore();

  if (!movie) return (
    <div className="relative h-[56.25vw] min-h-[80vh] md:min-h-[90vh] w-full bg-[#141414] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141414]" />
    </div>
  );

  const heroImage = movie.thumbnailUrl?.replace('w500', 'original');

  return (
    <div className="relative h-[56.25vw] min-h-[80vh] md:min-h-[90vh] w-full bg-background">
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={heroImage} 
          className="w-full h-full object-cover brightness-[0.6]"
          alt={movie.title} 
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 bg-gradient-to-t from-[#141414] to-transparent z-10" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      <div className="absolute top-[30%] md:top-[40%] left-[4%] md:left-[60px] w-[90%] md:w-[40%] z-20 flex flex-col gap-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg tracking-tighter leading-[0.9] line-clamp-2">
            {movie.title}
        </h1>
        <p className="text-white text-sm md:text-lg drop-shadow-md mt-4 line-clamp-3 font-medium">
          {movie.description}
        </p>

        <div className="flex flex-row gap-3 mt-4">
          <a href={`/watch/${movie.id}`}>
            <button className="bg-white text-black rounded flex flex-row items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 hover:bg-white/75 transition md:text-lg font-semibold">
              <Play className="w-5 h-5 fill-black" />
              Assistir
            </button>
          </a>
          <button 
            onClick={() => openModal(movie)}
            className="bg-[#6d6d6eb3] text-white rounded flex flex-row items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 hover:bg-[#6d6d6e66] transition md:text-lg font-semibold"
          >
            <Info className="w-5 h-5" />
            Mais Informações
          </button>
        </div>
      </div>
    </div>
  );
}