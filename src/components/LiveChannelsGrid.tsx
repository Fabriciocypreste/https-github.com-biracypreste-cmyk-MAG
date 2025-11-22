import React from 'react';
import { motion } from 'framer-motion';
import { Play, Wifi } from 'lucide-react';
import { Movie } from '../store';

interface ChannelCardProps {
  channel: Movie;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  return (
    <a href={`/watch/${channel.id}`}>
        <motion.div
        whileHover={{ scale: 1.05, y: -5, zIndex: 20 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="group relative aspect-video bg-[#1E1E1E] rounded-lg overflow-hidden cursor-pointer border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/30"
        >
        {/* Logo / Thumbnail */}
        <img
            src={channel.thumbnailUrl}
            alt={channel.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
        />

        {/* Live Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white z-10 shadow-sm">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            AO VIVO
        </div>

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div 
                initial={{ scale: 0.5 }} 
                whileHover={{ scale: 1.1 }} 
                className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30"
            >
                <Play className="w-6 h-6 fill-white text-white ml-1" />
            </motion.div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <h3 className="text-white text-sm font-bold truncate">{channel.title}</h3>
            <p className="text-xs text-gray-300 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-green-400" />
                {channel.genre[0] || 'Canal'}
            </p>
        </div>
        </motion.div>
    </a>
  );
};

interface LiveChannelsGridProps {
    channels: Movie[];
}

export default function LiveChannelsGrid({ channels }: LiveChannelsGridProps) {
  return (
    <div className="px-[4%] md:px-[60px] py-8 min-h-[60vh]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-600/20 rounded-lg">
             <Wifi className="w-6 h-6 text-red-500" />
        </div>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Canais Ao Vivo</h1>
            <p className="text-gray-400 text-sm">Assista à programação em tempo real dos seus canais favoritos.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {channels.map(channel => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
