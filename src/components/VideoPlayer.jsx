import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = ({ video, isActive, onPlay, onPause, onLike, isLiked }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false); // Changed from showControls
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [hasResetForThisSession, setHasResetForThisSession] = useState(false);
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const lastTapTime = useRef(0);
  let overlayTimeout;
  let longPressTimer;

  // Handle video activation/deactivation - RESTART FROM BEGINNING
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        if (isActive) {
          // Only reset video when it becomes active AND it's a new video session
          if (!hasResetForThisSession && video.currentTime !== 0) {
            video.currentTime = 0;
            setProgress(0);
            setHasResetForThisSession(true);
          }
          
          setIsLoading(true);
          
          if (video.readyState >= 2) {
            await video.play();
            setIsPlaying(true);
            onPlay?.();
          } else {
            const canPlayHandler = async () => {
              try {
                await video.play();
                setIsPlaying(true);
                onPlay?.();
              } catch (error) {
                console.log('Autoplay failed:', error);
                setIsPlaying(false);
              }
              video.removeEventListener('canplay', canPlayHandler);
            };
            video.addEventListener('canplay', canPlayHandler);
          }
        } else {
          // When video becomes inactive, pause
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
            onPause?.();
          }
        }
      } catch (error) {
        console.log('Playback error:', error);
        setIsPlaying(false);
      }
    };

    playVideo();

    return () => {
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [isActive, onPlay, onPause, hasResetForThisSession]);

  // Reset the reset flag when video ID changes (new video)
  useEffect(() => {
    setHasResetForThisSession(false);
  }, [video.id]);

  // FIXED: Show overlay for exactly 1 second, then hide
  const showOverlayTemporarily = () => {
    setShowOverlay(true);
    clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(() => {
      setShowOverlay(false);
    }, 1000); // Exactly 1 second
  };

  // Update progress and buffer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    const handleLoadedData = () => {
      setDuration(video.duration);
      setIsLoading(false);
      
      if (isActive && video.paused) {
        video.play().catch(e => console.log('Play after load failed:', e));
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (isActive && video.paused) {
        video.play().catch(e => console.log('CanPlay play failed:', e));
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (isActive) {
        video.currentTime = 0;
        video.play().catch(e => console.log('Loop play failed:', e));
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isActive, isSeeking]);

  // Seek functionality
  const handleSeek = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * duration;
    
    video.currentTime = seekTime;
    setProgress(percentage * 100);
  }, [duration]);

  const handleSeekStart = useCallback(() => {
    setIsSeeking(true);
  }, []);

  const handleSeekEnd = useCallback(() => {
    setIsSeeking(false);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.log('Play failed:', error);
          setIsPlaying(false);
        });
    }
    showOverlayTemporarily(); // Show overlay for 1 second
  }, [isPlaying]);

  const toggleMute = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  const handleTap = useCallback(() => {
    // Don't show overlay if it was a double tap
    if (isDoubleTap) {
      setIsDoubleTap(false);
      return;
    }
    showOverlayTemporarily(); // Show overlay for 1 second
    togglePlay(); // Toggle play/pause
  }, [togglePlay, isDoubleTap]);

  // Double tap ONLY triggers like animation
  const handleDoubleTap = useCallback((e) => {
    e.stopPropagation();
    
    // Set flag to prevent play/pause overlay
    setIsDoubleTap(true);
    setTimeout(() => setIsDoubleTap(false), 300);
    
    // Show heart animation on double tap
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);
    
    // Only update like count if heart is not already red (not already liked)
    if (!isLiked) {
      onLike && onLike(true);
    }
    
    // Clear any pending overlay timeout
    if (overlayTimeout) {
      clearTimeout(overlayTimeout);
      setShowOverlay(false);
    }
  }, [onLike, isLiked]);

  const handleMouseDown = useCallback(() => {
    longPressTimer = setTimeout(() => {
      if (isPlaying) {
        videoRef.current?.pause();
        setIsPlaying(false);
        showOverlayTemporarily();
      }
    }, 500);
  }, [isPlaying]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }, []);

  // Mobile touch handlers for double-tap detection
  const handleTouchStart = useCallback((e) => {
    longPressTimer = setTimeout(() => {
      if (isPlaying) {
        videoRef.current?.pause();
        setIsPlaying(false);
        showOverlayTemporarily();
      }
    }, 500);
  }, [isPlaying]);

  const handleTouchEnd = useCallback((e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      
      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - lastTapTime.current;
      
      // Check if this is a double tap (within 300ms)
      if (timeSinceLastTap < 300) {
        // Double tap detected
        e.preventDefault();
        handleDoubleTap(e);
      } else if (timeSinceLastTap > 300) {
        // Single tap detected
        handleTap();
      }
      
      lastTapTime.current = currentTime;
    }
  }, [handleTap, handleDoubleTap]);

  return (
    <div 
      className="relative w-full h-full bg-black cursor-pointer video-container"
      onClick={handleTap}
      onDoubleClick={handleDoubleTap}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop={false}
        muted={isMuted}
        playsInline
        preload="auto"
        data-id={video.id}
      />
      
      {/* Heart Animation for Double Tap */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="animate-heartPop">
            <svg
              className="w-32 h-32 text-red-500 drop-shadow-2xl"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">
          <div className="absolute inset-0 shimmer" 
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
      )}
      
      {/* Video Loading Skeleton - Appears when video is not loaded */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Video Frame Skeleton */}
            <div className="absolute inset-4 bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 shimmer" 
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
                
                {/* Play Button Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-0 h-0 border-l-[20px] border-l-gray-400 border-y-[12px] border-y-transparent ml-1"></div>
                  </div>
                </div>
                
                {/* Loading Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div className="h-full w-1/3 bg-blue-500 rounded animate-pulse"></div>
                </div>
                
                {/* Corner Elements */}
                <div className="absolute top-2 left-2 w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-16 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <div className="text-white/60 text-sm animate-pulse">Loading video...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* SUBTLE PLAY/PAUSE OVERLAY - Shows for exactly 1 second on tap, then fades out */}
      {showOverlay && !isDoubleTap && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fadeOut">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 transition-all duration-300">
            {isPlaying ? (
              <Pause size={48} className="text-white/90" />
            ) : (
              <Play size={48} className="text-white/90 ml-1" />
            )}
          </div>
        </div>
      )}
      
      {/* Mute Button */}
      <button
        onClick={toggleMute}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2.5 rounded-full z-20 hover:bg-black/70 transition-all hover:scale-110 active:scale-95"
      >
        {isMuted ? (
          <VolumeX size={20} className="text-white" />
        ) : (
          <Volume2 size={20} className="text-white" />
        )}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 group">
        <div 
          className="relative w-full h-1 bg-gray-700 cursor-pointer hover:h-1.5 transition-all duration-200"
          onClick={handleSeek}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onMouseLeave={handleSeekEnd}
        >
          {/* Buffer Indicator */}
          <div
            className="absolute left-0 top-0 h-full bg-gray-500 transition-all duration-200"
            style={{ width: `${buffered}%` }}
          />
          
          {/* Playback Progress */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
          
          {/* Seek Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        
        {/* Time Display */}
        <div className="absolute -top-8 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
          {Math.floor((progress / 100) * duration / 60)}:{(Math.floor((progress / 100) * duration) % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;