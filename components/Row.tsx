
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../store';
import { motion } from 'framer-motion';

interface RowProps {
  title: string;
  data: Movie[];
  isTop10?: boolean;
}

export default function Row({ title, data, isTop10 = false }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  if (!data || data.length === 0) return null;

  return (
    <div className="group/row space-y-0.5 md:space-y-2 pl-[4%] md:pl-[60px] relative mb-8 z-40">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-xl lg:text-2xl z-50 relative">
        {title}
        <span className="ml-2 hidden text-xs font-semibold text-[#54b9c5] group-hover/row:inline-block transition-all duration-300">
          Explore All &gt;
        </span>
      </h2>
      
      <div className="relative group/slider">
        {/* Left Chevron */}
        <div 
          className={`absolute top-0 bottom-0 left-0 z-[60] w-14 bg-black/50 hover:bg-black/70 m-auto h-full cursor-pointer flex items-center justify-center transition opacity-0 group-hover/slider:opacity-100 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="w-9 h-9 text-white" />
        </div>

        {/* Cards Container */}
        <div 
          ref={rowRef}
          className="flex items-center gap-2 overflow-x-scroll no-scrollbar py-8 pr-[60px]"
          style={{ scrollBehavior: 'smooth' }}
          onMouseLeave={() => setHoveredCardId(null)}
        >
          {data.map((movie, index) => (
             <motion.div
                key={movie.id}
                onMouseEnter={() => setHoveredCardId(movie.id)}
                animate={{
                    scale: hoveredCardId === movie.id ? 1.05 : 1,
                    opacity: hoveredCardId !== null && hoveredCardId !== movie.id ? 0.5 : 1,
                    zIndex: hoveredCardId === movie.id ? 100 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
            >
                <MovieCard 
                    movie={movie} 
                    isTop10={isTop10} 
                    rank={index + 1}
                />
            </motion.div>
          ))}
        </div>

        {/* Right Chevron */}
        <div 
          className="absolute top-0 bottom-0 right-0 z-[60] w-14 bg-black/50 hover:bg-black/70 m-auto h-full cursor-pointer flex items-center justify-center transition opacity-0 group-hover/slider:opacity-100"
          onClick={() => handleClick('right')}
        >
          <ChevronRight className="w-9 h-9 text-white" />
        </div>
      </div>
    </div>
  );
}
