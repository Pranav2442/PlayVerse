import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 8;
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8C69', '#98D8E8'];

const ColorChainGame = () => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [moves, setMoves] = useState(25);
  const [animatingCells, setAnimatingCells] = useState(new Set());
  const [floatingScores, setFloatingScores] = useState([]);
  const [powerUps, setPowerUps] = useState({ bombs: 3, lightning: 3, shuffle: 2 });
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);
  const [hintCells, setHintCells] = useState([]);
  const [streak, setStreak] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const gridRef = useRef(null);


  useEffect(() => {
    try {
      const savedBestScore = localStorage.getItem('colorChainBestScore');
      if (savedBestScore) {
        setBestScore(parseInt(savedBestScore));
      }
    } catch (error) {
      console.log('Failed to load best score');
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (bestScore > 0) {
      try {
        localStorage.setItem('colorChainBestScore', bestScore.toString());
      } catch (error) {
        console.log('Failed to save best score');
      }
    }
  }, [bestScore]);

  const initializeGrid = useCallback(() => {
    let newGrid;
    let attempts = 0;
    
    do {
      newGrid = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        const gridRow = [];
        for (let col = 0; col < GRID_SIZE; col++) {
          let color;
          let colorAttempts = 0;
          do {
            color = COLORS[Math.floor(Math.random() * COLORS.length)];
            colorAttempts++;
            if (colorAttempts > 20) break;
          } while (
            colorAttempts <= 20 && (
              (col >= 2 && gridRow[col-1]?.color === color && gridRow[col-2]?.color === color) ||
              (row >= 2 && newGrid[row-1]?.[col]?.color === color && newGrid[row-2]?.[col]?.color === color)
            )
          );
          
          gridRow.push({
            color,
            id: `${row}-${col}-${Math.random()}`,
            matched: false,
            special: null,
            falling: false
          });
        }
        newGrid.push(gridRow);
      }
      attempts++;
    } while (findMatches(newGrid).matches.size > 0 && attempts < 10);
    
    return newGrid;
  }, []);

  const addFloatingScore = (points, row, col) => {
    const id = Date.now() + Math.random();
    const x = ((col + 0.5) / GRID_SIZE) * 100;
    const y = ((row + 0.5) / GRID_SIZE) * 100;

    setFloatingScores(prev => [...prev, {
      id,
      points,
      x: `${x}%`,
      y: `${y}%`,
    }]);
    
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(score => score.id !== id));
    }, 1000);
  };

  const addParticles = (row, col, color) => {
    const x = ((col + 0.5) / GRID_SIZE) * 100;
    const y = ((row + 0.5) / GRID_SIZE) * 100;

    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: `${x}%`,
      y: `${y}%`,
      color,
      vx: `${(Math.random() - 0.5) * 8}vw`, 
      vy: `${(Math.random() - 0.5) * 8 - 4}vh`
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 800);
  };

  const findMatches = useCallback((currentGrid) => {
    if (!currentGrid || currentGrid.length === 0) return { matches: new Set(), specialCells: new Set() };
    
    const matches = new Set();
    const specialCells = new Set();
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        if (currentGrid[row][col].color === currentGrid[row][col+1].color && currentGrid[row][col].color === currentGrid[row][col+2].color) {
            let endCol = col + 2;
            while(endCol + 1 < GRID_SIZE && currentGrid[row][col].color === currentGrid[row][endCol+1].color) {
                endCol++;
            }
            const matchLength = endCol - col + 1;
            const currentMatch = [];
            for (let i = col; i <= endCol; i++) {
                matches.add(`${row}-${i}`);
                currentMatch.push(`${row}-${i}`);
            }
            if (matchLength >= 4) specialCells.add(currentMatch[Math.floor(matchLength/2)]);
            col = endCol;
        }
      }
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
         if (currentGrid[row][col].color === currentGrid[row+1][col].color && currentGrid[row][col].color === currentGrid[row+2][col].color) {
            let endRow = row + 2;
            while(endRow + 1 < GRID_SIZE && currentGrid[row][col].color === currentGrid[endRow+1][col].color) {
                endRow++;
            }
            const matchLength = endRow - row + 1;
            const currentMatch = [];
            for (let i = row; i <= endRow; i++) {
                matches.add(`${i}-${col}`);
                currentMatch.push(`${i}-${col}`);
            }
            if (matchLength >= 4) specialCells.add(currentMatch[Math.floor(matchLength/2)]);
            row = endRow;
        }
      }
    }

    return { matches, specialCells };
  }, []);

  const dropCells = (currentGrid) => {
    const newGrid = currentGrid.map(row => row.map(cell => ({...cell})));
    
    for (let col = 0; col < GRID_SIZE; col++) {
      const column = [];
      for(let row = GRID_SIZE - 1; row >= 0; row--) {
          if(!newGrid[row][col].matched) {
              column.unshift(newGrid[row][col]);
          }
      }

      const newCellsCount = GRID_SIZE - column.length;
      for(let i=0; i<newCellsCount; i++) {
          column.unshift({
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            id: `${i}-${col}-${Math.random()}`,
            matched: false,
            special: null,
            falling: true
          });
      }

      for(let row=0; row < GRID_SIZE; row++) {
          newGrid[row][col] = {...column[row], id: `${row}-${col}-${Math.random()}`, falling: newGrid[row][col].falling };
      }
    }
    
    return newGrid;
  };

  const processMatches = useCallback(async (matchData) => {
    const { matches, specialCells } = matchData;
    if (matches.size === 0) return false;

    setIsProcessing(true);
    setAnimatingCells(matches);
    
    matches.forEach(match => {
      const [row, col] = match.split('-').map(Number);
      if (grid[row] && grid[row][col]) {
        addParticles(row, col, grid[row][col].color);
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let gridWithMatchesMarked = grid.map(r => r.map(c => ({...c})));
    matches.forEach(match => {
        const [row, col] = match.split('-').map(Number);
        if (gridWithMatchesMarked[row] && gridWithMatchesMarked[row][col]) {
            gridWithMatchesMarked[row][col].matched = true;
        }
    });

    specialCells.forEach(cellId => {
        const [row, col] = cellId.split('-').map(Number);
        const matchLength = Array.from(matches).filter(m => m.startsWith(`${row}-`)).length || Array.from(matches).filter(m => m.endsWith(`-${col}`)).length;
        if(gridWithMatchesMarked[row]?.[col] && !gridWithMatchesMarked[row][col].matched) {
            gridWithMatchesMarked[row][col].special = matchLength >= 5 ? 'lightning' : 'bomb';
        }
    });

    setGrid(dropCells(gridWithMatchesMarked));

    const basePoints = matches.size * 10;
    const comboMultiplier = combo + 1;
    const points = basePoints * comboMultiplier;
    
    setScore(prev => {
      const newScore = prev + points;
      return newScore;
    });
    
    setCombo(prev => prev + 1);
    setStreak(prev => prev + 1);
    
    if (matches.size > 0) {
      const matchArray = Array.from(matches);
      const avgRow = matchArray.reduce((sum, match) => sum + parseInt(match.split('-')[0]), 0) / matchArray.length;
      const avgCol = matchArray.reduce((sum, match) => sum + parseInt(match.split('-')[1]), 0) / matchArray.length;
      addFloatingScore(points, avgRow, avgCol);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setAnimatingCells(new Set());
    setIsProcessing(false);

    return true;
  }, [combo, grid, bestScore]);

  const wouldCreateMatch = useCallback((cellId1, cellId2) => {
    if (!grid || grid.length === 0) return false;
    
    const [row1, col1] = cellId1.split('-').map(Number);
    const [row2, col2] = cellId2.split('-').map(Number);
    
    const testGrid = grid.map(row => row.map(cell => ({ ...cell })));
    [testGrid[row1][col1], testGrid[row2][col2]] = [testGrid[row2][col2], testGrid[row1][col1]];
    
    return findMatches(testGrid).matches.size > 0;
  }, [grid, findMatches]);

  const findPossibleMoves = useCallback(() => {
    if (!grid || grid.length === 0) return [];
    
    const moves = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        if (wouldCreateMatch(`${row}-${col}`, `${row}-${col + 1}`)) {
          moves.push([`${row}-${col}`, `${row}-${col + 1}`]);
        }
      }
    }
    
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (wouldCreateMatch(`${row}-${col}`, `${row + 1}-${col}`)) {
          moves.push([`${row}-${col}`, `${row + 1}-${col}`]);
        }
      }
    }
    
    return moves;
  }, [grid, wouldCreateMatch]);

  const showHint = () => {
    const possibleMoves = findPossibleMoves();
    if (possibleMoves.length > 0) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      setHintCells(randomMove);
      setTimeout(() => setHintCells([]), 2000);
    }
  };

  const usePowerUp = (type, targetCellId = null) => {
    if (powerUps[type] <= 0 || isProcessing) return;
    
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    setSelectedPowerUp(null);
    
    let cellsToRemove = new Set();
    if (type === 'shuffle') {
      setGrid(initializeGrid());
      return;
    } else if (type === 'bombs' && targetCellId) {
      const [targetRow, targetCol] = targetCellId.split('-').map(Number);
      for (let r = Math.max(0, targetRow - 1); r <= Math.min(GRID_SIZE - 1, targetRow + 1); r++) {
        for (let c = Math.max(0, targetCol - 1); c <= Math.min(GRID_SIZE - 1, targetCol + 1); c++) {
          cellsToRemove.add(`${r}-${c}`);
        }
      }
    } else if (type === 'lightning' && targetCellId) {
      const [targetRow, targetCol] = targetCellId.split('-').map(Number);
      for (let i = 0; i < GRID_SIZE; i++) {
        cellsToRemove.add(`${targetRow}-${i}`);
        cellsToRemove.add(`${i}-${targetCol}`);
      }
    }
    if(cellsToRemove.size > 0) {
        processMatches({ matches: cellsToRemove, specialCells: new Set() });
    }
  };

  const handleCellClick = (cellId) => {
    if (gameOver || isProcessing) return;

    if (selectedPowerUp) {
      if (selectedPowerUp !== 'shuffle') usePowerUp(selectedPowerUp, cellId);
      return;
    }

    if (!selectedCell) {
      setSelectedCell(cellId);
    } else if (selectedCell === cellId) {
      setSelectedCell(null);
    } else {
      const [row1, col1] = selectedCell.split('-').map(Number);
      const [row2, col2] = cellId.split('-').map(Number);
      const isAdjacent = (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);
      
      if (isAdjacent) {
        if (wouldCreateMatch(selectedCell, cellId)) {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            [newGrid[row1][col1], newGrid[row2][col2]] = [newGrid[row2][col2], newGrid[row1][col1]];
            return newGrid;
          });
          setMoves(prev => Math.max(0, prev - 1));
          setCombo(0); 
          setSelectedCell(null);
        } else {
          setHintCells([selectedCell, cellId]);
          setTimeout(() => setHintCells([]), 500);
          setSelectedCell(null);
        }
      } else {
        setSelectedCell(cellId);
      }
    }
  };

  const checkMatches = useCallback(async () => {
    if (grid.length === 0 || isProcessing) return;
    
    const matchData = findMatches(grid);
    if (matchData.matches.size > 0) {
      await processMatches(matchData);
    } else {
      setCombo(0);
    }
  }, [grid, findMatches, processMatches, isProcessing]);

  const resetGame = useCallback(() => {
    setScore(0);
    setMoves(25);
    setCombo(0);
    setStreak(0);
    setGameOver(false);
    setSelectedCell(null);
    setSelectedPowerUp(null);
    setAnimatingCells(new Set());
    setFloatingScores([]);
    setHintCells([]);
    setParticles([]);
    setIsProcessing(false);
    setPowerUps({ bombs: 3, lightning: 3, shuffle: 2 });
    setGrid(initializeGrid());
  },[initializeGrid]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (grid.length > 0 && !isProcessing) {
      const timer = setTimeout(() => {
        checkMatches();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [grid, checkMatches, isProcessing]);

  useEffect(() => {
    if (moves <= 0 && !isProcessing && !gameOver) {
      setGameOver(true);
    }
  }, [moves, gameOver, isProcessing]);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br flex items-center justify-center p-2 sm:p-4 font-sans overflow-hidden">
        <div className="w-full max-w-md mx-auto lg:max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 flex flex-col gap-4">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text">
                    Color Chain 
                </h1>
                <div className="flex justify-around items-center gap-2 text-white text-xs sm:text-sm">
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-yellow-400">{score.toLocaleString()}</div>
                        <div className="opacity-80">Score</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-pink-400">{bestScore.toLocaleString()}</div>
                        <div className="opacity-80">Best</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-400">{moves}</div>
                        <div className="opacity-80">Moves</div>
                    </div>
                    {combo > 1 && (
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-400 animate-pulse">{combo}x</div>
                        <div className="opacity-80">Combo</div>
                    </div>
                    )}
                    {streak > 0 && (
                    <div className="text-center">
                        <div className="text-xl sm:text-xl font-bold text-red-400">🔥{streak}</div>
                        <div className="opacity-80">Streak</div>
                    </div>
                    )}
                </div>
            </header>

            <div className="flex justify-center gap-2">
                <button
                    onClick={() => setSelectedPowerUp(selectedPowerUp === 'bombs' ? null : 'bombs')}
                    disabled={powerUps.bombs <= 0}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedPowerUp === 'bombs' 
                        ? 'bg-red-500 text-white scale-110 ring-2 ring-white' 
                        : powerUps.bombs > 0 
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/40' 
                        : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    💣 {powerUps.bombs}
                </button>
                <button
                    onClick={() => setSelectedPowerUp(selectedPowerUp === 'lightning' ? null : 'lightning')}
                    disabled={powerUps.lightning <= 0}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedPowerUp === 'lightning' 
                        ? 'bg-yellow-500 text-white scale-110 ring-2 ring-white' 
                        : powerUps.lightning > 0 
                        ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40' 
                        : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    ⚡ {powerUps.lightning}
                </button>
                <button
                    onClick={() => usePowerUp('shuffle')}
                    disabled={powerUps.shuffle <= 0}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    powerUps.shuffle > 0 
                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/40' 
                        : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    🔄 {powerUps.shuffle}
                </button>
                <button
                    onClick={showHint}
                    className="px-3 py-2 rounded-lg text-sm font-bold bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition-all"
                >
                    💡 Hint
                </button>
            </div>

            <div ref={gridRef} className="relative w-full aspect-square">
                <div className="grid grid-cols-8 gap-1 bg-black/20 p-2 sm:p-3 rounded-xl h-full w-full">
                    {grid.flat().map((cell, index) => {
                        const cellId = `${Math.floor(index / GRID_SIZE)}-${index % GRID_SIZE}`;
                        return (
                            <div
                                key={cell.id}
                                className={`
                                    w-full h-full rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 transform relative
                                    ${selectedCell === cellId ? 'ring-2 md:ring-4 ring-white scale-110 z-10' : 'hover:scale-105'}
                                    ${animatingCells.has(cellId) ? 'animate-pulse scale-125' : ''}
                                    ${hintCells.includes(cellId) ? 'ring-2 md:ring-4 ring-green-400 animate-pulse' : ''}
                                    ${cell.falling ? 'animate-bounce' : ''}
                                    shadow-lg hover:shadow-xl
                                `}
                                style={{ backgroundColor: cell.color }}
                                onClick={() => handleCellClick(cellId)}
                            >
                                <div className="w-full h-full rounded-md sm:rounded-lg bg-gradient-to-br from-white/30 to-transparent flex items-center justify-center">
                                    {cell.special === 'bomb' && <span className="text-white text-lg sm:text-xl">💣</span>}
                                    {cell.special === 'lightning' && <span className="text-white text-lg sm:text-xl">⚡</span>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {floatingScores.map(score => (
                    <div
                    key={score.id}
                    className="absolute text-yellow-400 font-bold text-lg sm:text-xl pointer-events-none"
                    style={{
                        left: score.x,
                        top: score.y,
                        transform: 'translate(-50%, -50%)',
                        animation: 'float-up 1s ease-out forwards'
                    }}
                    >
                    +{score.points}
                    </div>
                ))}

                {particles.map(p => (
                    <div 
                        key={p.id} 
                        className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full pointer-events-none" 
                        style={{ 
                            backgroundColor: p.color, 
                            left: p.x, 
                            top: p.y, 
                            '--vx': p.vx, 
                            '--vy': p.vy, 
                            animation: `particle-fly-out 0.8s ease-out forwards` 
                        }}
                    />
                ))}

                {gameOver && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Game Over!</h2>
                        <p className="text-white/80 mb-2">Final Score: {score.toLocaleString()}</p>
                        <p className="text-white/80 mb-4">Best Score: {bestScore.toLocaleString()}</p>
                        <button
                            onClick={resetGame}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>

            <footer className="flex flex-col items-center justify-center gap-2">
                <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                >
                    New Game
                </button>
                <div className="text-center text-white/60 text-xs">
                    Match 3+ colors • Use power-ups • Build combos for higher scores
                </div>
            </footer>
        </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-50px);
          }
        }

        @keyframes particle-fly-out {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ColorChainGame;
