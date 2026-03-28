import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const ActionBar = ({ video, videoId, onLike, onComment, onShare, onBookmark, isBookmarked: initialBookmarked, isLiked: initialLiked }) => {
  const [liked, setLiked] = useState(initialLiked || false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked || false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  // Sync liked state with prop changes
  useEffect(() => {
    setLiked(initialLiked || false);
  }, [initialLiked]);

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to video player
    
    if (!liked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
    setLiked(!liked);
    onLike && onLike(!liked);
  };

  const handleBookmark = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to video player
    
    const newState = !bookmarked;
    setBookmarked(newState);
    onBookmark && onBookmark(newState);
  };

  const handleComment = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to video player
    onComment && onComment();
  };

  const handleShare = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to video player
    onShare && onShare();
  };

  return (
    <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
      {/* Like Button */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={handleLike}
          className="bg-black/50 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            size={28}
            className={`transition-all ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
        <span className="text-white text-xs mt-1 font-medium">{video.likes.toLocaleString()}</span>
        
        {/* Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Heart size={40} className="fill-red-500 text-red-500" />
          </div>
        )}
      </div>

      {/* Comment Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleComment}
          className="bg-black/50 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-transform"
        >
          <MessageCircle size={28} className="text-white" />
        </button>
        <span className="text-white text-xs mt-1 font-medium">{video.comments.toLocaleString()}</span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleShare}
          className="bg-black/50 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-transform"
        >
          <Share2 size={28} className="text-white" />
        </button>
        <span className="text-white text-xs mt-1 font-medium">{video.shares.toLocaleString()}</span>
      </div>

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        className="bg-black/50 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-transform"
      >
        <Bookmark
          size={28}
          className={`transition-all ${bookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`}
        />
      </button>
    </div>
  );
};

export default ActionBar;