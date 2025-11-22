import React, { useEffect } from 'react';
import { X, Play, Plus, ThumbsUp, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export default function Modal() {
  const { currentMovie, closeModal } = useStore();

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!currentMovie) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto scrollbar-hide">
        {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl mx-auto mt-12 md:mt-24 rounded-md overflow-hidden bg-[#181818] shadow-2xl mb-20">
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 bg-[#181818] rounded-full p-2 hover:bg-white hover:text-black transition border border-white/20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hero Image / Video Placeholder */}
        <div className="relative w-full aspect-video">
          <img 
            src={currentMovie.thumbnailUrl} 
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#181818] to-transparent" />

          {/* Modal Controls */}
          <div className="absolute bottom-8 left-8 md:left-12 flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl font-black text-white">{currentMovie.title}</h2>
            
            <div className="flex items-center gap-3">
                <button className="bg-white text-black px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-opacity-80 transition">
                    <Play className="w-5 h-5 fill-black" />
                    Assistir
                </button>
                <button className="bg-gray-500/50 text-white px-4 py-2 rounded-full border border-gray-400/50 hover:border-white hover:bg-white/10 transition">
                    <Plus className="w-5 h-5" />
                </button>
                <button className="bg-gray-500/50 text-white px-4 py-2 rounded-full border border-gray-400/50 hover:border-white hover:bg-white/10 transition">
                    <ThumbsUp className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-8 md:px-12 py-6 grid md:grid-cols-[2fr_1fr] gap-8">
            {/* Left Column */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-base">
                    <span className="text-green-400 font-bold">{currentMovie.match}% Relevante</span>
                    <span className="text-gray-400">{currentMovie.year}</span>
                    <span className="border border-gray-500 px-1.5 text-sm rounded text-white">{currentMovie.rating}</span>
                    <span className="text-gray-400">{currentMovie.duration}</span>
                </div>
                
                <p className="text-white text-base md:text-lg leading-relaxed font-light">
                    {currentMovie.description}
                </p>

                {/* Dummy Episodes Section */}
                <div className="pt-8 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-bold">Episódios</h3>
                         <span className="text-sm text-gray-400">Temporada 1</span>
                    </div>
                    
                    {[1, 2, 3].map((ep) => (
                         <div key={ep} className="flex items-center gap-4 p-4 hover:bg-[#333] rounded-lg cursor-pointer transition border-b border-gray-700 last:border-0">
                             <div className="text-xl text-gray-400 font-bold">{ep}</div>
                             <div className="w-32 h-20 bg-gray-700 rounded overflow-hidden relative group">
                                <img src={currentMovie.thumbnailUrl} className="w-full h-full object-cover opacity-60" alt="" />
                                <Play className="w-8 h-8 absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition" />
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between">
                                    <h4 className="font-bold text-sm">Episódio {ep}</h4>
                                    <span className="text-sm text-gray-400">45m</span>
                                 </div>
                                 <p className="text-xs text-gray-400 mt-2 line-clamp-2">Uma breve sinopse deste episódio específico vai aqui para dar contexto ao espectador.</p>
                             </div>
                         </div>
                    ))}
                </div>
            </div>

            {/* Right Column */}
            <div className="text-sm space-y-4">
                <div>
                    <span className="text-gray-500">Elenco: </span>
                    <span className="text-white hover:underline cursor-pointer">Ator Um</span>, <span className="text-white hover:underline cursor-pointer">Ator Dois</span>, <span className="text-white hover:underline cursor-pointer">Ator Três</span>
                </div>
                <div>
                    <span className="text-gray-500">Gêneros: </span>
                    {currentMovie.genre.map((g, i) => (
                        <span key={i} className="text-white hover:underline cursor-pointer mr-1">{g}{i < currentMovie.genre.length - 1 ? ',' : ''}</span>
                    ))}
                </div>
                <div>
                    <span className="text-gray-500">Este título é: </span>
                    <span className="text-white">Empolgante, Suspense</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}