import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';

const videos = [
  {
    id: 1,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: { 
      name: "nature_lover", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature_lover",
      isFollowing: false 
    },
    description: "Beautiful nature scenes � #Nature #Wildlife",
    likes: 1240,
    comments: 89,
    shares: 45,
    music: "Nature Sounds - nature_lover",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music1"
  },
  {
    id: 2,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    user: { 
      name: "dream_catcher", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dream_catcher",
      isFollowing: false 
    },
    description: "Amazing animated scenes ✨ #Animation #Art",
    likes: 892,
    comments: 67,
    shares: 23,
    music: "Dream Music - dream_catcher",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music2"
  },
  {
    id: 3,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: { 
      name: "tech_creator", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech_creator",
      isFollowing: true 
    },
    description: "Tech and innovation content � #Tech #Innovation",
    likes: 2156,
    comments: 143,
    shares: 78,
    music: "Tech Beats - tech_creator",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music3"
  },
  {
    id: 4,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    user: { 
      name: "adventure_life", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adventure_life",
      isFollowing: false 
    },
    description: "Adventure and travel content �️ #Adventure #Travel",
    likes: 3421,
    comments: 234,
    shares: 156,
    music: "Adventure Vibes - adventure_life",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music4"
  },
  {
    id: 5,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    user: { 
      name: "fun_creator", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fun_creator",
      isFollowing: false 
    },
    description: "Fun and entertaining content � #Fun #Entertainment",
    likes: 1876,
    comments: 98,
    shares: 64,
    music: "Party Music - fun_creator",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music5"
  }
];

function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosData, setVideosData] = useState(videos);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Enhanced scroll detection for better navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const slideHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / slideHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videosData.length) {
        setCurrentVideoIndex(newIndex);
      }
    };

    // Add more videos for better demo
    const additionalVideos = [
      {
        id: 6,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        user: { 
          name: "adventure_life", 
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adventure_life",
          isFollowing: false 
        },
        description: "Adventure and travel content 🏔️ #Adventure #Travel",
        likes: 3421,
        comments: 234,
        shares: 156,
        music: "Adventure Vibes - adventure_life",
        musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music6"
      },
      {
        id: 7,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        user: { 
          name: "creative_mind", 
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative_mind",
          isFollowing: true 
        },
        description: "Creative content and art 🎨 #Creative #Art",
        likes: 4532,
        comments: 312,
        shares: 189,
        music: "Creative Beats - creative_mind",
        musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music7"
      }
    ];

    const allVideos = [...videos, ...additionalVideos];
    setVideosData(allVideos);

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentVideoIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateVideo('prev');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateVideo('next');
      } else if (e.key === ' ') {
        e.preventDefault();
        // Will be handled by VideoPlayer component
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex]);

  const navigateVideo = (direction) => {
    const totalVideos = videosData.length;
    if (direction === 'next') {
      setCurrentVideoIndex((prev) => (prev + 1) % totalVideos);
    } else {
      setCurrentVideoIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
    }
  };

  const handleVideoAction = (videoId, action, data) => {
    setVideosData(prev => prev.map(video => {
      if (video.id === videoId) {
        switch (action) {
          case 'like':
            return { ...video, likes: data.isLiked ? video.likes - 1 : video.likes + 1 };
          case 'follow':
            return { 
              ...video, 
              user: { ...video.user, isFollowing: data.isFollowing }
            };
          default:
            return video;
        }
      }
      return video;
    }));
  };

  // Smooth scroll to video
  const scrollToVideo = (index) => {
    const container = containerRef.current;
    if (container) {
      const slideHeight = container.clientHeight;
      container.scrollTo({
        top: index * slideHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full ig-container"></div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">InstaReels</span>
            <span className="text-xs text-gray-500 ml-2">{videosData.length} videos</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Video Container */}
      <div 
        ref={containerRef}
        className="video-container h-full overflow-y-scroll scrollbar-hide pt-16"
        style={{ 
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {videosData.map((video, index) => (
          <div
            key={video.id}
            ref={el => videoRefs.current[index] = el}
            className="video-slide h-screen flex items-center justify-center relative"
            style={{ 
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always'
            }}
          >
            <VideoPlayer
              video={video}
              isActive={index === currentVideoIndex}
              onNavigate={navigateVideo}
              onAction={handleVideoAction}
              onVideoChange={scrollToVideo}
              videosCount={videosData.length}
              currentIndex={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
