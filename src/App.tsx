/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-mono">
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      <header className="mb-8 text-center z-10 w-full max-w-6xl">
        <h1 
          className="text-5xl md:text-7xl glitch-text font-bold uppercase tracking-widest text-white mb-2" 
          data-text="NEON_SERPENT.exe"
        >
          NEON_SERPENT.exe
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm md:text-base">
          <span className="text-magenta animate-pulse">SYSTEM.READY</span>
          <span className="text-gray-600">//</span>
          <span className="text-cyan">AUDIO.ONLINE</span>
        </div>
      </header>
      
      <main className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl z-10 items-stretch justify-center">
        {/* Game Container */}
        <div className="flex-1 border border-cyan/30 bg-black/80 p-6 shadow-[0_0_30px_rgba(0,255,255,0.1)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-50"></div>
          <SnakeGame />
        </div>

        {/* Music Player Container */}
        <div className="w-full lg:w-96 border border-magenta/30 bg-black/80 p-6 shadow-[0_0_30px_rgba(255,0,255,0.1)] backdrop-blur-md relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magenta to-transparent opacity-50"></div>
          <MusicPlayer />
        </div>
      </main>

      <footer className="mt-12 text-xs text-gray-600 z-10 text-center">
        <p>WARNING: EXTENDED EXPOSURE MAY CAUSE NEURAL DESYNC</p>
        <p className="mt-1">© 2084 CYBERNETICS CORP.</p>
      </footer>
    </div>
  );
}
