
import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  url: string;
  theme: 'normal' | 'upside-down';
}

declare global {
  interface Window {
    Hls: any;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, theme }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.Hls.isSupported()) {
      const hls = new window.Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log("Auto-play blocked"));
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    }
  }, [url]);

  const borderColor = theme === 'normal' ? 'border-red-600' : 'border-blue-900';
  const shadowColor = theme === 'normal' ? 'shadow-[0_0_30px_rgba(229,9,20,0.3)]' : 'shadow-[0_0_30px_rgba(0,191,255,0.2)]';

  return (
    <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 ${borderColor} ${shadowColor} transition-all duration-700`}>
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        playsInline
      />
      {theme === 'upside-down' && (
        <div className="absolute inset-0 pointer-events-none bg-blue-900/10 mix-blend-overlay" />
      )}
    </div>
  );
};

export default VideoPlayer;
