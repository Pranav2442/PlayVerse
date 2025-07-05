import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  HelpCircle,
  Zap,
  Users,
  Bot,
  ArrowRight,
  Settings,
  Award,
  Github,
  Coffee,
} from "lucide-react";

const GoogleAnalytics = () => {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_ID) {
      console.log("issues with GA");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${
      import.meta.env.VITE_GA_ID
    }`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", import.meta.env.VITE_GA_ID);
  }, []);

  return null;
};

const ExplosionEffect = ({ position, color }) => {
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 10 : 28;
  const sparkCount = isMobile ? 8 : 24;
  const shardCount = isMobile ? 6 : 16;
  const starCount = isMobile ? 4 : 12;

  const explosionColors = {
    primary: "#facc15",
    bright: "#fef08a",
    accent: "#f59e0b",
    glow: "#fb923c",
  };

  const particles = Array(particleCount)
    .fill()
    .map((_, i) => ({
      id: i,
      angle: i * (360 / particleCount) * (Math.PI / 180),
      distance: Math.random() * (isMobile ? 15 : 30) + (isMobile ? 12 : 20),
      size: Math.random() * (isMobile ? 2.5 : 4) + (isMobile ? 2 : 2.5),
      duration: Math.random() * 0.3 + (isMobile ? 0.3 : 0.6),
      color:
        Math.random() > 0.7 ? explosionColors.bright : explosionColors.primary,
    }));

  const sparks = Array(sparkCount)
    .fill()
    .map((_, i) => ({
      id: i,
      angle: Math.random() * 2 * Math.PI,
      distance: Math.random() * (isMobile ? 20 : 40) + (isMobile ? 10 : 22),
      size: Math.random() * 2 + (isMobile ? 1 : 1.5),
      duration: Math.random() * 0.4 + (isMobile ? 0.3 : 0.5),
      delay: Math.random() * 0.15,
    }));

  const shards = Array(shardCount)
    .fill()
    .map((_, i) => ({
      id: i,
      angle: (i * (360 / shardCount) + Math.random() * 30) * (Math.PI / 180),
      distance: Math.random() * (isMobile ? 20 : 35) + (isMobile ? 15 : 25),
      width: Math.random() * (isMobile ? 3 : 5) + (isMobile ? 2.5 : 4),
      height: Math.random() * (isMobile ? 1.5 : 2.5) + (isMobile ? 1 : 1.5),
      rotation: Math.random() * 360,
      duration: Math.random() * 0.35 + (isMobile ? 0.3 : 0.5),
      color:
        Math.random() > 0.5 ? explosionColors.primary : explosionColors.accent,
    }));

  const stars = Array(starCount)
    .fill()
    .map((_, i) => ({
      id: i,
      angle: Math.random() * 2 * Math.PI,
      distance: Math.random() * (isMobile ? 25 : 45) + (isMobile ? 15 : 25),
      size: Math.random() * (isMobile ? 3 : 5) + (isMobile ? 3 : 4),
      rotation: Math.random() * 360,
      duration: Math.random() * 0.5 + (isMobile ? 0.4 : 0.6),
      delay: Math.random() * 0.1,
    }));

  return (
    <>
      <motion.div
        className="absolute w-full h-full rounded-full z-10"
        style={{
          background: `radial-gradient(circle, ${explosionColors.bright} 0%, ${explosionColors.primary} 50%, transparent 100%)`,
          opacity: isMobile ? 0.8 : 0.9,
          boxShadow: `0 0 ${isMobile ? "20px" : "30px"} ${
            explosionColors.primary
          }`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: isMobile ? 1.8 : 2.2, opacity: 0 }}
        transition={{ duration: isMobile ? 0.35 : 0.45, ease: "easeOut" }}
      />

      <motion.div
        className="absolute w-3/4 h-3/4 rounded-full z-11"
        style={{
          backgroundColor: explosionColors.bright,
          filter: `blur(${isMobile ? "2px" : "3px"})`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0.1, opacity: 1 }}
        animate={{ scale: isMobile ? 1.2 : 1.5, opacity: 0 }}
        transition={{ duration: isMobile ? 0.25 : 0.3, ease: "easeOut" }}
      />

      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full z-20"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: isMobile
              ? `0 0 ${Math.round(particle.size)}px ${explosionColors.glow}`
              : `0 0 ${Math.round(particle.size * 3)}px ${
                  explosionColors.glow
                }`,
            top: "50%",
            left: "50%",
          }}
          initial={{
            x: "-50%",
            y: "-50%",
            opacity: 1,
            scale: 1.5,
          }}
          animate={{
            x: `calc(-50% + ${Math.cos(particle.angle) * particle.distance}%)`,
            y: `calc(-50% + ${Math.sin(particle.angle) * particle.distance}%)`,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{
            duration: particle.duration,
            ease: "circOut",
          }}
        />
      ))}

      <motion.div
        className="absolute w-full h-full rounded-full z-9"
        style={{
          background: `radial-gradient(circle, ${explosionColors.accent} 0%, ${color} 50%, transparent 100%)`,
          opacity: isMobile ? 0.4 : 0.6,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0.2 }}
        animate={{ scale: isMobile ? 1.6 : 2, opacity: 0 }}
        transition={{
          duration: isMobile ? 0.4 : 0.5,
          ease: "easeOut",
          delay: 0.05,
        }}
      />

      <motion.div
        className="absolute w-full h-full rounded-full z-8"
        style={{
          border: `${isMobile ? "2px" : "3px"} solid ${
            explosionColors.primary
          }`,
          boxShadow: `0 0 ${isMobile ? "5px" : "8px"} ${
            explosionColors.glow
          }, inset 0 0 ${isMobile ? "3px" : "5px"} ${explosionColors.glow}`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0.5, opacity: 0.9 }}
        animate={{ scale: isMobile ? 1.7 : 2.4, opacity: 0 }}
        transition={{
          duration: isMobile ? 0.4 : 0.6,
          ease: "easeOut",
          delay: 0.05,
        }}
      />

      <motion.div
        className="absolute w-full h-full rounded-full z-7"
        style={{
          border: `${isMobile ? "1.5px" : "2px"} dashed ${
            explosionColors.accent
          }`,
          boxShadow: `0 0 ${isMobile ? "3px" : "5px"} ${explosionColors.glow}`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0.7, opacity: 0.7, rotate: 0 }}
        animate={{ scale: isMobile ? 2 : 2.6, opacity: 0, rotate: 60 }}
        transition={{
          duration: isMobile ? 0.45 : 0.65,
          ease: "easeOut",
          delay: 0.1,
        }}
      />

      {sparks.map((spark) => (
        <motion.div
          key={`spark-${spark.id}`}
          className="absolute rounded-full z-15"
          style={{
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            backgroundColor: "#FFFFFF",
            boxShadow: `0 0 ${Math.round(spark.size * 3)}px ${
              explosionColors.bright
            }, 0 0 ${Math.round(spark.size * 2)}px #FFFFFF`,
            top: "50%",
            left: "50%",
          }}
          initial={{
            x: "-50%",
            y: "-50%",
            opacity: 1,
            scale: 1.2,
          }}
          animate={{
            x: `calc(-50% + ${Math.cos(spark.angle) * spark.distance}%)`,
            y: `calc(-50% + ${Math.sin(spark.angle) * spark.distance}%)`,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: spark.duration,
            ease: "circOut",
            delay: spark.delay,
          }}
        />
      ))}

      {!isMobile &&
        stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute z-14"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "transparent",
              boxShadow: `0 0 ${Math.round(star.size)}px ${
                explosionColors.bright
              }`,
              top: "50%",
              left: "50%",
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              opacity: 0.9,
              scale: 1,
              rotate: 0,
            }}
            animate={{
              x: `calc(-50% + ${Math.cos(star.angle) * star.distance}%)`,
              y: `calc(-50% + ${Math.sin(star.angle) * star.distance}%)`,
              opacity: 0,
              scale: 0.5,
              rotate: star.rotation,
            }}
            transition={{
              duration: star.duration,
              ease: "easeOut",
              delay: star.delay,
            }}
          />
        ))}

      {!isMobile &&
        shards.map((shard) => (
          <motion.div
            key={`shard-${shard.id}`}
            className="absolute z-12"
            style={{
              width: `${shard.width}px`,
              height: `${shard.height}px`,
              backgroundColor: shard.color,
              borderRadius: "1px",
              top: "50%",
              left: "50%",
              boxShadow: `0 0 ${Math.round(shard.width / 2)}px ${
                explosionColors.glow
              }`,
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              opacity: 1,
              rotate: shard.rotation,
              scale: 1.2,
            }}
            animate={{
              x: `calc(-50% + ${Math.cos(shard.angle) * shard.distance}%)`,
              y: `calc(-50% + ${Math.sin(shard.angle) * shard.distance}%)`,
              opacity: 0,
              rotate: shard.rotation + 90,
              scale: 0.4,
            }}
            transition={{
              duration: shard.duration,
              ease: "circOut",
            }}
          />
        ))}

      {isMobile &&
        stars.slice(0, 3).map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute z-14"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: explosionColors.bright,
              top: "50%",
              left: "50%",
              borderRadius: "50%",
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              opacity: 0.9,
              scale: 1.2,
            }}
            animate={{
              x: `calc(-50% + ${Math.cos(star.angle) * star.distance}%)`,
              y: `calc(-50% + ${Math.sin(star.angle) * star.distance}%)`,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{
              duration: star.duration * 0.7,
              ease: "easeOut",
              delay: star.delay,
            }}
          />
        ))}

      {isMobile &&
        shards.slice(0, 4).map((shard) => (
          <motion.div
            key={`shard-${shard.id}`}
            className="absolute z-12"
            style={{
              width: `${shard.width}px`,
              height: `${shard.height}px`,
              backgroundColor: explosionColors.primary,
              borderRadius: "1px",
              top: "50%",
              left: "50%",
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              opacity: 1,
              rotate: shard.rotation,
            }}
            animate={{
              x: `calc(-50% + ${
                Math.cos(shard.angle) * shard.distance * 0.7
              }%)`,
              y: `calc(-50% + ${
                Math.sin(shard.angle) * shard.distance * 0.7
              }%)`,
              opacity: 0,
              rotate: shard.rotation + 60,
            }}
            transition={{
              duration: shard.duration * 0.7,
              ease: "easeOut",
            }}
          />
        ))}
    </>
  );
};

const BackgroundParticles = () => {
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 3 : 15;

  const particles = Array(particleCount)
    .fill()
    .map((_, i) => ({
      id: i,
      size: Math.random() * (isMobile ? 1.5 : 3) + 1,
      x: Math.random() * 75,
      y: Math.random() * 100,
      duration: Math.random() * (isMobile ? 20 : 15) + 15,
    }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {!isMobile &&
        particles.map((particle) => (
          <motion.div
            key={`bg-particle-${particle.id}`}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              repeatType: "mirror",
            }}
          />
        ))}
    </div>
  );
};

const ROWS = 8;
const COLS = 6;

const COLORS = {
  PLAYER1: "#7c3aed",
  PLAYER2: "#db2777",
  AI: "#db2777",
  EXPLOSION: "#fbbf24",
  CRITICAL_GLOW: "#f97316",
};

const CELL_COLORS = {
  DEFAULT: {
    bg: "rgba(15, 23, 42, 0.6)",
    border: "#334155",
    glow: "none",
  },
  PLAYER1: {
    bg: "rgba(15, 23, 42, 0.7)",
    border: "#7c3aed",
    criticalBg: "rgba(124, 58, 237, 0.1)",
    glow: "0 0 8px rgba(124, 58, 237, 0.5)",
  },
  PLAYER2: {
    bg: "rgba(15, 23, 42, 0.7)",
    border: "#db2777",
    criticalBg: "rgba(219, 39, 119, 0.1)",
    glow: "0 0 8px rgba(219, 39, 119, 0.5)",
  },
  AI: {
    bg: "rgba(15, 23, 42, 0.7)",
    border: "#db2777",
    criticalBg: "rgba(219, 39, 119, 0.1)",
    glow: "0 0 8px rgba(219, 39, 119, 0.5)",
  },
};

const GAME_MODES = {
  SINGLE_PLAYER: "single",
  TWO_PLAYER: "two_player",
};

const ChainReactionGame = () => {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState("playing");
  const [message, setMessage] = useState("Player 1 turn! Place an atom");
  const [showTutorial, setShowTutorial] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [gameMode, setGameMode] = useState(GAME_MODES.SINGLE_PLAYER);
  const difficultyLevel = 5;
  const [animating, setAnimating] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [playerHasMoved, setPlayerHasMoved] = useState(false);
  const [aiHasMoved, setAiHasMoved] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  const initializeBoard = () => {
    const newBoard = [];
    for (let row = 0; row < ROWS; row++) {
      const newRow = [];
      for (let col = 0; col < COLS; col++) {
        newRow.push({
          atoms: 0,
          owner: 0,
          isExploding: false,
          isNew: false,
        });
      }
      newBoard.push(newRow);
    }

    setBoard(newBoard);
    setCurrentPlayer(1);
    setGameStatus("playing");
    setMessage(
      gameMode === GAME_MODES.SINGLE_PLAYER
        ? "Your turn! Place an atom"
        : "Player 1 turn! Place an atom"
    );
    setAnimating(false);
    setMoveCount(0);
    setPlayerHasMoved(false);
    setAiHasMoved(false);
  };

  useEffect(() => {
    initializeBoard();
  }, [gameMode]);

  useEffect(() => {
    if (gameStatus === "playing" && currentPlayer === 1) {
      setMessage(
        gameMode === GAME_MODES.SINGLE_PLAYER
          ? "Your turn! Place an atom"
          : "Player 1 turn! Place an atom"
      );
    } else if (
      gameStatus === "playing" &&
      currentPlayer === 2 &&
      gameMode === GAME_MODES.TWO_PLAYER
    ) {
      setMessage("Player 2 turn! Place an atom");
    }
  }, [gameMode, gameStatus, currentPlayer]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isSlowDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    setIsLowPerformance(isMobile || isSlowDevice);

    if (isMobile) {
      document.body.classList.add("mobile-optimized");
    }
  }, []);

  const getCriticalMass = (row, col) => {
    let adjacentCells = 4;
    if (row === 0 || row === ROWS - 1) adjacentCells--;
    if (col === 0 || col === COLS - 1) adjacentCells--;
    return adjacentCells;
  };

  const getAdjacentCells = (row, col) => {
    const adjacentCells = [];
    if (row > 0) adjacentCells.push([row - 1, col]);
    if (row < ROWS - 1) adjacentCells.push([row + 1, col]);
    if (col > 0) adjacentCells.push([row, col - 1]);
    if (col < COLS - 1) adjacentCells.push([row, col + 1]);
    return adjacentCells;
  };

  const handleCellClick = (row, col) => {
    if (gameStatus !== "playing" || animating) {
      return;
    }

    if (gameMode === GAME_MODES.SINGLE_PLAYER && currentPlayer !== 1) {
      return;
    }

    const cell = board[row][col];

    if (cell.owner !== 0 && cell.owner !== currentPlayer) {
      return;
    }

    const newBoard = JSON.parse(JSON.stringify(board));

    newBoard[row][col].atoms += 1;
    newBoard[row][col].owner = currentPlayer;
    newBoard[row][col].isNew = true;

    if (currentPlayer === 1) {
      setPlayerHasMoved(true);
    } else if (gameMode === GAME_MODES.SINGLE_PLAYER) {
      setAiHasMoved(true);
    }

    setMoveCount((prev) => prev + 1);

    setBoard(newBoard);
    setAnimating(true);
    setMessage("Processing move...");

    setTimeout(
      () => {
        const updatedBoard = JSON.parse(JSON.stringify(newBoard));
        updatedBoard[row][col].isNew = false;

        processChainReaction(updatedBoard, currentPlayer);
      },
      window.innerWidth < 768 ? 150 : 200
    );
  };

  const checkGameOver = (currentBoard) => {
    let player1Exists = false;
    let player2Exists = false;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = currentBoard[row][col];
        if (cell.atoms > 0) {
          if (cell.owner === 1) player1Exists = true;
          if (cell.owner === 2) player2Exists = true;
        }
      }
    }

    if (moveCount > 1) {
      if (player1Exists && !player2Exists) {
        setGameStatus("player1_won");
        setMessage(
          gameMode === GAME_MODES.SINGLE_PLAYER
            ? "You won! 🎉"
            : "Player 1 won! 🎉"
        );
        setAnimating(false);
        return true;
      } else if (!player1Exists && player2Exists) {
        setGameStatus("player2_won");
        setMessage(
          gameMode === GAME_MODES.SINGLE_PLAYER
            ? "You lost! 😢"
            : "Player 2 won! 🎉"
        );
        setAnimating(false);
        return true;
      }
    }

    return false;
  };

  const processChainReaction = (currentBoard, player) => {
    if (gameStatus !== "playing") {
      setAnimating(false);
      return;
    }

    if (checkGameOver(currentBoard)) {
      return;
    }

    const cellsToExplode = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = currentBoard[row][col];
        const criticalMass = getCriticalMass(row, col);

        if (cell.atoms >= criticalMass && cell.owner === player) {
          cellsToExplode.push([row, col]);
        }
      }
    }

    if (cellsToExplode.length === 0) {
      if (gameStatus === "playing") {
        const nextPlayer = player === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);

        if (gameMode === GAME_MODES.SINGLE_PLAYER) {
          if (player === 1) {
            setMessage("AI is thinking...");

            setTimeout(() => {
              makeAIMove(currentBoard);
            }, 300);
          } else {
            setMessage("Your turn! Place an atom");
            setAnimating(false);
          }
        } else {
          setMessage(`Player ${nextPlayer} turn! Place an atom`);
          setAnimating(false);
        }
      }

      return;
    }

    for (const [row, col] of cellsToExplode) {
      currentBoard[row][col].isExploding = true;
    }

    setBoard(JSON.parse(JSON.stringify(currentBoard)));

    const delay = window.innerWidth < 768 ? 100 : 150;

    setTimeout(() => {
      if (gameStatus !== "playing") {
        setAnimating(false);
        return;
      }

      for (const [row, col] of cellsToExplode) {
        const cell = currentBoard[row][col];
        const criticalMass = getCriticalMass(row, col);

        cell.atoms -= criticalMass;
        cell.isExploding = false;

        if (cell.atoms === 0) {
          cell.owner = 0;
        }

        const adjacentCells = getAdjacentCells(row, col);
        for (const [adjRow, adjCol] of adjacentCells) {
          currentBoard[adjRow][adjCol].atoms += 1;
          currentBoard[adjRow][adjCol].owner = player;
          currentBoard[adjRow][adjCol].isNew = true;
        }
      }

      setBoard(JSON.parse(JSON.stringify(currentBoard)));

      setTimeout(() => {
        if (gameStatus !== "playing") {
          setAnimating(false);
          return;
        }

        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            currentBoard[row][col].isNew = false;
          }
        }

        processChainReaction(currentBoard, player);
      }, delay);
    }, delay);
  };

  const makeAIMove = (currentBoard) => {
    if (gameStatus !== "playing" || gameMode !== GAME_MODES.SINGLE_PLAYER)
      return;

    const startTime = performance.now();
    const MAX_DECISION_TIME = 3800;

    try {
      const instantWin = findInstantWin(currentBoard);
      if (instantWin) {
        executeMove(currentBoard, instantWin.row, instantWin.col);
        return;
      }

      const criticalBlock = findCriticalBlock(currentBoard);
      if (criticalBlock) {
        executeMove(currentBoard, criticalBlock.row, criticalBlock.col);
        return;
      }

      const bestMove = findBestMoveWithTimeLimit(
        currentBoard,
        startTime,
        MAX_DECISION_TIME
      );
      if (bestMove) {
        executeMove(currentBoard, bestMove.row, bestMove.col);
        return;
      }

      const fallbackMove = findFallbackMove(currentBoard);
      executeMove(currentBoard, fallbackMove.row, fallbackMove.col);
    } catch (error) {
      const corners = [
        [0, 0],
        [0, COLS - 1],
        [ROWS - 1, 0],
        [ROWS - 1, COLS - 1],
      ];
      const validMoves = getAllValidMoves(currentBoard, 2);

      for (const [row, col] of corners) {
        if (
          currentBoard[row][col].atoms === 0 ||
          currentBoard[row][col].owner === 2
        ) {
          executeMove(currentBoard, row, col);
          return;
        }
      }

      if (validMoves.length > 0) {
        const randomMove =
          validMoves[Math.floor(Math.random() * validMoves.length)];
        executeMove(currentBoard, randomMove.row, randomMove.col);
      } else {
        setCurrentPlayer(1);
        setMessage("Your turn!");
        setAnimating(false);
      }
    }

    function findInstantWin(board) {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (cell.owner === 2 && cell.atoms > 0) {
            const criticalMass = getCriticalMass(row, col);
            if (cell.atoms === criticalMass - 1) {
              const result = simulateMove(board, row, col, 2);
              if (result.gameOver && result.winner === 2) {
                return { row, col };
              }
            }
          }
        }
      }

      const validMoves = getAllValidMoves(board, 2);
      for (const move of validMoves) {
        if (
          board[move.row][move.col].owner === 0 ||
          (board[move.row][move.col].owner === 2 &&
            board[move.row][move.col].atoms <
              getCriticalMass(move.row, move.col) - 1)
        ) {
          const result = simulateMove(board, move.row, move.col, 2);
          if (result.gameOver && result.winner === 2) {
            return move;
          }
        }
      }

      return null;
    }

    function findCriticalBlock(board) {
      const playerMoves = getAllValidMoves(board, 1);
      const winningPlayerMoves = [];

      for (const move of playerMoves) {
        const result = simulateMove(board, move.row, move.col, 1);
        if (result.gameOver && result.winner === 1) {
          winningPlayerMoves.push(move);
        }
      }

      if (winningPlayerMoves.length === 0) return null;

      const aiMoves = getAllValidMoves(board, 2);
      for (const move of aiMoves) {
        const result = simulateMove(board, move.row, move.col, 2);
        if (result.gameOver && result.winner === 2) {
          return move;
        }
      }

      for (const aiMove of aiMoves) {
        let blocksAllWins = true;
        const aiMoveResult = simulateMove(board, aiMove.row, aiMove.col, 2);

        if (aiMoveResult.gameOver && aiMoveResult.winner === 1) continue;

        for (const playerMove of winningPlayerMoves) {
          if (
            aiMoveResult.board[playerMove.row][playerMove.col].owner !== 0 &&
            aiMoveResult.board[playerMove.row][playerMove.col].owner !== 1
          ) {
            continue;
          }

          const subsequentResult = simulateMove(
            aiMoveResult.board,
            playerMove.row,
            playerMove.col,
            1
          );

          if (subsequentResult.gameOver && subsequentResult.winner === 1) {
            blocksAllWins = false;
            break;
          }
        }

        if (blocksAllWins) {
          return aiMove;
        }
      }

      const scoredBlockingMoves = [];

      for (const aiMove of aiMoves) {
        const aiMoveResult = simulateMove(board, aiMove.row, aiMove.col, 2);

        if (aiMoveResult.gameOver && aiMoveResult.winner === 1) continue;

        let blockedCount = 0;

        for (const playerMove of winningPlayerMoves) {
          if (
            aiMoveResult.board[playerMove.row][playerMove.col].owner !== 0 &&
            aiMoveResult.board[playerMove.row][playerMove.col].owner !== 1
          ) {
            blockedCount++;
            continue;
          }

          const subsequentResult = simulateMove(
            aiMoveResult.board,
            playerMove.row,
            playerMove.col,
            1
          );

          if (!subsequentResult.gameOver || subsequentResult.winner !== 1) {
            blockedCount++;
          }
        }

        if (blockedCount > 0) {
          const positionScore = evaluatePosition(aiMoveResult.board);

          scoredBlockingMoves.push({
            move: aiMove,
            blockedCount,
            positionScore,
          });
        }
      }

      if (scoredBlockingMoves.length > 0) {
        scoredBlockingMoves.sort((a, b) => {
          if (a.blockedCount !== b.blockedCount) {
            return b.blockedCount - a.blockedCount;
          }
          return b.positionScore - a.positionScore;
        });

        return scoredBlockingMoves[0].move;
      }

      return winningPlayerMoves[
        Math.floor(Math.random() * winningPlayerMoves.length)
      ];
    }

    function findBestMoveWithTimeLimit(board, startTime, maxTime) {
      const validMoves = getAllValidMoves(board, 2);
      if (validMoves.length === 0) return null;

      const gameState = analyzeGameState(board);

      if (gameState.totalAtoms <= 4) {
        const openingMove = getOpeningBookMove(board, gameState);
        if (openingMove) return openingMove;
      }

      shuffleArray(validMoves);

      const scoredMoves = [];

      for (const move of validMoves) {
        const result = simulateMove(board, move.row, move.col, 2);

        if (result.gameOver && result.winner === 2) {
          return move;
        }

        let leadsToPotentialLoss = false;

        const playerMoves = getAllValidMoves(result.board, 1);
        for (const playerMove of playerMoves) {
          const playerResult = simulateMove(
            result.board,
            playerMove.row,
            playerMove.col,
            1
          );
          if (playerResult.gameOver && playerResult.winner === 1) {
            leadsToPotentialLoss = true;
            break;
          }
        }

        if (leadsToPotentialLoss) {
          continue;
        }

        const score = evaluatePosition(result.board);

        let adjustedScore = score;

        if (gameState.phase === "early") {
          adjustedScore += evaluateEarlyGameMove(board, move, gameState);
        } else if (gameState.phase === "mid") {
          adjustedScore += evaluateMidGameMove(
            board,
            move,
            result.board,
            gameState
          );
        } else {
          adjustedScore += evaluateLateGameMove(
            board,
            move,
            result.board,
            gameState
          );
        }

        scoredMoves.push({
          move,
          score: adjustedScore,
          simulated: result,
        });
      }

      if (scoredMoves.length === 0 && validMoves.length > 0) {
        return validMoves[0];
      }

      scoredMoves.sort((a, b) => b.score - a.score);

      if (
        scoredMoves.length > 1 &&
        scoredMoves[0].score > scoredMoves[1].score * 1.5 &&
        scoredMoves[0].score > 500
      ) {
        return scoredMoves[0].move;
      }

      const topMovesToAnalyze = Math.min(5, scoredMoves.length);
      const deepScoredMoves = [];

      let currentDepth = 1;
      const maxDepth = 5;

      while (
        currentDepth <= maxDepth &&
        performance.now() - startTime < maxTime * 0.8
      ) {
        for (let i = 0; i < topMovesToAnalyze; i++) {
          if (performance.now() - startTime > maxTime * 0.8) break;

          const moveData = scoredMoves[i];

          const minimaxScore = minimax(
            moveData.simulated.board,
            currentDepth,
            -Infinity,
            Infinity,
            false,
            startTime,
            maxTime * 0.8
          );

          deepScoredMoves.push({
            move: moveData.move,
            score: minimaxScore,
            originalScore: moveData.score,
            depth: currentDepth,
          });
        }

        currentDepth++;
      }

      if (deepScoredMoves.length > 0) {
        const maxAnalyzedDepth = Math.max(
          ...deepScoredMoves.map((m) => m.depth)
        );
        const deepestMoves = deepScoredMoves.filter(
          (m) => m.depth === maxAnalyzedDepth
        );

        deepestMoves.sort((a, b) => b.score - a.score);

        if (deepestMoves.length > 1 && Math.random() < 0.2) {
          const index = Math.floor(
            Math.random() * Math.min(2, deepestMoves.length)
          );
          return deepestMoves[index].move;
        }

        return deepestMoves[0].move;
      }

      return scoredMoves[0].move;
    }

    function minimax(
      board,
      depth,
      alpha,
      beta,
      isMaximizing,
      startTime,
      timeLimit
    ) {
      if (performance.now() > timeLimit) {
        return isMaximizing ? -10000 : 10000;
      }

      const gameState = checkGameOver(board);
      if (gameState.gameOver) {
        return gameState.winner === 2 ? 100000 : -100000;
      }

      if (depth === 0) {
        return evaluatePosition(board);
      }

      if (isMaximizing) {
        let maxEval = -Infinity;
        const moves = getAllValidMoves(board, 2);

        if (depth > 1) {
          const scoredMoves = moves.map((move) => {
            const criticalMass = getCriticalMass(move.row, move.col);
            let score = 0;

            if (criticalMass === 2) score += 30;
            else if (criticalMass === 3) score += 20;

            if (board[move.row][move.col].owner === 2) {
              const remaining =
                criticalMass - board[move.row][move.col].atoms - 1;
              if (remaining === 0) score += 50;
              else score += 10;
            }

            return { move, score };
          });

          scoredMoves.sort((a, b) => b.score - a.score);
          moves.length = 0;
          scoredMoves.forEach((m) => moves.push(m.move));
        }

        for (const move of moves) {
          if (performance.now() > timeLimit) break;

          const childBoard = simulateMove(board, move.row, move.col, 2).board;
          const evalScore = minimax(
            childBoard,
            depth - 1,
            alpha,
            beta,
            false,
            startTime,
            timeLimit
          );
          maxEval = Math.max(maxEval, evalScore);
          alpha = Math.max(alpha, evalScore);

          if (beta <= alpha) break;
        }

        return maxEval;
      } else {
        let minEval = Infinity;
        const moves = getAllValidMoves(board, 1);

        if (depth > 1) {
          const scoredMoves = moves.map((move) => {
            const criticalMass = getCriticalMass(move.row, move.col);
            let score = 0;

            if (criticalMass === 2) score += 30;
            else if (criticalMass === 3) score += 20;

            if (board[move.row][move.col].owner === 1) {
              const remaining =
                criticalMass - board[move.row][move.col].atoms - 1;
              if (remaining === 0) score += 50;
              else score += 10;
            }

            return { move, score };
          });

          scoredMoves.sort((a, b) => b.score - a.score);
          moves.length = 0;
          scoredMoves.forEach((m) => moves.push(m.move));
        }

        for (const move of moves) {
          if (performance.now() > timeLimit) break;

          const childBoard = simulateMove(board, move.row, move.col, 1).board;
          const evalScore = minimax(
            childBoard,
            depth - 1,
            alpha,
            beta,
            true,
            startTime,
            timeLimit
          );
          minEval = Math.min(minEval, evalScore);
          beta = Math.min(beta, evalScore);

          if (beta <= alpha) break;
        }

        return minEval;
      }
    }

    function getOpeningBookMove(board, gameState) {
      if (gameState.totalAtoms === 0) {
        const corners = [
          [0, 0],
          [0, COLS - 1],
          [ROWS - 1, 0],
          [ROWS - 1, COLS - 1],
        ];
        return {
          row: corners[Math.floor(Math.random() * corners.length)][0],
          col: corners[Math.floor(Math.random() * corners.length)][1],
        };
      }

      if (gameState.aiAtoms === 0 && gameState.playerAtoms === 1) {
        let playerMove = null;

        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            if (board[row][col].owner === 1 && board[row][col].atoms === 1) {
              playerMove = { row, col };
              break;
            }
          }
          if (playerMove) break;
        }

        if (playerMove) {
          const criticalMass = getCriticalMass(playerMove.row, playerMove.col);

          if (criticalMass === 2) {
            return {
              row: Math.floor(ROWS / 2),
              col: Math.floor(COLS / 2),
            };
          }

          if (criticalMass === 3) {
            let targetCorner;

            if (playerMove.row === 0) {
              targetCorner = {
                row: ROWS - 1,
                col: playerMove.col < COLS / 2 ? COLS - 1 : 0,
              };
            } else if (playerMove.row === ROWS - 1) {
              targetCorner = {
                row: 0,
                col: playerMove.col < COLS / 2 ? COLS - 1 : 0,
              };
            } else if (playerMove.col === 0) {
              targetCorner = {
                row: playerMove.row < ROWS / 2 ? ROWS - 1 : 0,
                col: COLS - 1,
              };
            } else {
              targetCorner = {
                row: playerMove.row < ROWS / 2 ? ROWS - 1 : 0,
                col: 0,
              };
            }

            return targetCorner;
          }

          if (criticalMass === 4) {
            const corners = [
              [0, 0],
              [0, COLS - 1],
              [ROWS - 1, 0],
              [ROWS - 1, COLS - 1],
            ];
            return {
              row: corners[Math.floor(Math.random() * corners.length)][0],
              col: corners[Math.floor(Math.random() * corners.length)][1],
            };
          }
        }
      }

      if (gameState.aiAtoms === 1 && gameState.playerAtoms === 1) {
        let ourMove = null;

        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            if (board[row][col].owner === 2 && board[row][col].atoms === 1) {
              ourMove = { row, col };
              break;
            }
          }
          if (ourMove) break;
        }

        if (ourMove) {
          const criticalMass = getCriticalMass(ourMove.row, ourMove.col);

          if (criticalMass === 2) {
            return ourMove;
          }

          const corners = [
            [0, 0],
            [0, COLS - 1],
            [ROWS - 1, 0],
            [ROWS - 1, COLS - 1],
          ];
          for (const [row, col] of corners) {
            if (board[row][col].atoms === 0) {
              return { row, col };
            }
          }
        }
      }

      return null;
    }

    function evaluateEarlyGameMove(board, move, gameState) {
      let score = 0;
      const row = move.row;
      const col = move.col;
      const cell = board[row][col];
      const criticalMass = getCriticalMass(row, col);

      if (criticalMass === 2) score += 50;
      else if (criticalMass === 3) score += 30;
      else score += 20;

      if (cell.owner === 2) {
        score += 40;

        if (cell.atoms === criticalMass - 1) {
          if (gameState.totalAtoms < 4) {
            score -= 30;
          } else {
            score += 20;
          }
        }
      }

      const adjacent = getAdjacentCells(row, col);
      let dangerLevel = 0;

      for (const [adjRow, adjCol] of adjacent) {
        const adjCell = board[adjRow][adjCol];
        if (adjCell.owner === 1 && adjCell.atoms > 0) {
          const adjCriticalMass = getCriticalMass(adjRow, adjCol);

          if (adjCell.atoms === adjCriticalMass - 1) {
            dangerLevel += 60;
          } else {
            dangerLevel += 20;
          }
        }
      }

      score -= dangerLevel;

      if (cell.owner === 0) {
        const wouldBeVulnerable = adjacent.some(
          ([adjRow, adjCol]) =>
            board[adjRow][adjCol].owner === 1 && board[adjRow][adjCol].atoms > 0
        );

        if (wouldBeVulnerable && criticalMass > 2) {
          score -= 40;
        }
      }

      return score;
    }

    function evaluateMidGameMove(board, move, resultBoard, gameState) {
      let score = 0;
      const row = move.row;
      const col = move.col;
      const cell = board[row][col];
      const criticalMass = getCriticalMass(row, col);

      if (criticalMass === 2) score += 40;
      else if (criticalMass === 3) score += 30;
      else score += 20;

      if (cell.owner === 2) {
        score += 30;

        if (cell.atoms === criticalMass - 1) {
          let capturedCells = 0;

          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              if (
                board[r][c].owner === 1 &&
                board[r][c].atoms > 0 &&
                (resultBoard[r][c].owner !== 1 || resultBoard[r][c].atoms === 0)
              ) {
                capturedCells++;

                const cellCriticalMass = getCriticalMass(r, c);
                if (cellCriticalMass === 2) capturedCells += 2;
                else if (cellCriticalMass === 3) capturedCells += 1;
              }
            }
          }

          score += capturedCells * 50;
        }
      }

      score += evaluateChainPotential(resultBoard);

      score += evaluateDefensiveValue(board, move, resultBoard);

      return score;
    }

    function evaluateLateGameMove(board, move, resultBoard, gameState) {
      let score = 0;
      const row = move.row;
      const col = move.col;
      const cell = board[row][col];
      const criticalMass = getCriticalMass(row, col);

      if (criticalMass === 2) score += 30;
      else if (criticalMass === 3) score += 20;
      else score += 15;

      if (cell.owner === 2 && cell.atoms === criticalMass - 1) {
        let capturedCells = 0;

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (
              board[r][c].owner === 1 &&
              board[r][c].atoms > 0 &&
              (resultBoard[r][c].owner !== 1 || resultBoard[r][c].atoms === 0)
            ) {
              capturedCells++;

              const cellCriticalMass = getCriticalMass(r, c);
              if (cellCriticalMass === 2) capturedCells += 2;
              else if (cellCriticalMass === 3) capturedCells += 1;
            }
          }
        }

        score += capturedCells * 70;
      }

      score += evaluateChainPotential(resultBoard) * 1.5;

      const resultState = analyzeGameState(resultBoard);

      if (resultState.playerCells < gameState.playerCells) {
        score += (gameState.playerCells - resultState.playerCells) * 100;

        if (resultState.playerCells <= 3) {
          score += (4 - resultState.playerCells) * 200;
        }
      }

      return score;
    }

    function evaluateChainPotential(board) {
      let score = 0;

      const criticalCells = [];

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (cell.owner === 2 && cell.atoms > 0) {
            const criticalMass = getCriticalMass(row, col);
            const remaining = criticalMass - cell.atoms;

            if (remaining <= 2) {
              criticalCells.push({
                row,
                col,
                criticalMass,
                remaining,
              });
            }
          }
        }
      }

      for (const cell of criticalCells) {
        const baseValue = cell.remaining === 1 ? 30 : 15;

        const adjacent = getAdjacentCells(cell.row, cell.col);
        let chainValue = 0;

        for (const [adjRow, adjCol] of adjacent) {
          const adjCell = board[adjRow][adjCol];

          if (adjCell.owner === 2 && adjCell.atoms > 0) {
            const adjCriticalMass = getCriticalMass(adjRow, adjCol);
            const adjRemaining = adjCriticalMass - adjCell.atoms;

            if (adjRemaining <= 2) {
              chainValue += adjRemaining === 1 ? 25 : 10;

              if (adjCriticalMass === 2) chainValue += 15;
              else if (adjCriticalMass === 3) chainValue += 8;

              const adjAdjacent = getAdjacentCells(adjRow, adjCol);
              for (const [r, c] of adjAdjacent) {
                if (board[r][c].owner === 1 && board[r][c].atoms > 0) {
                  chainValue += 15;
                }
              }
            }
          }
        }

        score += baseValue + chainValue;
      }

      return score;
    }

    function evaluateDefensiveValue(board, move, resultBoard) {
      let score = 0;

      const playerCriticalCells = [];

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (cell.owner === 1 && cell.atoms > 0) {
            const criticalMass = getCriticalMass(row, col);
            const remaining = criticalMass - cell.atoms;

            if (remaining === 1) {
              playerCriticalCells.push({ row, col });
            }
          }
        }
      }

      for (const cell of playerCriticalCells) {
        if (
          resultBoard[cell.row][cell.col].owner !== 1 ||
          resultBoard[cell.row][cell.col].atoms === 0
        ) {
          score += 70;
        }
      }

      const adjacent = getAdjacentCells(move.row, move.col);
      let protectingOurCells = false;

      for (const [adjRow, adjCol] of adjacent) {
        if (
          board[adjRow][adjCol].owner === 2 &&
          board[adjRow][adjCol].atoms > 0
        ) {
          const adjAdjacent = getAdjacentCells(adjRow, adjCol);
          for (const [r, c] of adjAdjacent) {
            if (board[r][c].owner === 1 && board[r][c].atoms > 0) {
              protectingOurCells = true;
              break;
            }
          }

          if (protectingOurCells) break;
        }
      }

      if (protectingOurCells) {
        score += 40;
      }

      return score;
    }

    function findFallbackMove(board) {
      const validMoves = getAllValidMoves(board, 2);

      if (validMoves.length === 0) {
        return { row: 0, col: 0 };
      }

      const scoredMoves = validMoves.map((move) => {
        const criticalMass = getCriticalMass(move.row, move.col);
        const cell = board[move.row][move.col];
        let score = 0;

        if (criticalMass === 2) score += 30;
        else if (criticalMass === 3) score += 20;
        else score += 10;

        if (cell.owner === 2) {
          score += 20;

          if (cell.atoms === criticalMass - 1) {
            score += 40;
          }
        }

        score += Math.random() * 10;

        return { ...move, score };
      });

      scoredMoves.sort((a, b) => b.score - a.score);

      return scoredMoves[0];
    }

    function analyzeGameState(board) {
      let playerCells = 0;
      let playerAtoms = 0;
      let aiCells = 0;
      let aiAtoms = 0;
      let emptyCells = 0;
      let playerCorners = 0;
      let aiCorners = 0;

      const corners = [
        [0, 0],
        [0, COLS - 1],
        [ROWS - 1, 0],
        [ROWS - 1, COLS - 1],
      ];
      const isCorner = (r, c) =>
        corners.some(([cr, cc]) => cr === r && cc === c);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];

          if (cell.atoms === 0) {
            emptyCells++;
          } else if (cell.owner === 1) {
            playerCells++;
            playerAtoms += cell.atoms;
            if (isCorner(row, col)) playerCorners++;
          } else if (cell.owner === 2) {
            aiCells++;
            aiAtoms += cell.atoms;
            if (isCorner(row, col)) aiCorners++;
          }
        }
      }

      const totalCells = ROWS * COLS;
      const totalAtoms = playerAtoms + aiAtoms;
      const filledRatio = (totalCells - emptyCells) / totalCells;

      let phase;
      if (filledRatio < 0.3 || totalAtoms < 10) phase = "early";
      else if (filledRatio < 0.7 || totalAtoms < 30) phase = "mid";
      else phase = "late";

      return {
        playerCells,
        playerAtoms,
        aiCells,
        aiAtoms,
        emptyCells,
        totalAtoms,
        playerCorners,
        aiCorners,
        phase,
      };
    }

    function checkGameOver(board) {
      let player1Exists = false;
      let player2Exists = false;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (cell.atoms > 0) {
            if (cell.owner === 1) player1Exists = true;
            if (cell.owner === 2) player2Exists = true;
          }
        }
      }

      const gameOver =
        (player1Exists && !player2Exists) || (!player1Exists && player2Exists);
      let winner = 0;

      if (gameOver) {
        if (!player1Exists && player2Exists) winner = 2;
        else if (player1Exists && !player2Exists) winner = 1;
      }

      return { gameOver, winner };
    }

    function getAllValidMoves(board, player) {
      const moves = [];

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (cell.owner === 0 || cell.owner === player) {
            moves.push({ row, col });
          }
        }
      }

      return moves;
    }

    function simulateMove(board, row, col, player) {
      const simBoard = JSON.parse(JSON.stringify(board));

      simBoard[row][col].atoms += 1;
      simBoard[row][col].owner = player;

      let changed = true;
      let iterations = 0;
      const maxIterations = 100;

      while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        const explosions = [];

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const cell = simBoard[r][c];
            const criticalMass = getCriticalMass(r, c);

            if (cell.atoms >= criticalMass) {
              explosions.push({ row: r, col: c, owner: cell.owner });
            }
          }
        }

        if (explosions.length > 0) {
          changed = true;

          for (const explosion of explosions) {
            const { row, col, owner } = explosion;
            const cell = simBoard[row][col];
            const criticalMass = getCriticalMass(row, col);

            cell.atoms -= criticalMass;
            if (cell.atoms === 0) {
              cell.owner = 0;
            }

            const adjacent = getAdjacentCells(row, col);
            for (const [adjRow, adjCol] of adjacent) {
              const adjCell = simBoard[adjRow][adjCol];
              adjCell.atoms += 1;
              adjCell.owner = owner;
            }
          }
        }
      }

      let player1Cells = 0;
      let player2Cells = 0;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = simBoard[r][c];
          if (cell.atoms > 0) {
            if (cell.owner === 1) player1Cells++;
            else if (cell.owner === 2) player2Cells++;
          }
        }
      }

      const gameOver =
        (player1Cells === 0 && player2Cells > 0) ||
        (player2Cells === 0 && player1Cells > 0);
      let winner = 0;

      if (gameOver) {
        if (player1Cells === 0 && player2Cells > 0) winner = 2;
        else if (player2Cells === 0 && player1Cells > 0) winner = 1;
      }

      return {
        board: simBoard,
        player1Cells,
        player2Cells,
        gameOver,
        winner,
      };
    }

    function evaluatePosition(board) {
      let score = 0;

      let player1Cells = 0;
      let player1Atoms = 0;
      let player1Corners = 0;
      let player1Edges = 0;
      let player1Critical = 0;

      let player2Cells = 0;
      let player2Atoms = 0;
      let player2Corners = 0;
      let player2Edges = 0;
      let player2Critical = 0;

      const corners = [
        [0, 0],
        [0, COLS - 1],
        [ROWS - 1, 0],
        [ROWS - 1, COLS - 1],
      ];
      const isCorner = (r, c) =>
        corners.some(([cr, cc]) => cr === r && cc === c);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = board[row][col];
          if (cell.atoms === 0) continue;

          const criticalMass = getCriticalMass(row, col);
          const isEdge = criticalMass === 3;
          const isCritical = cell.atoms === criticalMass - 1;
          const isCornerCell = isCorner(row, col);

          if (cell.owner === 1) {
            player1Cells++;
            player1Atoms += cell.atoms;
            if (isCornerCell) player1Corners++;
            if (isEdge) player1Edges++;
            if (isCritical) player1Critical++;
          } else if (cell.owner === 2) {
            player2Cells++;
            player2Atoms += cell.atoms;
            if (isCornerCell) player2Corners++;
            if (isEdge) player2Edges++;
            if (isCritical) player2Critical++;
          }
        }
      }

      score += (player2Cells - player1Cells) * 100;
      score += (player2Atoms - player1Atoms) * 30;

      score += (player2Corners - player1Corners) * 60;
      score += (player2Edges - player1Edges) * 30;
      score += (player2Critical - player1Critical) * 70;

      score += evaluateRegionalControl(board);

      score += evaluateChainPotential(board);

      return score;
    }

    function evaluateRegionalControl(board) {
      let score = 0;

      const regions = [
        [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
        ],
        [
          [0, COLS - 2],
          [0, COLS - 1],
          [1, COLS - 2],
          [1, COLS - 1],
        ],
        [
          [ROWS - 2, 0],
          [ROWS - 1, 0],
          [ROWS - 2, 1],
          [ROWS - 1, 1],
        ],
        [
          [ROWS - 2, COLS - 2],
          [ROWS - 1, COLS - 2],
          [ROWS - 2, COLS - 1],
          [ROWS - 1, COLS - 1],
        ],

        [
          [Math.floor(ROWS / 2) - 1, Math.floor(COLS / 2) - 1],
          [Math.floor(ROWS / 2) - 1, Math.floor(COLS / 2)],
          [Math.floor(ROWS / 2), Math.floor(COLS / 2) - 1],
          [Math.floor(ROWS / 2), Math.floor(COLS / 2)],
        ],
      ];

      for (const region of regions) {
        let playerControl = 0;
        let aiControl = 0;

        for (const [row, col] of region) {
          const cell = board[row][col];
          if (cell.atoms > 0) {
            if (cell.owner === 1) {
              playerControl++;
            } else if (cell.owner === 2) {
              aiControl++;
            }
          }
        }

        score += (aiControl - playerControl) * 20;

        if (aiControl > 0 && playerControl === 0) {
          score += 50;
        }
        if (playerControl > 0 && aiControl === 0) {
          score -= 50;
        }
      }

      return score;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function executeMove(board, row, col) {
      setAiHasMoved(true);
      setMoveCount((prev) => prev + 1);

      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][col].atoms += 1;
      newBoard[row][col].owner = 2;
      newBoard[row][col].isNew = true;

      setBoard(newBoard);
      setMessage("AI made a move!");

      setTimeout(() => {
        const updatedBoard = JSON.parse(JSON.stringify(newBoard));
        updatedBoard[row][col].isNew = false;
        processChainReaction(updatedBoard, 2);
      }, 25);
    }
  };

  const handleModeSelection = (mode) => {
    setGameMode(mode);
    setShowModeSelection(false);
    initializeBoard();
  };

  const getAtomPositions = (count) => {
    if (count === 1) return [{ top: "50%", left: "50%" }];

    if (count === 2)
      return [
        { top: "38%", left: "38%" },
        { top: "62%", left: "62%" },
      ];

    if (count === 3)
      return [
        { top: "50%", left: "25%" },
        { top: "25%", left: "65%" },
        { top: "75%", left: "65%" },
      ];

    if (count === 4)
      return [
        { top: "35%", left: "35%" },
        { top: "35%", left: "65%" },
        { top: "65%", left: "35%" },
        { top: "65%", left: "65%" },
      ];

    if (count === 5)
      return [
        { top: "50%", left: "50%" },
        { top: "25%", left: "25%" },
        { top: "25%", left: "75%" },
        { top: "75%", left: "25%" },
        { top: "75%", left: "75%" },
      ];

    if (count === 6)
      return [
        { top: "33%", left: "33%" },
        { top: "33%", left: "67%" },
        { top: "67%", left: "33%" },
        { top: "67%", left: "67%" },
        { top: "50%", left: "20%" },
        { top: "50%", left: "80%" },
      ];

    if (count === 7)
      return [
        { top: "50%", left: "50%" },
        { top: "30%", left: "30%" },
        { top: "30%", left: "70%" },
        { top: "70%", left: "30%" },
        { top: "70%", left: "70%" },
        { top: "20%", left: "50%" },
        { top: "80%", left: "50%" },
      ];

    if (count === 8)
      return [
        { top: "30%", left: "30%" },
        { top: "30%", left: "50%" },
        { top: "30%", left: "70%" },
        { top: "50%", left: "30%" },
        { top: "50%", left: "70%" },
        { top: "70%", left: "30%" },
        { top: "70%", left: "50%" },
        { top: "70%", left: "70%" },
      ];

    return Array(count)
      .fill()
      .map((_, i) => {
        const angle = i * (360 / count) * (Math.PI / 180);
        const radius = count > 12 ? 40 : 35;
        return {
          top: `${50 + Math.sin(angle) * radius}%`,
          left: `${50 + Math.cos(angle) * radius}%`,
        };
      });
  };

  const renderAtom = (index, total, color, isExploding, isNew) => {
    const isMobile = window.innerWidth < 768;

    const positions = getAtomPositions(total);
    const position = positions[index % positions.length];
    const baseSize = isMobile
      ? total <= 3
        ? 14
        : total <= 6
        ? 12
        : 10
      : total <= 3
      ? 20
      : total <= 6
      ? 16
      : 14;

    const nucleusSize = baseSize * 0.65;
    const shellSize = baseSize;

    const mainColor = color;
    const lighterColor =
      color === COLORS.PLAYER1
        ? "#9d6dfa"
        : color === COLORS.PLAYER2
        ? "#f56faf"
        : "#f56faf";
    const darkerColor =
      color === COLORS.PLAYER1
        ? "#5e28d9"
        : color === COLORS.PLAYER2
        ? "#be185d"
        : "#be185d";

    const orbitAngle = (index % 3) * 60;

    const nucleusGlow = isExploding
      ? `0 0 ${isMobile ? 8 : 15}px ${COLORS.EXPLOSION}`
      : `0 0 ${isMobile ? 4 : 8}px ${mainColor}`;

    const shellGlow = isExploding
      ? `0 0 ${isMobile ? 3 : 6}px ${COLORS.EXPLOSION}, inset 0 0 ${
          isMobile ? 2 : 4
        }px ${COLORS.EXPLOSION}`
      : `0 0 ${isMobile ? 2 : 4}px ${mainColor}, inset 0 0 ${
          isMobile ? 1 : 2
        }px ${lighterColor}`;

    return (
      <div
        key={`atom-${index}`}
        className="absolute z-10"
        style={{
          top: position.top,
          left: position.left,
          width: `${shellSize}px`,
          height: `${shellSize}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          className="absolute rounded-full border-2 w-full h-full"
          style={{
            borderColor: isExploding ? COLORS.EXPLOSION : lighterColor,
            borderStyle: "solid",
            boxShadow: shellGlow,
            transform: `rotate(${orbitAngle}deg)`,
            opacity: isExploding ? 0.9 : 0.85,
          }}
          initial={{
            scale: isNew ? 0 : 1,
            opacity: isNew ? 0 : isExploding ? 0.9 : 0.85,
          }}
          animate={{
            scale: 1,
            opacity: isExploding ? 0.9 : 0.85,
            rotate: isExploding ? [orbitAngle, orbitAngle + 180] : orbitAngle,
          }}
          transition={{
            duration: isExploding ? 0.4 : 0.2,
            ease: "easeOut",
          }}
        />

        <motion.div
          className="absolute rounded-full"
          style={{
            width: `${nucleusSize}px`,
            height: `${nucleusSize}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: isExploding
              ? `radial-gradient(circle, ${COLORS.EXPLOSION} 30%, ${mainColor} 70%)`
              : `radial-gradient(circle, ${lighterColor} 30%, ${mainColor} 70%)`,
            boxShadow: nucleusGlow,
          }}
          initial={{
            scale: isNew ? 0 : 1,
            opacity: isNew ? 0 : 1,
          }}
          animate={{
            scale: isExploding ? [1, 1.3, 1] : 1,
            opacity: 1,
          }}
          transition={{
            duration: isExploding ? 0.3 : 0.2,
            ease: "easeOut",
          }}
        />
      </div>
    );
  };

  const renderCell = (row, col) => {
    const cell = board[row][col];
    const criticalMass = getCriticalMass(row, col);
    const isCritical = cell.atoms === criticalMass - 1;
    const isHovered =
      hoveredCell && hoveredCell[0] === row && hoveredCell[1] === col;
    const isMobile = window.innerWidth < 768;

    let cellStyle = {
      backgroundColor: CELL_COLORS.DEFAULT.bg,
      borderColor: CELL_COLORS.DEFAULT.border,
      boxShadow: CELL_COLORS.DEFAULT.glow,
    };

    let atomColor = COLORS.PLAYER1;

    if (cell.owner === 1) {
      cellStyle.borderColor = CELL_COLORS.PLAYER1.border;
      if (isCritical) {
        cellStyle.backgroundColor = CELL_COLORS.PLAYER1.criticalBg;
        cellStyle.boxShadow = isMobile ? "none" : CELL_COLORS.PLAYER1.glow;
      }
      atomColor = COLORS.PLAYER1;
    } else if (cell.owner === 2) {
      cellStyle.borderColor =
        gameMode === GAME_MODES.SINGLE_PLAYER
          ? CELL_COLORS.AI.border
          : CELL_COLORS.PLAYER2.border;
      if (isCritical) {
        cellStyle.backgroundColor =
          gameMode === GAME_MODES.SINGLE_PLAYER
            ? CELL_COLORS.AI.criticalBg
            : CELL_COLORS.PLAYER2.criticalBg;
        cellStyle.boxShadow = isMobile
          ? "none"
          : gameMode === GAME_MODES.SINGLE_PLAYER
          ? CELL_COLORS.AI.glow
          : CELL_COLORS.PLAYER2.glow;
      }
      atomColor =
        gameMode === GAME_MODES.SINGLE_PLAYER ? COLORS.AI : COLORS.PLAYER2;
    }

    if (isHovered && gameStatus === "playing" && !animating) {
      if (gameMode === GAME_MODES.SINGLE_PLAYER && currentPlayer === 1) {
        cellStyle.boxShadow = isMobile ? "none" : `0 0 10px ${COLORS.PLAYER1}`;
        cellStyle.borderColor = `${COLORS.PLAYER1}`;
      } else if (gameMode === GAME_MODES.TWO_PLAYER) {
        const hoverColor =
          currentPlayer === 1 ? COLORS.PLAYER1 : COLORS.PLAYER2;
        cellStyle.boxShadow = isMobile ? "none" : `0 0 10px ${hoverColor}`;
        cellStyle.borderColor = `${hoverColor}`;
      }
    }

    return (
      <motion.div
        key={`cell-${row}-${col}`}
        className="relative w-full h-full aspect-square border-2 rounded-md flex items-center justify-center cursor-pointer backdrop-blur-sm overflow-hidden"
        style={cellStyle}
        whileHover={isMobile ? {} : { scale: 1.05 }}
        onHoverStart={() => setHoveredCell([row, col])}
        onHoverEnd={() => setHoveredCell(null)}
        onClick={() => handleCellClick(row, col)}
      >
        {isCritical && !isMobile && (
          <motion.div
            className="absolute inset-0 opacity-20 z-0"
            style={{
              background: `radial-gradient(circle, ${
                cell.owner === 1 ? COLORS.PLAYER1 : COLORS.PLAYER2
              } 0%, transparent 70%)`,
            }}
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="absolute bottom-0.5 right-0.5 text-[8px] opacity-30 text-white font-mono">
          {criticalMass}
        </div>

        {cell.isExploding && (
          <ExplosionEffect
            position={{ top: "50%", left: "50%" }}
            color={cell.owner === 1 ? COLORS.PLAYER1 : COLORS.PLAYER2}
          />
        )}
        {Array(cell.atoms)
          .fill()
          .map((_, i) =>
            renderAtom(i, cell.atoms, atomColor, cell.isExploding, cell.isNew)
          )}
      </motion.div>
    );
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const ModeSelectionScreen = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    return (
      <motion.div
        className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20 p-2 sm:p-4 ${
          isMobile ? "" : "backdrop-blur-md"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isMobile ? 0.15 : 0.25 }}
      >
        <motion.div
          className={`bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-auto shadow-[0_0_25px_rgba(100,100,255,0.3)] ${
            isMobile ? "bg-opacity-95" : "bg-opacity-90 backdrop-blur-sm"
          }`}
          initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: isMobile ? 0.97 : 0.95 }}
          transition={{
            duration: isMobile ? 0.2 : 0.25,
            ease: "easeOut",
          }}
        >
          <div className="flex items-center mb-6">
            <Zap
              className="text-amber-400 mr-3 h-6 w-6 sm:h-8 sm:w-8"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Game Mode
            </h2>
          </div>

          <div className="space-y-6 mb-6">
            <p className="text-gray-300 text-sm sm:text-base">
              Select your preferred game mode:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                className="flex flex-col items-center justify-center p-4 sm:p-5 bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-lg transition-all duration-300"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeSelection(GAME_MODES.SINGLE_PLAYER)}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Bot
                    className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-semibold text-white text-base sm:text-lg">
                  vs AI
                </h3>
                <p className="text-gray-300 text-xs mt-1 sm:mt-2">
                  Challenge the computer
                </p>
              </motion.button>

              <motion.button
                className="flex flex-col items-center justify-center p-4 sm:p-5 bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-lg transition-all duration-300"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeSelection(GAME_MODES.TWO_PLAYER)}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Users
                    className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-semibold text-white text-base sm:text-lg">
                  2 Players
                </h3>
                <p className="text-gray-300 text-xs mt-1 sm:mt-2">
                  Play with a friend
                </p>
              </motion.button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-2">
            <p>Choose your gameplay experience</p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const Tutorial = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    return (
      <motion.div
        className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20 p-2 sm:p-4 ${
          isMobile ? "" : "backdrop-blur-sm"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isMobile ? 0.15 : 0.25 }}
      >
        <motion.div
          className={`bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-auto shadow-[0_0_25px_rgba(100,100,255,0.2)] ${
            isMobile ? "bg-opacity-95" : "bg-opacity-90 backdrop-blur-sm"
          }`}
          initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: isMobile ? 0.97 : 0.95 }}
          transition={{
            duration: isMobile ? 0.2 : 0.25,
            ease: "easeOut",
          }}
        >
          <div className="flex items-center mb-5">
            <Zap
              className="text-amber-400 mr-3 h-6 w-6 sm:h-8 sm:w-8"
              strokeWidth={1.5}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Atoms Surge
            </h2>
          </div>

          <div className="space-y-5 mb-6">
            <p className="text-gray-300 text-sm sm:text-base">
              A strategic game of atomic chain reactions and territorial
              conquest.
            </p>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="mr-2">⚛️</span>
                <span>How to Play:</span>
              </h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 mt-1 mr-3 flex-shrink-0 shadow-glow-sm"></span>
                  <span>Place atoms in cells to build your territory</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-1 mr-3 flex-shrink-0 shadow-glow-sm"></span>
                  <span>
                    When a cell reaches critical mass, it explodes and expands
                    to adjacent cells!
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mt-1 mr-3 flex-shrink-0 shadow-glow-sm"></span>
                  <span>Capture opponent cells by exploding next to them</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mt-1 mr-3 flex-shrink-0 shadow-glow-sm"></span>
                  <span>Win by eliminating all opponent atoms</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="mr-2">💥</span>
                <span>Critical Mass:</span>
              </h3>
              <div className="grid grid-cols-3 gap-3 text-gray-300 text-sm bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 grid grid-cols-2 grid-rows-2 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-yellow-500 bg-opacity-70 border-b border-r border-gray-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-100">2</span>
                    </div>
                    <div className="bg-gray-700 border-b border-gray-600"></div>
                    <div className="bg-gray-700 border-r border-gray-600"></div>
                    <div className="bg-gray-700"></div>
                  </div>
                  <span className="text-xs font-medium text-center">
                    Corner: 2 atoms
                  </span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 grid grid-cols-3 grid-rows-3 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-700"></div>
                    <div className="bg-green-500 bg-opacity-70 border-l border-r border-gray-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-100">3</span>
                    </div>
                    <div className="bg-gray-700"></div>
                    <div className="bg-gray-700 border-t border-b border-gray-600"></div>
                    <div className="bg-gray-700 border-t border-b border-gray-600"></div>
                    <div className="bg-gray-700 border-t border-b border-gray-600"></div>
                    <div className="bg-gray-700"></div>
                    <div className="bg-gray-700 border-l border-r border-gray-600"></div>
                    <div className="bg-gray-700"></div>
                  </div>
                  <span className="text-xs font-medium text-center">
                    Edge: 3 atoms
                  </span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 grid grid-cols-3 grid-rows-3 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-700 border-b border-r border-gray-600"></div>
                    <div className="bg-gray-700 border-b border-l border-r border-gray-600"></div>
                    <div className="bg-gray-700 border-b border-l border-gray-600"></div>
                    <div className="bg-gray-700 border-t border-b border-r border-gray-600"></div>
                    <div className="bg-blue-500 bg-opacity-70 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-100">4</span>
                    </div>
                    <div className="bg-gray-700 border-t border-b border-l border-gray-600"></div>
                    <div className="bg-gray-700 border-t border-r border-gray-600"></div>
                    <div className="bg-gray-700 border-t border-l border-r border-gray-600"></div>
                    <div className="bg-gray-700 border-t border-l border-gray-600"></div>
                  </div>
                  <span className="text-xs font-medium text-center">
                    Center: 4 atoms
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
            <div className="flex items-center space-x-4 text-sm w-full justify-center sm:justify-start">
              <div className="flex items-center bg-gray-800 bg-opacity-50 px-2 py-1 rounded-full">
                <div
                  className="w-4 h-4 rounded-full mr-2 shadow-glow-sm"
                  style={{ backgroundColor: COLORS.PLAYER1 }}
                ></div>
                <span className="text-purple-300">Player 1</span>
              </div>
              <div className="flex items-center bg-gray-800 bg-opacity-50 px-2 py-1 rounded-full">
                <div
                  className="w-4 h-4 rounded-full mr-2 shadow-glow-sm"
                  style={{ backgroundColor: COLORS.PLAYER2 }}
                ></div>
                <span className="text-pink-300">Player 2</span>
              </div>
            </div>

            <div className="w-full flex justify-center sm:w-auto">
              <motion.button
                className="px-6 py-2.5 rounded-md text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all duration-300"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowTutorial(false);
                  setShowModeSelection(true);
                }}
              >
                Continue
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const GameOverScreen = () => {
    const isPlayerWon = gameStatus === "player1_won";
    const mainColor = isPlayerWon ? "#fbbf24" : "#ec4899";
    const gradientColor = isPlayerWon
      ? "from-yellow-400 to-amber-500"
      : "from-pink-400 to-pink-500";

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative w-5/6 max-w-xs z-10 rounded-3xl overflow-hidden bg-gray-900/95"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          style={{
            boxShadow: `0 0 30px ${mainColor}80, 0 0 2px ${mainColor}`,
          }}
        >
          <div className="pt-16 pb-4">
            <motion.div
              className="absolute top-0 left-0 right-0 h-24 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-28 h-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: `radial-gradient(circle, ${mainColor} 0%, ${mainColor}00 70%)`,
                  opacity: 0.4,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ delay: 0.2 }}
              />

              <motion.div
                className="absolute top-6 left-1/2 -translate-x-1/2 text-4xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 10 }}
              >
                {isPlayerWon ? "🏆" : "💥"}
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-center text-4xl font-bold tracking-wide"
              style={{ color: mainColor }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isPlayerWon ? "VICTORY!" : "DEFEAT!"}
            </motion.h2>
          </div>

          <div className="px-6 pt-4 pb-10 flex flex-col items-center bg-gray-900/95">
            <motion.div
              className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${gradientColor} mb-5`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white text-sm font-medium">
                {isPlayerWon
                  ? `+${Math.floor(Math.random() * 20) + 30} XP`
                  : `+${Math.floor(Math.random() * 10) + 5} XP`}
              </p>
            </motion.div>

            <motion.p
              className="text-gray-200 text-center text-sm mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isPlayerWon
                ? gameMode === GAME_MODES.SINGLE_PLAYER
                  ? "Your strategy crushed the AI opponent!"
                  : "Player 1 dominated the game!"
                : gameMode === GAME_MODES.SINGLE_PLAYER
                ? "The AI outmaneuvered you this time."
                : "Player 2 won the atomic battle!"}
            </motion.p>

            <motion.button
              className={`px-12 py-3.5 rounded-xl text-white font-bold tracking-wide text-lg bg-gradient-to-r ${gradientColor}`}
              style={{ boxShadow: `0 4px 15px ${mainColor}50` }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={initializeBoard}
            >
              PLAY AGAIN
            </motion.button>

            <motion.div
              className="w-full h-0.5 mt-10 bg-gray-800 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${gradientColor}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.9, duration: 0.7 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-hidden">
      <GoogleAnalytics />
      {!isLowPerformance && <BackgroundParticles />}

      <AnimatePresence mode={isMobile ? "sync" : "async"}>
        {showTutorial && <Tutorial />}
        {showModeSelection && <ModeSelectionScreen />}
      </AnimatePresence>

      <div className="w-full h-full max-w-7xl max-h-screen flex flex-col items-center justify-center px-2 sm:px-4 z-10">
        <div className="flex flex-col h-full w-full max-w-[min(90vh,600px)] mx-auto">
          <div className="flex-none pt-2 sm:pt-4 pb-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-500 text-center">
              Atoms Surge
            </h1>

            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-7 flex-wrap">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-full ${
                  currentPlayer === 1
                    ? "bg-gradient-to-r from-violet-900 to-purple-900 ring-2 ring-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    : "bg-gray-800 bg-opacity-50"
                }`}
                animate={{
                  scale: currentPlayer === 1 ? (isMobile ? 1.01 : 1.05) : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                <div
                  className="h-2 w-2 sm:h-3 sm:w-3 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]"
                  style={{ backgroundColor: COLORS.PLAYER1 }}
                ></div>
                <p className="text-purple-300 text-xs font-medium">
                  {gameMode === GAME_MODES.SINGLE_PLAYER ? "You" : "Player 1"}
                </p>
              </motion.div>

              <div className="text-gray-400 text-xs opacity-50">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                </svg>
              </div>

              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-full ${
                  currentPlayer === 2
                    ? "bg-gradient-to-r from-pink-900 to-rose-900 ring-2 ring-pink-500 shadow-[0_0_10px_rgba(219,39,119,0.5)]"
                    : "bg-gray-800 bg-opacity-50"
                }`}
                animate={{
                  scale: currentPlayer === 2 ? (isMobile ? 1.01 : 1.05) : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-pink-300 text-xs font-medium">
                  {gameMode === GAME_MODES.SINGLE_PLAYER ? "AI" : "Player 2"}
                </p>
                <div
                  className="h-2 w-2 sm:h-3 sm:w-3 rounded-full shadow-[0_0_8px_rgba(219,39,119,0.8)]"
                  style={{
                    backgroundColor:
                      gameMode === GAME_MODES.SINGLE_PLAYER
                        ? COLORS.AI
                        : COLORS.PLAYER2,
                  }}
                ></div>
              </motion.div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0 py-1">
            <motion.div
              className="relative bg-gray-900 bg-opacity-60 p-2 rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.3)] border border-gray-800 w-full max-h-full overflow-hidden aspect-[6/8] backdrop-blur-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none rounded-xl overflow-hidden">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="hexagons"
                    width="50"
                    height="43.4"
                    patternUnits="userSpaceOnUse"
                    patternTransform="scale(0.5)"
                  >
                    <polygon
                      points="25,0 50,14.4 50,43.4 25,57.8 0,43.4 0,14.4"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#hexagons)" />
                </svg>
              </div>

              {gameStatus !== "playing" && <GameOverScreen />}

              <div className="grid grid-cols-6 gap-2 h-full w-full relative z-10">
                {board.map((row, rowIndex) =>
                  row.map((_, colIndex) => renderCell(rowIndex, colIndex))
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex-none flex flex-col space-y-2 pb-20 sm:pb-4 pt-1">
            <div className="flex flex-row justify-between items-center">
              <div className="flex-1">
                <motion.div
                  className="flex items-center gap-2 text-white bg-gray-800 bg-opacity-60 px-2 py-1 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 w-full"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className="w-3 h-3 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        currentPlayer === 1
                          ? COLORS.PLAYER1
                          : gameMode === GAME_MODES.SINGLE_PLAYER
                          ? COLORS.AI
                          : COLORS.PLAYER2,
                      boxShadow: isMobile
                        ? "none"
                        : animating
                        ? `0 0 5px ${
                            currentPlayer === 1
                              ? COLORS.PLAYER1
                              : gameMode === GAME_MODES.SINGLE_PLAYER
                              ? COLORS.AI
                              : COLORS.PLAYER2
                          }`
                        : `0 0 3px ${
                            currentPlayer === 1
                              ? COLORS.PLAYER1
                              : gameMode === GAME_MODES.SINGLE_PLAYER
                              ? COLORS.AI
                              : COLORS.PLAYER2
                          }`,
                    }}
                    animate={{
                      scale: animating ? [1, 1.08, 1] : [1, 1.03, 1],
                      opacity: 1,
                    }}
                    transition={{
                      duration: animating ? 0.6 : 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="text-xs sm:text-xs font-medium truncate">
                    {message}
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="flex gap-2 sm:gap-3 justify-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <motion.button
                className="px-3 py-1.5 rounded-md text-white font-medium text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1.5 shadow-lg"
                whileTap={{ scale: 0.95 }}
                onClick={initializeBoard}
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                New Game
              </motion.button>

              <motion.button
                className="px-3 py-1.5 rounded-md text-white font-medium text-xs sm:text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 flex items-center gap-1.5 shadow-lg"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                How to Play
              </motion.button>
              <motion.button
                className="px-3 py-1.5 rounded-md text-white font-medium text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-1.5 shadow-lg"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModeSelection(true)}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                Mode
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainReactionGame;