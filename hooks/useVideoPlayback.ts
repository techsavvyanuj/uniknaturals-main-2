import { useCallback } from 'react';

interface VideoPlaybackOptions {
  resetOnPause?: boolean;
}

/**
 * Custom hook for reliable video playback in various browser environments
 * Handles autoplay restrictions and provides error handling
 */
export function useVideoPlayback(options: VideoPlaybackOptions = {}) {
  const { resetOnPause = true } = options;

  /**
   * Handles playing a video element with proper promise handling for autoplay restrictions
   */
  const handlePlay = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement) return;

    try {
      const playPromise = videoElement.play();
      
      // Modern browsers return a promise from play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Video playback prevented:', error);
          
          // For browsers that block autoplay, we can show a poster image instead
          videoElement.controls = false;
        });
      }
    } catch (err) {
      console.error('Video play error:', err);
    }
  }, []);

  /**
   * Handles pausing a video element with error handling
   */
  const handlePause = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement) return;

    try {
      videoElement.pause();
      if (resetOnPause) {
        videoElement.currentTime = 0;
      }
    } catch (err) {
      console.error('Video pause error:', err);
    }
  }, [resetOnPause]);

  /**
   * Toggles video playback state - used for click events
   */
  const handleToggle = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement) return;

    if (videoElement.paused) {
      handlePlay(videoElement);
    } else {
      handlePause(videoElement);
    }
  }, [handlePlay, handlePause]);

  return {
    handlePlay,
    handlePause,
    handleToggle
  };
}

export default useVideoPlayback; 