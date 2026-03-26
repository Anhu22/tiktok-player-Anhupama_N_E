# TikTok-Style Vertical Video Player - Technical Assessment

A complete TikTok-style vertical video player React application for Kamao.ai technical assessment.

## Features Implemented

### Core Features (Required)
- ✅ **Vertical Video Feed**: Full-screen vertical layout with smooth scroll navigation
- ✅ **Auto-play/Pause**: Videos auto-play when scrolled into view, auto-pause when scrolling away
- ✅ **Tap Controls**: Tap video area to toggle play/pause with icon overlay
- ✅ **Progress Bar**: Thin progress bar at bottom showing elapsed time
- ✅ **5 Sample Videos**: Minimum 5 videos with seamless infinite looping

### Interactive Overlays
- ✅ **Action Bar**: Right-side buttons for Like, Comment, Share, Bookmark with counts
- ✅ **User Info**: Bottom-left overlay with username and expandable descriptions
- ✅ **Music Disc**: Bottom-right spinning disc that rotates during playback
- ✅ **Sound Toggle**: Mute/unmute button for video audio

### Bonus Features (All Implemented)
- ✅ **Double-tap Like**: Large heart animation on double-tap
- ✅ **Follow Button**: Toggle Follow/Following on user avatar
- ✅ **Long-press Pause**: Hold to pause, release to resume
- ✅ **Loading Skeleton**: Shimmer effect while video buffers
- ✅ **Responsive Design**: Works on mobile (375×812) and desktop
- ✅ **Keyboard Navigation**: Arrow keys for navigation, Space for play/pause

## 🛠 Tech Stack

- **React 18+**: Functional components with hooks only
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **HTML5 Video**: Native `<video>` element (no external libraries)

## 📁 Project Structure

```
src/
├── components/
│   ├── VideoPlayer.jsx      # Main video player with all interactions
│   ├── ActionBar.jsx        # Right-side action buttons
│   ├── UserInfo.jsx         # User info and descriptions
│   ├── MusicDisc.jsx        # Spinning music disc
│   └── VideoSkeleton.jsx    # Loading skeleton component
├── App.jsx                  # Main app with video data and navigation
├── main.jsx                 # React entry point
└── index.css                # Global styles and animations
```

## 🎯 Key Technical Decisions

### Architecture
- **Component Decomposition**: Logical separation into reusable components
- **State Management**: React hooks (useState, useRef, useEffect)
- **Performance**: Only active video plays, others paused
- **Mobile-First**: Touch-optimized with proper gesture handling

### Video Management
- **Intersection Observer**: Detects which video is in viewport
- **Scroll Snap**: Smooth vertical navigation between videos
- **Auto-Restart**: Each video starts from 0:00 when navigated to
- **Retry Logic**: Handles browser auto-play restrictions

### Styling Approach
- **Tailwind Utility Classes**: Consistent design system
- **Custom CSS Animations**: Heart animations, disc spinning, shimmer effects
- **Responsive Design**: Mobile-optimized with desktop enhancements
- **Instagram Theme**: Modern gradient-based visual design

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Features Demonstrated

### Navigation
- **Swipe Gestures**: Up/down swipes navigate between videos
- **Scroll**: Smooth scrolling with snap points
- **Keyboard**: Arrow keys and spacebar support
- **Infinite Loop**: Seamless return to first video after last

### Interactions
- **Single Tap**: Play/pause toggle with visual feedback
- **Double Tap**: Like animation with count update
- **Long Press**: Pause while holding, resume on release
- **Button Actions**: Like, comment, share, bookmark functionality

### Visual Effects
- **Loading States**: Shimmer skeleton during video buffer
- **Progress Tracking**: Real-time progress bar updates
- **Hover States**: Interactive feedback on all buttons
- **Smooth Transitions**: All state changes animated

## 🎥 Demo Video

A comprehensive demo showcasing all features is available at:
[Demo Video Link - To be recorded and added here]

## 🔧 Known Limitations

1. **Auto-play Policy**: Some browsers require user interaction before auto-play
2. **Video Sources**: Uses public sample videos (replace with own content)
3. **Mobile Testing**: Best experienced on actual mobile devices

## 📊 Performance Metrics

- **Bundle Size**: Optimized with Vite tree-shaking
- **Load Time**: Fast initial load with lazy video loading
- **Memory Usage**: Only one video active at a time
- **Frame Rate**: Smooth 60fps animations and transitions

---

**Built for Kamao.ai React Developer Intern Assessment**  
*Confidential - March 2026*
