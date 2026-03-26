import React, { useState } from 'react';
import { User, Plus, Music2 } from 'lucide-react';

const UserInfo = ({ video, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(video.user.isFollowing);

  const handleFollow = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    onAction(video.id, 'follow', { isFollowing: newFollowingState });
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, maxLines = 2) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    
    const truncated = lines.slice(0, maxLines).join('\n');
    return truncated + '...';
  };

  return (
    <div className="absolute bottom-4 left-3 sm:left-4 right-16 sm:right-20 z-10">
      <div className="flex items-center gap-2 sm:gap-3 mb-3">
        {/* User Avatar */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75"></div>
          <img 
            src={video.user.avatar} 
            alt={video.user.name}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
          />
          <button
            onClick={handleFollow}
            className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs font-bold touch-manipulation transition-all duration-200 ${
              isFollowing 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
            }`}
          >
            {isFollowing ? '✓' : <Plus size={10} />}
          </button>
        </div>

        {/* Username */}
        <div>
          <p className="text-white font-semibold text-xs sm:text-sm drop-shadow-lg">
            @{video.user.name}
          </p>
        </div>
      </div>

      {/* Video Description */}
      <div className="text-white text-xs sm:text-sm">
        <p className="whitespace-pre-wrap drop-shadow-lg">
          {isExpanded ? video.description : truncateText(video.description)}
        </p>
        {video.description.split('\n').length > 2 && (
          <button 
            onClick={toggleDescription}
            className="text-gray-300 font-semibold mt-1 hover:text-white transition-colors touch-manipulation text-xs"
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        )}
      </div>

      {/* Music Info */}
      <div className="flex items-center gap-2 mt-2">
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-spin-slow flex items-center justify-center">
          <Music2 size={8} className="text-white" />
        </div>
        <p className="text-white text-xs opacity-90 drop-shadow-lg">
          {video.music}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
