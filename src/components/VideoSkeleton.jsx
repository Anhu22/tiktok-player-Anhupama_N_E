import React from 'react';

const VideoSkeleton = () => {
  return (
    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 shimmer"></div>
        
        {/* Loading Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading video...</p>
          </div>
        </div>
        
        {/* Placeholder Shapes */}
        <div className="absolute bottom-4 left-4 right-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full shimmer"></div>
            <div className="w-24 h-4 bg-gray-700 rounded shimmer"></div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-3 bg-gray-700 rounded shimmer"></div>
            <div className="w-3/4 h-3 bg-gray-700 rounded shimmer"></div>
          </div>
        </div>
        
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
          <div className="w-8 h-8 bg-gray-700 rounded-full shimmer"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-full shimmer"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-full shimmer"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-full shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;
