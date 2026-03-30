import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: '01',
    title: 'NEURAL_NET_LULLABY.wav',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '06:12'
  },
  {
    id: '02',
    title: 'DEEP_LEARNING_BEATS.ogg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '07:05'
  },
  {
    id: '03',
    title: 'SYNTHETIC_SORROW.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '05:44'
  }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col h-full font-mono text-cyan">
      <div className="flex items-center gap-2 mb-4 border-b border-magenta pb-2">
        <Terminal size={20} className="text-magenta animate-pulse" />
        <h2 className="text-xl uppercase tracking-widest text-magenta">AUDIO_SUBSYSTEM</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-6 relative">
          <div className="text-xs text-gray-500 mb-1">CURRENT_PROCESS:</div>
          <div className="text-lg truncate glitch-text" data-text={TRACKS[currentTrack].title}>
            {TRACKS[currentTrack].title}
          </div>
          <div className="text-xs text-magenta mt-1">ID: {TRACKS[currentTrack].id} // AI_GEN_MOCK</div>
        </div>

        {/* Fake Visualizer */}
        <div className="flex items-end gap-1 h-16 mb-6 opacity-80">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-cyan"
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                transition: 'height 0.1s ease',
                backgroundColor: i % 3 === 0 ? '#FF00FF' : '#00FFFF'
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-900 mb-6 relative overflow-hidden border border-cyan/30">
          <div 
            className="absolute top-0 left-0 h-full bg-magenta transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button onClick={prevTrack} className="p-2 hover:bg-cyan/20 hover:text-white transition-colors border border-transparent hover:border-cyan">
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="p-4 bg-magenta/10 border-2 border-magenta text-magenta hover:bg-magenta hover:text-black transition-colors screen-tear"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          
          <button onClick={nextTrack} className="p-2 hover:bg-cyan/20 hover:text-white transition-colors border border-transparent hover:border-cyan">
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        className="hidden"
      />

      <div className="mt-6 text-xs text-gray-600 border-t border-cyan/30 pt-2 flex justify-between">
        <span>STATUS: {isPlaying ? 'STREAMING' : 'IDLE'}</span>
        <span className="animate-pulse text-magenta">VOL: 100%</span>
      </div>
    </div>
  );
}
