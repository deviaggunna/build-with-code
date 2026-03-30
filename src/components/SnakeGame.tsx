import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setFood(generateFood([{ x: 10, y: 10 }]));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    gameRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y === 0) {
            setDirection({ x: 0, y: -1 });
            directionRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y === 0) {
            setDirection({ x: 0, y: 1 });
            directionRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x === 0) {
            setDirection({ x: -1, y: 0 });
            directionRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x === 0) {
            setDirection({ x: 1, y: 0 });
            directionRef.current = { x: 1, y: 0 };
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y
        };

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  // Auto-focus on mount
  useEffect(() => {
    gameRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto font-mono">
      <div className="w-full flex justify-between items-end mb-4 px-2">
        <div className="text-cyan">
          <span className="text-xs text-gray-500 block">DATA_PACKETS_COLLECTED</span>
          <span 
            className="text-4xl md:text-5xl font-bold glitch-text tracking-widest !text-cyan"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="text-right">
          <span 
            className="text-2xl md:text-3xl font-bold glitch-text uppercase tracking-widest !text-magenta"
            data-text={gameOver ? 'SYSTEM_FAILURE' : isPaused ? 'PROCESS_SUSPENDED' : 'ENTITY_ACTIVE'}
          >
            {gameOver ? 'SYSTEM_FAILURE' : isPaused ? 'PROCESS_SUSPENDED' : 'ENTITY_ACTIVE'}
          </span>
        </div>
      </div>

      <div 
        ref={gameRef}
        tabIndex={0}
        className="relative bg-black border-4 border-cyan shadow-[0_0_30px_rgba(0,255,255,0.2)] outline-none focus:border-white transition-colors"
        style={{ 
          width: '100%', 
          aspectRatio: '1/1',
          maxWidth: '500px'
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)',
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }}
        />

        {/* Food */}
        <div 
          className="absolute bg-magenta shadow-[0_0_10px_#FF00FF] animate-pulse"
          style={{
            width: `${100/GRID_SIZE}%`,
            height: `${100/GRID_SIZE}%`,
            left: `${food.x * (100/GRID_SIZE)}%`,
            top: `${food.y * (100/GRID_SIZE)}%`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div 
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute bg-cyan"
            style={{
              width: `${100/GRID_SIZE}%`,
              height: `${100/GRID_SIZE}%`,
              left: `${segment.x * (100/GRID_SIZE)}%`,
              top: `${segment.y * (100/GRID_SIZE)}%`,
              opacity: index === 0 ? 1 : 0.8,
              boxShadow: index === 0 ? '0 0 15px #00FFFF' : 'none',
              transform: index === 0 ? 'scale(1.1)' : 'scale(0.9)',
            }}
          />
        ))}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <h2 className="text-4xl text-magenta glitch-text mb-4" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-cyan mb-6">FINAL_SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black transition-colors uppercase tracking-widest screen-tear"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
            <h2 className="text-3xl text-cyan tracking-widest animate-pulse">PAUSED</h2>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 w-full max-w-[500px] flex justify-between">
        <span>[W,A,S,D] OR [ARROWS] TO MOVE</span>
        <span>[SPACE] TO PAUSE</span>
      </div>
    </div>
  );
}
