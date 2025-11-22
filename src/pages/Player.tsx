import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings, Info, Loader } from 'lucide-react';
import { getContentById } from '../services/m3uService';
import { Movie } from '../store';

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [content, setContent] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
        const pathParts = window.location.pathname.split('/');
        const contentId = pathParts[pathParts.length - 1];
        if (contentId) {
            const item = await getContentById(Number(contentId));
            setContent(item);
        }
        setIsLoading(false);
    };
    fetchContent();
  }, []);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleCanPlay = () => {
      setIsLoading(false);
      videoRef.current?.play();
      setIsPlaying(true);
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (isFinite(total)) {
        setProgress((current / total) * 100);
        setCurrentTime(formatTime(current));
        // Show next episode prompt near end
        if (total - current < 15 && total > 0) {
            setShowNextEpisode(true);
        } else {
            setShowNextEpisode(false);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
        if(isFinite(videoRef.current.duration)) {
            setDuration(formatTime(videoRef.current.duration));
        } else {
            setDuration("Ao Vivo");
        }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(videoRef.current?.duration && isFinite(videoRef.current.duration)) {
        const newTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
        if (videoRef.current) {
        videoRef.current.currentTime = newTime;
        setProgress(parseFloat(e.target.value));
        }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
          setVolume(0.5);
          videoRef.current.volume = 0.5;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const skip = (seconds: number) => {
      if (videoRef.current) {
          videoRef.current.currentTime += seconds;
      }
  };

  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  return (
    <div 
        className="relative h-screen w-screen bg-black overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {content?.videoUrl ? (
          <video 
            ref={videoRef}
            className="h-full w-full object-contain" 
            onClick={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            src={content.videoUrl}
            playsInline
          />
      ) : (
         <div className="h-full w-full flex items-center justify-center text-gray-400">
             {isLoading ? <Loader className="w-12 h-12 animate-spin text-red-500" /> : 'Conteúdo não encontrado.'}
         </div>
      )}

      {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 pointer-events-none">
              <Loader className="w-12 h-12 animate-spin text-white" />
          </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 transition-opacity duration-500 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`absolute top-0 left-0 w-full p-6 z-20 flex items-center justify-between transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <a href="/" className="text-white hover:scale-110 transition-transform cursor-pointer p-2 bg-black/20 rounded-full backdrop-blur-sm">
            <ArrowLeft className="w-8 h-8" />
        </a>
        <div className="text-center">
            <h1 className="text-white text-2xl font-bold drop-shadow-lg">{content?.title || 'Carregando...'}</h1>
        </div>
        <button className="p-2 hover:bg-white/20 rounded-full transition">
            <Settings className="w-6 h-6 text-white" />
        </button>
      </div>

      {showNextEpisode && (
          <div className="absolute bottom-32 right-8 bg-white text-black p-4 rounded-lg shadow-2xl transform transition-all animate-in slide-in-from-right duration-500 max-w-xs z-30">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Próximo Episódio</p>
              <h3 className="font-bold text-lg leading-tight mb-3">Episódio 2</h3>
              <div className="flex gap-2">
                  <button className="flex-1 bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition">Assistir Agora</button>
                  <button onClick={() => setShowNextEpisode(false)} className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">✕</button>
              </div>
          </div>
      )}

      {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-8 h-8 fill-white text-white ml-1" />
              </div>
          </div>
      )}

      <div className={`absolute bottom-0 left-0 w-full px-8 pb-8 pt-20 z-20 transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        
        <div className="relative w-full h-1.5 bg-gray-600/50 rounded-full mb-4 cursor-pointer group/progress">
            <div 
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full" 
                style={{ width: `${progress}%` }} 
            />
             <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"
                style={{ left: `${progress}%` }}
             />
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={duration === 'Ao Vivo'}
            />
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button onClick={handlePlayPause} className="hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-8 h-8 fill-white text-white" /> : <Play className="w-8 h-8 fill-white text-white" />}
                </button>
                
                <button onClick={() => skip(-10)} className="group flex flex-col items-center justify-center gap-0.5 hover:text-white text-gray-300 transition disabled:opacity-50" disabled={duration === 'Ao Vivo'}>
                    <SkipBack className="w-6 h-6" />
                    <span className="text-[10px] font-bold">-10s</span>
                </button>

                <button onClick={() => skip(10)} className="group flex flex-col items-center justify-center gap-0.5 hover:text-white text-gray-300 transition disabled:opacity-50" disabled={duration === 'Ao Vivo'}>
                    <SkipForward className="w-6 h-6" />
                    <span className="text-[10px] font-bold">+10s</span>
                </button>

                <div className="flex items-center gap-2 group/volume">
                    <button onClick={toggleMute}>
                        {isMuted || volume === 0 ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={isMuted ? 0 : volume} 
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white rounded-lg appearance-none cursor-pointer ml-2"
                        />
                    </div>
                </div>
                
                <span className="text-sm font-medium text-gray-300">{currentTime} / {duration}</span>
            </div>

            <div className="flex items-center gap-4">
                 <button className="text-white hover:text-gray-300 transition" title="Episódios">
                    <Info className="w-6 h-6" />
                 </button>
                 <button onClick={toggleFullscreen} className="text-white hover:scale-110 transition-transform">
                    <Maximize className="w-6 h-6" />
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
}