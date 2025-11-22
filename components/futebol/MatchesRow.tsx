
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MatchCard from './MatchCard';
import { Match } from '../../types/futebol';

interface MatchesRowProps {
  title: string;
  data: Match[];
}

export default function MatchesRow({ title, data }: MatchesRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

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
      </h2>
      
      <div className="relative group/slider">
        {/* Left Chevron */}
        <div 
          className={`absolute top-0 bottom-0 -left-14 z-[60] w-14 bg-black/50 hover:bg-black/70 m-auto h-full cursor-pointer flex items-center justify-center transition opacity-0 group-hover/slider:opacity-100 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="w-9 h-9 text-white" />
        </div>

        {/* Cards Container */}
        <div 
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-scroll no-scrollbar py-8 pr-[60px]"
          style={{ scrollBehavior: 'smooth' }}
        >
          {data.map((match) => (
            <MatchCard 
                key={match.id} 
                match={match} 
            />
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
