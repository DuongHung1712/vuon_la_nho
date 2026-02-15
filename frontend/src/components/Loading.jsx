import React from 'react';

const Loading = ({ fullScreen = true, size = 'default' }) => {
  const sizes = {
    small: { width: 48, height: 48 },
    default: { width: 80, height: 80 },
    large: { width: 128, height: 128 }
  };

  const currentSize = sizes[size];

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Icon container with grow animation */}
      <div 
        className="relative overflow-hidden"
        style={{ width: `${currentSize.width}px`, height: `${currentSize.height}px` }}
      >
        {/* Growing mask effect */}
        <div className="absolute inset-0 animate-grow-up">
          <img 
            src="/favicon.png" 
            alt="Loading" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Loading text with fade animation */}
      <div className="flex items-center gap-2 animate-pulse">
        <span className="text-primary-700 font-medium">Vườn Lá Nhỏ</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <LoadingContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <LoadingContent />
    </div>
  );
};

export default Loading;
