'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import useVideoPlayback from '@/hooks/useVideoPlayback';

interface VideoCardProps {
  videoSrc: string;
  posterSrc: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor: string;
  link: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  badgeText,
  badgeColor,
  link
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handlePlay, handlePause, handleToggle } = useVideoPlayback();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile on component mount
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const onPlay = () => {
    if (videoRef.current && !isMobile) { // Only auto-play on non-mobile
      setIsLoading(true);
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(error => {
              console.log('Auto-play prevented:', error);
              setIsPlaying(false);
              setIsLoading(false);
            });
        }
      } catch (err) {
        console.error('Video play error:', err);
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  };

  const onPause = () => {
    if (videoRef.current && !isMobile) { // Only auto-pause on non-mobile
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      } catch (err) {
        console.error('Video pause error:', err);
      }
    }
  };

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking video
    if (videoRef.current) {
      if (videoRef.current.paused) {
        onPlay();
      } else {
        onPause();
      }
    }
  };

  return (
    <Link href={link} className={`video-hover-container rounded-md overflow-hidden shadow-sm border border-gray-100 md:h-[120px] h-[220px] hover:shadow-md transition-all duration-300 relative md:w-auto w-64 ${isPlaying ? 'video-playing' : ''}`}>
      {isLoading && <div className="video-loading"></div>}
      
      {!isPlaying && !isLoading && <div className="video-play-btn"></div>}
      
      <video 
        ref={videoRef}
        className="w-full h-full object-cover cursor-pointer" 
        loop 
        muted 
        playsInline
        preload="metadata"
        poster={posterSrc}
        onClick={onToggle}
        onMouseOver={isMobile ? undefined : onPlay} 
        onMouseOut={isMobile ? undefined : onPause}
        onLoadedData={() => setIsLoading(false)}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/30 p-4 text-white flex flex-col justify-end">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm font-medium">{subtitle}</p>
        <div className="flex justify-between items-center mt-1">
          <span 
            className={`bg-${badgeColor}-500 text-white px-2 py-0.5 text-xs rounded-full`}
          >
            {badgeText}
          </span>
          <span className="text-xs">Uniknaturals</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard; 