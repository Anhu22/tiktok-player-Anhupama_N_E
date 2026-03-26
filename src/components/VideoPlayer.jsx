import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Play, Pause, Volume2, VolumeX, User } from 'lucide-react';
import ActionBar from './ActionBar';
import UserInfo from './UserInfo';
import MusicDisc from './MusicDisc';
import VideoSkeleton from './VideoSkeleton';

const VideoPlayer = ({ video, isActive, onNavigate, onAction, onVideoChange, videosCount, currentIndex }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef(null);
  const lastTapTime = useRef(0);
  const touchStartY = useRef(0);
  const shouldRestart = useRef(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      const video = videoRef.current;
      
      // Ensure video is muted for auto-play
      video.muted = true;
      
      // Reset video to beginning
      video.currentTime = 0;
      setProgress(0);
      
      // Force play with multiple attempts
      const attemptPlay = () => {
        video.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Play attempt failed, retrying...', error);
          // Retry after a short delay
          setTimeout(attemptPlay, 200);
        });
      };
      
      // Start playing immediately
      attemptPlay();
      
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      
      // If video is active, ensure it's playing
      if (isActive) {
        video.currentTime = 0;
        video.play().catch(() => {});
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      onNavigate('next');
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onNavigate]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
      showPlayPauseIcon();
    }
  }, [isPlaying]);

  const showPlayPauseIcon = () => {
    setShowPlayPauseOverlay(true);
    setTimeout(() => setShowPlayPauseOverlay(false), 1000);
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onAction(video.id, 'like', { isLiked: newLikedState });
    
    if (newLikedState) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 600);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    
    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }, 500);
  };

  const handleTouchEnd = (e) => {
    clearTimeout(longPressTimer.current);
    
    if (isLongPressing) {
      setIsLongPressing(false);
      if (videoRef.current && !isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = e.changedTouches[0].clientX - (touchStartX.current || e.changedTouches[0].clientX);

    // Store touch start X for horizontal swipe detection
    if (!touchStartX.current) {
      touchStartX.current = e.changedTouches[0].clientX;
    }

    // Enhanced swipe detection with lower threshold for better responsiveness
    if (Math.abs(deltaY) > 30) {
      if (deltaY > 0) {
        onNavigate('next');
      } else {
        onNavigate('prev');
      }
      return; // Exit early for navigation
    }

    // Handle taps and double-taps
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;
    
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) { // Only register as tap if minimal movement
      if (tapLength < 300 && tapLength > 0) {
        handleLike();
      } else if (tapLength > 50) { // Prevent accidental double-taps
        handlePlayPause();
      }
      
      lastTapTime.current = currentTime;
    }
  };

  // Add touch start X ref
  const touchStartX = useRef(0);

  const handleVideoClick = (e) => {
    if (e.target === videoRef.current) {
      handlePlayPause();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' && isActive) {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, handlePlayPause]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Instagram Reels Container */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {isLoading && <VideoSkeleton />}
        
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover rounded-lg"
          loop
          playsInline
          autoPlay
          muted={true}
          onClick={handleVideoClick}
          x-webkit-airplay="allow"
          webkit-playsinline="true"
        />

        {/* Instagram-style Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Instagram-style Play/Pause Overlay */}
        <div className={`play-pause-overlay ${showPlayPauseOverlay ? 'show' : ''}`}>
          <div className="bg-white/90 rounded-full p-4 backdrop-blur-sm">
            {isPlaying ? <Pause size={40} className="text-gray-800" /> : <Play size={40} className="text-gray-800" />}
          </div>
        </div>

        {/* Instagram-style Heart Animation */}
        {showHeartAnimation && (
          <div className="heart-animation animate">
            <div className="bg-white/90 rounded-full p-6 backdrop-blur-sm">
              <Heart size={60} fill="#ED4956" className="text-red-500" />
            </div>
          </div>
        )}

        {/* User Info Overlay */}
        <UserInfo 
          video={video}
          onAction={onAction}
        />

        {/* Action Bar */}
        <ActionBar 
          video={video}
          isLiked={isLiked}
          onLike={handleLike}
        />

        {/* Music Disc */}
        <MusicDisc 
          musicCover={video.musicCover}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
