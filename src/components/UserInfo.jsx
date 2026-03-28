import React, { useState } from 'react';
import { Music, ChevronDown, ChevronUp } from 'lucide-react';

const UserInfo = ({ video, onFollow }) => {
  const [expanded, setExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(video.user.isFollowing);
  const description = video.description;
  const shouldTruncate = description.length > 60;
  const truncatedDesc = shouldTruncate
    ? description.substring(0, 60) + '...'
    : description;

  const handleFollow = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to video player
    
    const newState = !isFollowing;
    setIsFollowing(newState);
    onFollow && onFollow(newState);
  };

  const handleExpandToggle = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to video player
    setExpanded(!expanded);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      {/* Main Container - Placed directly above progress bar with minimal gap */}
      <div className="px-4 pb-5">
        {/* Invisible Container - only for structural guidance to prevent text overflow */}
        <div className="mr-20">
          {/* Combined User Info Card */}
          <div className="flex items-start gap-3">
          {/* Avatar - Option 3 style with online indicator */}
          <div className="relative flex-shrink-0">
            <img
              src={video.user.avatar}
              alt={video.user.name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg"
            />
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* Info Container */}
          <div className="flex-1 min-w-0">
            {/* Name and Follow Button - Option 2 style */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-semibold text-sm">@{video.user.name}</span>
              <button
                onClick={handleFollow}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  isFollowing
                    ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            
            {/* Description - Option 5 style with expand/collapse */}
            <p className="text-white/80 text-xs leading-relaxed mb-1">
              {expanded ? description : truncatedDesc}
              {shouldTruncate && (
                <button
                  onClick={handleExpandToggle}
                  className="ml-1 text-gray-400 hover:text-white inline-flex items-center transition-colors"
                >
                  {expanded ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                </button>
              )}
            </p>
            
            {/* Music with Visualizer - Option 4 style */}
            <div className="flex items-center gap-2">
              {/* Animated visualizer bars */}
              <div className="flex items-center gap-0.5">
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <Music size={12} className="text-pink-400" />
              <span className="text-white/70 text-xs truncate flex-1">{video.music}</span>
            </div>
          </div>
        </div>
        </div> {/* Closing transparent container */}
      </div>
    </div>
  );
};

export default UserInfo;