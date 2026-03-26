import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const ActionBar = ({ video, isLiked, onLike }) => {
  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this video!',
        text: video.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="absolute right-2 sm:right-4 bottom-20 flex flex-col items-center gap-4 sm:gap-6 z-10">
      {/* Like Button */}
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-110 touch-manipulation group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:scale-110 transition-transform"></div>
          <Heart 
            size={28} 
            className={`relative z-10 transition-all duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </div>
        <span className="text-white text-xs font-medium mt-1">
          {formatCount(isLiked ? video.likes + 1 : video.likes)}
        </span>
      </button>

      {/* Comment Button */}
      <button className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-110 touch-manipulation group">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:scale-110 transition-transform"></div>
          <MessageCircle size={28} className="relative z-10 text-white" />
        </div>
        <span className="text-white text-xs font-medium mt-1">
          {formatCount(video.comments)}
        </span>
      </button>

      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-110 touch-manipulation group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:scale-110 transition-transform"></div>
          <Share2 size={28} className="relative z-10 text-white" />
        </div>
        <span className="text-white text-xs font-medium mt-1">
          {formatCount(video.shares)}
        </span>
      </button>

      {/* Bookmark Button */}
      <button className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-110 touch-manipulation group">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:scale-110 transition-transform"></div>
          <Bookmark size={28} className="relative z-10 text-white" />
        </div>
      </button>
    </div>
  );
};

export default ActionBar;
