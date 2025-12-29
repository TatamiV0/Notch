import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Sparkles, X, Download } from 'lucide-react';
import { Song } from '../types';
import { FigmaIcon, ClaudeIcon, SpotifyIcon } from './Icons';
import GeminiChat from './GeminiChat';

const SONGS: Song[] = [
  { title: 'Midnight City', artist: 'M83', duration: 243 },
  { title: 'Starboy', artist: 'The Weeknd', duration: 230 },
  { title: 'Nightcall', artist: 'Kavinsky', duration: 258 },
];

const Notch: React.FC = () => {
  // Time State
  const [time, setTime] = useState(new Date());

  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const currentSong = SONGS[currentSongIdx];

  // AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Spotify State
  const [showSpotifyPrompt, setShowSpotifyPrompt] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleNext = () => {
    setCurrentSongIdx((prev) => (prev + 1) % SONGS.length);
  };

  const handlePrev = () => {
    setCurrentSongIdx((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  };

  const toggleAi = () => {
    setIsAiOpen(!isAiOpen);
  };

  const handleOpenSpotify = () => {
    // Attempt to open the spotify:// protocol
    window.location.href = 'spotify://';
    
    // Heuristic: If the document is still visible after 1.5 seconds, 
    // it likely means the external app didn't capture focus (didn't open).
    setTimeout(() => {
        if (!document.hidden) {
            setShowSpotifyPrompt(true);
        }
    }, 1500);
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 select-none">
        {/* Notch Container */}
        <div className="bg-black text-white h-[44px] rounded-[22px] px-4 flex items-center shadow-2xl shadow-black/40 border border-white/5 relative transition-all duration-300 ease-in-out hover:scale-[1.01] max-w-[90vw] overflow-hidden">
          
          {/* Music Controls Section */}
          <div className="flex items-center gap-3 pr-4 border-r border-white/10 group">
            <button 
              onClick={handlePrev} 
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="text-white hover:scale-110 transition-transform p-1"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>
            <button 
              onClick={handleNext} 
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Song Info Section */}
          <div className="flex flex-col justify-center px-4 min-w-[120px] max-w-[200px] border-r border-white/10 h-full">
            <span className="text-[11px] font-semibold text-white leading-tight truncate">
              {currentSong.title}
            </span>
            <span className="text-[10px] text-gray-400 leading-tight truncate">
              {currentSong.artist}
            </span>
          </div>

          {/* Apps Section */}
          <div className="flex items-center gap-3 px-4 border-r border-white/10 h-full">
            <button 
              className="group relative" 
              title="Spotify"
              onClick={handleOpenSpotify}
            >
               <div className="absolute inset-0 bg-[#1DB954]/20 rounded-lg filter blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
               <SpotifyIcon className="w-5 h-5 text-[#1DB954] relative z-10 transition-transform group-hover:scale-110" />
            </button>

            <button className="group relative" title="Figma">
               <div className="absolute inset-0 bg-white/20 rounded-lg filter blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
               <FigmaIcon className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
            </button>
            
            <button 
              onClick={toggleAi} 
              className={`group relative ${isAiOpen ? 'scale-110' : ''}`}
              title="Gemini AI"
            >
               <div className={`absolute inset-0 bg-orange-500/20 rounded-lg filter blur-md transition-opacity ${isAiOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
               <ClaudeIcon className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Date & Time Section */}
          <div className="flex flex-col items-end justify-center pl-4 min-w-[90px]">
            <span className="text-[11px] font-bold text-white leading-tight tabular-nums">
              {formatTime(time)}
            </span>
            <span className="text-[9px] font-medium text-gray-400 leading-tight">
              {formatDate(time)}
            </span>
          </div>
        </div>
      </div>

      {/* Popups */}
      <GeminiChat isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Spotify Install Prompt */}
      {showSpotifyPrompt && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[320px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white shadow-2xl z-50 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-[#1DB954] p-1 rounded-full">
                         <SpotifyIcon className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="text-base font-semibold">Spotify not detected</h3>
                </div>
                <button onClick={() => setShowSpotifyPrompt(false)} className="text-white/50 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                We couldn't open the Spotify app. If it's not installed, you can download it below.
            </p>
            
            <div className="flex gap-2">
            <button 
                onClick={() => setShowSpotifyPrompt(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
            >
                Cancel
            </button>
            <a 
                href="https://spotify.com/download" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold text-center transition-colors"
                onClick={() => setShowSpotifyPrompt(false)}
            >
                <Download className="w-3 h-3" />
                Install Spotify
            </a>
            </div>
        </div>
      )}
    </>
  );
};

export default Notch;