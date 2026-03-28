import React, { useState, useEffect, useRef, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ActionBar from './components/ActionBar';
import UserInfo from './components/UserInfo';
import MusicDisc from './components/MusicDisc';

const videos = [
  {
    id: 1,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: { 
      name: "nature_lover", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature_lover",
      isFollowing: false 
    },
    description: "Beautiful nature scenes 🌿 #Nature #Wildlife This is a longer description to test the truncation feature and make sure it properly cuts off after two lines",
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
    description: "Tech and innovation content 🚀 #Tech #Innovation",
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
    description: "Adventure and travel content 🏔️ #Adventure #Travel",
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
    description: "Fun and entertaining content 🎉 #Fun #Entertainment",
    likes: 1876,
    comments: 98,
    shares: 64,
    music: "Party Music - fun_creator",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music5"
  },
  {
    id: 6,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    user: { 
      name: "adventure_seeker", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adventure_seeker",
      isFollowing: false 
    },
    description: "Amazing travel adventures around the world 🌍 #Travel #Adventure",
    likes: 5432,
    comments: 312,
    shares: 189,
    music: "Adventure Vibes - adventure_seeker",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music6"
  },
  {
    id: 7,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    user: { 
      name: "comedy_king", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=comedy_king",
      isFollowing: true 
    },
    description: "Hilarious comedy sketches that will make you laugh 😂 #Comedy #Funny",
    likes: 8765,
    comments: 543,
    shares: 321,
    music: "Comedy Beats - comedy_king",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music7"
  },
  {
    id: 8,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
    user: { 
      name: "joy_spreader", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joy_spreader",
      isFollowing: false 
    },
    description: "Spreading joy and happiness to everyone ✨ #Joy #Happiness",
    likes: 3210,
    comments: 198,
    shares: 145,
    music: "Happy Tunes - joy_spreader",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music8"
  },
  {
    id: 9,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    user: { 
      name: "foodie_master", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_master",
      isFollowing: true 
    },
    description: "Delicious food recipes and cooking tips 🍳 #Food #Cooking",
    likes: 6543,
    comments: 432,
    shares: 278,
    music: "Kitchen Rhythm - foodie_master",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music9"
  },
  {
    id: 10,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    user: { 
      name: "animation_studio", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=animation_studio",
      isFollowing: false 
    },
    description: "Stunning 3D animations and visual effects 🎬 #Animation #3D",
    likes: 9876,
    comments: 654,
    shares: 432,
    music: "Epic Soundtrack - animation_studio",
    musicCover: "https://api.dicebear.com/7.x/icons/svg?seed=music10"
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.id);
  const [likesStates, setLikesStates] = useState({});
  const [likedStates, setLikedStates] = useState({});
  const [bookmarkStates, setBookmarkStates] = useState({});
  const [followStates, setFollowStates] = useState({});
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Initialize states
  useEffect(() => {
    const initialLikes = {};
    const initialLiked = {};
    const initialBookmarks = {};
    const initialFollow = {};
    videos.forEach(video => {
      initialLikes[video.id] = video.likes;
      initialLiked[video.id] = false;
      initialBookmarks[video.id] = false;
      initialFollow[video.id] = video.user.isFollowing;
    });
    setLikesStates(initialLikes);
    setLikedStates(initialLiked);
    setBookmarkStates(initialBookmarks);
    setFollowStates(initialFollow);
  }, []);

  // Handle scroll with proper snapping and delay to ensure smooth playback
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Set scrolling flag to prevent rapid changes
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    
    const scrollTop = container.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
      setActiveVideoId(videos[newIndex].id);
    }
  }, [currentIndex]);

  // Seamless looping
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleLoop = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = (videos.length - 1) * window.innerHeight;
      
      // Loop from bottom to top
      if (scrollTop >= maxScroll - 50) {
        container.style.scrollBehavior = 'auto';
        container.scrollTop = 0;
        container.style.scrollBehavior = 'smooth';
        setCurrentIndex(0);
        setActiveVideoId(videos[0].id);
      }
      // Loop from top to bottom (optional)
      else if (scrollTop <= 50 && currentIndex === 0 && scrollTop > 0) {
        container.style.scrollBehavior = 'auto';
        container.scrollTop = maxScroll;
        container.style.scrollBehavior = 'smooth';
        setCurrentIndex(videos.length - 1);
        setActiveVideoId(videos[videos.length - 1].id);
      }
    };

    container.addEventListener('scroll', handleLoop);
    return () => container.removeEventListener('scroll', handleLoop);
  }, [videos.length, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          const newIndexUp = Math.max(0, currentIndex - 1);
          container.scrollTo({ top: newIndexUp * window.innerHeight, behavior: 'smooth' });
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newIndexDown = Math.min(videos.length - 1, currentIndex + 1);
          container.scrollTo({ top: newIndexDown * window.innerHeight, behavior: 'smooth' });
          break;
        case ' ':
        case 'Space':
          e.preventDefault();
          // Temporarily disabled keyboard play/pause
          const activeVideo = document.querySelector(`video[data-id="${activeVideoId}"]`);
          if (activeVideo) {
            if (activeVideo.paused) {
              activeVideo.play();
            } else {
              activeVideo.pause();
            }
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, activeVideoId, videos.length]);

  const handleLike = (videoId, isLiked) => {
    setLikesStates(prev => ({
      ...prev,
      [videoId]: isLiked ? (prev[videoId] + 1) : (prev[videoId] - 1)
    }));
    setLikedStates(prev => ({
      ...prev,
      [videoId]: isLiked
    }));
  };

  const handleBookmark = (videoId, isBookmarked) => {
    setBookmarkStates(prev => ({
      ...prev,
      [videoId]: isBookmarked
    }));
  };

  const handleFollow = (videoId, isFollowing) => {
    setFollowStates(prev => ({
      ...prev,
      [videoId]: isFollowing
    }));
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-scroll"
        style={{ 
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="relative h-screen w-full"
            style={{ scrollSnapAlign: 'start' }}
          >
            <VideoPlayer
              video={video}
              isActive={index === currentIndex}
              onPlay={() => console.log(`Video ${video.id} playing`)}
              onPause={() => console.log(`Video ${video.id} paused`)}
              onLike={(liked) => handleLike(video.id, liked)}
              isLiked={likedStates[video.id] || false}
            />
            
            <ActionBar
              video={{
                ...video,
                likes: likesStates[video.id] || video.likes,
                comments: video.comments,
                shares: video.shares
              }}
              videoId={video.id}
              onLike={(liked) => handleLike(video.id, liked)}
              onComment={() => console.log('Comment clicked')}
              onShare={() => console.log('Share clicked')}
              onBookmark={(bookmarked) => handleBookmark(video.id, bookmarked)}
              isBookmarked={bookmarkStates[video.id] || false}
              isLiked={likedStates[video.id] || false}
            />
            
            <UserInfo
              video={{
                ...video,
                user: {
                  ...video.user,
                  isFollowing: followStates[video.id] || false
                }
              }}
              onFollow={(following) => handleFollow(video.id, following)}
            />
            
            <MusicDisc
              isPlaying={index === currentIndex}
              coverImage={video.musicCover}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;