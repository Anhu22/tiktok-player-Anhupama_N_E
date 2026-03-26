import React from 'react';
import { Music2 } from 'lucide-react';

const MusicDisc = ({ musicCover, isPlaying }) => {
  return (
    <div className="absolute bottom-20 right-2 sm:right-4 z-10">
      <div className="relative">
        {/* Spinning Disc Container */}
        <div 
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 overflow-hidden backdrop-blur-sm ${
            isPlaying ? 'spinning' : 'spinning paused'
          }`}
        >
          <img 
            src={musicCover} 
            alt="Music cover"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Inner Circle (Vinyl Record Effect) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-white/50"></div>
        </div>
        
        {/* Music Note Overlay */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <Music2 size={8} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicDisc;
