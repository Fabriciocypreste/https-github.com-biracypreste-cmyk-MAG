

import React, { useState, useRef } from 'react';
import { Play, Plus, ThumbsUp, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie, useStore } from '../store';

interface MovieCardProps {
  movie: Movie;
  isTop10?: boolean;
  rank?: number;
}

const cardVariants = {
  hidden: { scale: 1, opacity: 0, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  visible: {
    scale: 1.5,
    opacity: 1,
    y: -50,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      staggerChildren: 0.06, // Key change: adds delay between children animations
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};


const MovieCard: React.FC<MovieCardProps> = ({ movie, isTop10, rank }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openModal, myList, addToMyList, removeFromMyList } = useStore();

  const isInList = myList.some(m => m.id === movie.id);

  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInList) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(false);
  };

  return (
    <div 
      className={`relative bg-[#141414] flex-shrink-0 ${isTop10 ? 'w-[200px] md:w-[240px] aspect-[2/3] mr-10' : 'w-[200px] md:w-[280px] aspect-video'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Conteúdo estático do card */}
      <div className="w-full h-full rounded-md overflow-hidden relative">
        {isTop10 && rank ? (
          <div className="flex w-full h-full items-end relative">
             <svg className="h-full w-[50%] absolute -left-4 z-0 fill-black stroke-[#595959] stroke-2" viewBox="0 0 100 150" style={{strokeWidth: '4px'}}>
                <text x="10" y="130" fontSize="140" fontWeight="bold" className="drop-shadow-lg">{rank}</text>
             </svg>
             <img
              src={movie.thumbnailUrl}
              alt={movie.title}
              className="w-[70%] h-full object-cover rounded-md ml-auto relative z-10"
            />
          </div>
        ) : (
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>

      {/* Card expandido no hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-0 left-0 w-full bg-[#141414] rounded-md shadow-xl z-50 overflow-hidden origin-center border border-white/10"
            style={{ 
                width: isTop10 ? '140%' : '100%',
                top: isTop10 ? '-20%' : '-40%',
                left: isTop10 ? '-20%' : '0',
                zIndex: 99 
            }}
          >
            <div className="relative w-full aspect-video bg-black overflow-hidden">
              <motion.img
                src={movie.thumbnailUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-20" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-700/50">
                 <motion.div 
                    className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                 />
              </div>
            </div>

            <div className="p-4 space-y-2 bg-[#181818] shadow-lg">
              <motion.div variants={childVariants} className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="bg-white rounded-full p-1 hover:bg-neutral-300 transition transform hover:scale-110">
                    <Play className="w-4 h-4 fill-black text-black" />
                  </button>
                  <button 
                    onClick={handleListToggle}
                    className={`border-2 rounded-full p-1 transition ${isInList ? 'border-green-400 bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'border-gray-400 hover:border-white hover:bg-white/10 text-gray-300 hover:text-white'}`}
                  >
                    {isInList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  <button className="border-2 border-gray-400 rounded-full p-1 hover:border-white hover:bg-white/10 text-gray-300 hover:text-white transition">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                </div>
                <button 
                    className="border-2 border-gray-400 rounded-full p-1 hover:border-white hover:bg-white/10 text-gray-300 hover:text-white transition ml-auto"
                    onClick={() => openModal(movie)}
                    title="Mais Informações"
                >
                  <Info className="w-4 h-4" />
                </button>
              </motion.div>

              <motion.div variants={childVariants} className="flex items-center gap-2 text-[10px] font-semibold text-white">
                <span className="text-green-400">{movie.match}% Relevante</span>
                <span className="border border-gray-500 px-1 rounded text-gray-400">{movie.rating}</span>
                <span className="text-gray-400">{movie.duration}</span>
                <span className="border border-gray-500 px-1 rounded text-[8px] text-gray-400">HD</span>
              </motion.div>
              
              <motion.p variants={childVariants} className="text-[10px] text-gray-400 line-clamp-2">
                {movie.description}
              </motion.p>

              <motion.div variants={childVariants} className="flex flex-wrap gap-1.5">
                {movie.genre.slice(0, 3).map((g, i) => (
                  <span key={i} className="text-[10px] text-gray-300 flex items-center">
                    {g}
                    {i < movie.genre.slice(0, 3).length - 1 && <span className="text-gray-600 mx-1">•</span>}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MovieCard;