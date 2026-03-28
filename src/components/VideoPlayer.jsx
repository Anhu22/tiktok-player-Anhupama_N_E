import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = ({ video, isActive, onPlay, onPause, onLike, isLiked, darkMode }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Start muted for immediate autoplay
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false); // Changed from showControls
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [hasResetForThisSession, setHasResetForThisSession] = useState(false);
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [wasPlayingBeforePress, setWasPlayingBeforePress] = useState(false);
  const lastTapTime = useRef(0);
  const longPressTimer = useRef(null);
  let overlayTimeout;

  // Handle video activation/deactivation - ALWAYS RESTART FROM BEGINNING
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        if (isActive) {
          // Always restart from beginning when video becomes active
          video.currentTime = 0;
          setProgress(0);
          setHasResetForThisSession(true);
          
          setIsLoading(true);
          
          if (video.readyState >= 2) {
            await video.play();
            setIsPlaying(true);
            setIsLoading(false);
          } else {
            // Wait for video to load
            video.addEventListener('canplay', async () => {
              await video.play();
              setIsPlaying(true);
              setIsLoading(false);
            }, { once: true });
          }
        } else {
          // Pause when not active
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
          // Reset session flag when video becomes inactive
          setHasResetForThisSession(false);
        }
      } catch (error) {
        console.log('Playback error:', error);
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    playVideo();

    return () => {
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [isActive, video.id]); // Add video.id to trigger when video changes

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
    // Don't show overlay if it was a double tap or long press
    if (isDoubleTap || isLongPress) {
      setIsDoubleTap(false);
      return;
    }
    showOverlayTemporarily(); // Show overlay for 1 second
    togglePlay(); // Toggle play/pause
  }, [togglePlay, isDoubleTap, isLongPress]);

  // Double tap ONLY triggers like animation - KEEPS VIDEO PLAYING
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
    
    // Ensure video keeps playing after double tap
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(e => console.log('Play after double tap failed:', e));
      setIsPlaying(true);
    }
  }, [onLike, isLiked]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsLongPress(false);
    setWasPlayingBeforePress(isPlaying);
    
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (isPlaying) {
        videoRef.current?.pause();
        setIsPlaying(false);
        showOverlayTemporarily();
      }
    }, 500); // 500ms for long press
  }, [isPlaying]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (isLongPress) {
      // Release after long press - resume if it was playing before
      if (wasPlayingBeforePress) {
        videoRef.current?.play();
        setIsPlaying(true);
      }
      setIsLongPress(false);
    }
  }, [isLongPress, wasPlayingBeforePress]);

  // Mobile touch handlers for double-tap detection
  const handleTouchStart = useCallback((e) => {
    console.log('Touch start detected:', e.touches.length, 'touches');
    setIsLongPress(false);
    setWasPlayingBeforePress(isPlaying);
    
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (isPlaying) {
        videoRef.current?.pause();
        setIsPlaying(false);
        showOverlayTemporarily();
      }
    }, 500); // 500ms for long press
  }, [isPlaying]);

  const handleTouchEnd = useCallback((e) => {
    console.log('Touch end detected:', e.touches.length, 'changedTouches', e.changedTouches);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (isLongPress) {
      // Release after long press - resume if it was playing before
      if (wasPlayingBeforePress) {
        videoRef.current?.play();
        setIsPlaying(true);
      }
      setIsLongPress(false);
      return; // Don't process tap/double-tap if it was a long press
    }
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    
    console.log('Touch end detected:', {
      currentTime,
      lastTapTime: lastTapTime.current,
      timeSinceLastTap,
      isLongPress
    });
    
    // Check if this is a double tap (within 300ms)
    if (timeSinceLastTap < 300) {
      // Double tap detected
      console.log('Double tap detected!');
      e.preventDefault();
      handleDoubleTap(e);
    } else if (timeSinceLastTap > 300) {
      // Single tap detected
      console.log('Single tap detected');
      handleTap();
    }
    
    lastTapTime.current = currentTime;
  }, [isLongPress, wasPlayingBeforePress, handleTap, handleDoubleTap]);

  return (
    <div 
      className="relative w-full h-full bg-black cursor-pointer video-container overflow-hidden"
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
        className={`absolute inset-0 w-full h-full object-cover ${darkMode ? 'brightness-75' : 'brightness-100'}`}
        loop={false}
        muted={isMuted} // Use dynamic mute state controlled by user
        playsInline
        preload="auto"
        data-id={video.id}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
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
      
      {/* Enhanced Video Loading Skeleton - Shows shimmer/placeholder while video buffers */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Video Frame Skeleton */}
            <div className={`absolute inset-4 ${darkMode ? 'bg-gray-900/90' : 'bg-gray-900/90'} rounded-xl overflow-hidden backdrop-blur-sm`}>
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'}`}>
                {/* Enhanced Shimmer Effect */}
                <div className="absolute inset-0 shimmer" 
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
                
                {/* Traditional Loading Buffer Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Outer spinning ring */}
                    <div className={`w-16 h-16 border-3 ${darkMode ? 'border-gray-600/30 border-t-white/60' : 'border-gray-600/30 border-t-white/60'} rounded-full animate-spin`}></div>
                    
                    {/* Inner spinning ring (counter-rotation) */}
                    <div className={`absolute inset-2 w-12 h-12 border-2 ${darkMode ? 'border-gray-600/20 border-b-blue-500/60' : 'border-gray-600/20 border-b-blue-500/60'} rounded-full animate-spin`} 
                      style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    
                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-2 h-2 ${darkMode ? 'bg-white/80' : 'bg-white/80'} rounded-full animate-pulse`}></div>
                    </div>
                  </div>
                </div>
                
                {/* Loading Progress Bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-2 ${darkMode ? 'bg-gray-800/80' : 'bg-gray-800/80'}`}>
                  <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                    style={{
                      animation: 'loadingProgress 2s ease-in-out infinite'
                    }}
                  ></div>
                </div>
                
                {/* Corner UI Elements */}
                <div className={`absolute top-3 left-3 w-10 h-10 ${darkMode ? 'bg-gray-700/40' : 'bg-gray-700/40'} rounded-lg animate-pulse`}></div>
                <div className={`absolute top-3 right-3 w-10 h-10 ${darkMode ? 'bg-gray-700/40' : 'bg-gray-700/40'} rounded-lg animate-pulse`}></div>
                <div className={`absolute bottom-6 left-3 w-20 h-3 ${darkMode ? 'bg-gray-700/40' : 'bg-gray-700/40'} rounded-full animate-pulse`}></div>
              </div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <div className={`text-sm font-medium animate-pulse ${darkMode ? 'text-white/50' : 'text-white/50'}`}>Buffering video...</div>
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