import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Palette,
  Car,
  Trophy,
  Star,
  Play,
  Sparkles,
  Target,
  Atom,
  ExternalLink,
  Zap,
  Cpu,
  Wifi,
  Download,
  Settings,
  Rocket,
  Github
} from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  difficulty: "Easy" | "Medium" | "Hard";
  players: string;
  category: string;
  features: string[];
  image?: string;
}

const games: Game[] = [
  {
    id: "atoms-surge",
    title: "Atoms Surge",
    description:
      "Strategic atomic chain reactions and territorial conquest. Build your empire through explosive gameplay.",
    icon: Atom,
    color: "#7c3aed",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    difficulty: "Hard",
    players: "1-2 Players",
    category: "Strategy",
    features: [
      "Chain Reactions",
      "AI Opponent",
      "Strategic Gameplay",
      "Explosive Action",
    ],
  },
  {
    id: "color-chain",
    title: "Color Chain Pro",
    description:
      "Match colorful gems in this addictive puzzle game. Create powerful combos and use special power-ups.",
    icon: Palette,
    color: "#ec4899",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    difficulty: "Medium",
    players: "1 Player",
    category: "Puzzle",
    features: ["Match-3 Gameplay", "Power-ups", "Combo System", "High Scores"],
  },
  {
    id: "krash-karts",
    title: "KrashKarts",
    description:
      "High-octane kart racing with weapons and power-ups. Battle against AI opponents in intense combat racing.",
    icon: Car,
    color: "#f59e0b",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    difficulty: "Medium",
    players: "1-4 Players",
    category: "Racing",
    features: [
      "Combat Racing",
      "Power-ups",
      "AI Opponents",
      "Real-time Action",
    ],
  },
];

const LoadingScreen = ({
  gameName,
  onComplete,
}: {
  gameName: string;
  onComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("Initializing");
  const [currentIcon, setCurrentIcon] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const loadingStages = useMemo(
    () => [
      { text: "Initializing quantum engine...", icon: Cpu },
      { text: "Downloading game assets...", icon: Download },
      { text: "Preparing neural networks...", icon: Wifi },
      { text: "Calibrating physics engine...", icon: Settings },
      { text: "Optimizing performance...", icon: Zap },
      { text: "Launching experience...", icon: Rocket },
    ],
    []
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const duration = 2000; // Reduced from 3000ms
    const interval = 50; // Reduced from 100ms for smoother progress
    const steps = duration / interval;
    const progressStep = 100 / steps;

    let currentProgress = 0;
    let stageIndex = 0;

    const timer = setInterval(() => {
      currentProgress += progressStep;

      const newStageIndex = Math.floor(
        (currentProgress / 100) * loadingStages.length
      );
      if (
        newStageIndex !== stageIndex &&
        newStageIndex < loadingStages.length
      ) {
        stageIndex = newStageIndex;
        setLoadingStage(loadingStages[stageIndex].text);
        setCurrentIcon(stageIndex);
      }

      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(onComplete, 300); // Reduced from 500ms
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, loadingStages]);

  const CurrentIcon = loadingStages[currentIcon]?.icon || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} // Faster transition
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: isMobile 
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
          : "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(15, 23, 42, 0.98) 100%)",
        backdropFilter: isMobile ? "none" : "blur(20px)",
        WebkitBackdropFilter: isMobile ? "none" : "blur(20px)",
      }}
    >
      {/* Reduced number of particles for mobile performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i: number) => (
            <motion.div
              key={i.toString()}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 2 }).map((_ring: any, index: number) => (
            <motion.div
              key={index} 
              className="absolute border border-purple-500/20 rounded-full"
              style={{
                width: `${120 + index * 40}px`, 
                height: `${120 + index * 40}px`, 
              }}
              animate={{ rotate: index % 2 === 0 ? 360 : -360 }} 
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <div
        className="relative text-center p-6 md:p-10 rounded-3xl border border-white/30 shadow-2xl max-w-sm md:max-w-lg w-full mx-4 z-10"
        style={{
          background: isMobile 
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.08)",
          backdropFilter: isMobile ? "none" : "blur(15px)",
          WebkitBackdropFilter: isMobile ? "none" : "blur(15px)",
          boxShadow: isMobile 
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <motion.div
          animate={isMobile ? {
            scale: [1, 1.05, 1], // Reduced animation for mobile
          } : {
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={isMobile ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          } : {
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-16 md:w-24 h-16 md:h-24 mx-auto mb-6 md:mb-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-2xl border border-white/40"
          style={{
            backdropFilter: isMobile ? "none" : "blur(10px)",
            WebkitBackdropFilter: isMobile ? "none" : "blur(10px)",
          }}
        >
          <Gamepad2 className="w-8 md:w-12 h-8 md:h-12 text-white drop-shadow-lg" />
        </motion.div>

        <motion.h2
          className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg"
          style={{
            background: "linear-gradient(45deg, #a855f7, #ec4899, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: isMobile ? "none" : "drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))",
          }}
        >
          {gameName}
        </motion.h2>

        <motion.div
          key={loadingStage}
          initial={{ opacity: 0, y: 5 }} // Reduced animation distance
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }} // Faster transition
          className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8"
        >
          <motion.div
            animate={isMobile ? {
              scale: [1, 1.1, 1], // Simplified animation for mobile
            } : {
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={isMobile ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            } : {
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 border border-white/30"
            style={{
              backdropFilter: isMobile ? "none" : "blur(10px)",
              WebkitBackdropFilter: isMobile ? "none" : "blur(10px)",
            }}
          >
            <CurrentIcon className="w-4 md:w-5 h-4 md:h-5 text-white" />
          </motion.div>
          <p className="text-gray-200 text-sm md:text-lg font-medium">
            {loadingStage}
          </p>
        </motion.div>

        <div className="relative mb-4 md:mb-6">
          <div
            className="relative w-full h-3 md:h-4 rounded-full overflow-hidden border border-white/40"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: isMobile ? "none" : "blur(10px)",
              WebkitBackdropFilter: isMobile ? "none" : "blur(10px)",
            }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)",
                boxShadow: isMobile ? "none" : "0 0 15px rgba(139, 92, 246, 0.6)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }} // Faster transition
            />
          </div>
        </div>

        <motion.div className="text-white font-mono text-lg md:text-2xl font-bold mb-4 md:mb-6">
          {Math.round(progress)}%
        </motion.div>

        <div className="flex justify-center space-x-2 md:space-x-3 mb-4 md:mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 md:w-3 h-2 md:h-3 rounded-full"
              style={{
                background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                boxShadow: isMobile ? "none" : "0 0 8px rgba(139, 92, 246, 0.6)",
              }}
              animate={isMobile ? {
                opacity: [0.4, 1, 0.4],
              } : {
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.2, // Slightly faster
                repeat: Infinity,
                delay: i * 0.15, // Reduced delay
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 text-xs md:text-sm"
        >
          <motion.p
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Preparing an epic gaming experience...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const GameHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGameSelect = useCallback((game: Game) => {
    if (game.id === "krash-karts" && window.innerWidth < 768) {
      setShowMobileWarning(true);
      return;
    }
    
    setSelectedGame(game);
    setIsLoading(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    if (selectedGame) {
      const gameUrl = `/game/${selectedGame.id}`;
      window.open(gameUrl, "_blank", "noopener,noreferrer");
      setIsLoading(false);
      setSelectedGame(null);
    }
  }, [selectedGame]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-200 bg-emerald-500/20 border-emerald-400/50";
      case "Medium":
        return "text-amber-200 bg-amber-500/20 border-amber-400/50";
      case "Hard":
        return "text-red-200 bg-red-500/20 border-red-400/50";
      default:
        return "text-gray-300 bg-gray-400/20 border-gray-400/40";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Simplified background for mobile */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob ${
                i === 0
                  ? "-top-30 -right-30 bg-purple-500"
                  : i === 1
                  ? "-bottom-30 -left-30 bg-yellow-500 animation-delay-2000"
                  : "top-30 left-30 bg-pink-500 animation-delay-4000"
              }`}
            />
          ))}
        </div>
      )}

      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => ( // Reduced from 10 to 6
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-3 md:px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} // Faster transition
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center mb-4 md:mb-6">
            {!isMobile && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="mr-2 md:mr-4"
              >
                <Gamepad2 className="w-8 md:w-12 h-8 md:h-12 text-purple-400" />
              </motion.div>
            )}

            {isMobile && (
              <div className="mr-2">
                <Gamepad2 className="w-8 h-8 text-purple-400" />
              </div>
            )}

            <h1 className="text-3xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              PlayVerse
            </h1>

            {!isMobile && (
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="ml-2 md:ml-4"
              >
                <Sparkles className="w-8 md:w-12 h-8 md:h-12 text-yellow-400" />
              </motion.div>
            )}

            {isMobile && (
              <div className="ml-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-7xl mx-auto">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }} // Reduced animation distance
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Faster and reduced delay
              className="group relative cursor-pointer"
              onMouseEnter={() => !isMobile && setHoveredGame(game.id)}
              onMouseLeave={() => !isMobile && setHoveredGame(null)}
              onClick={() => handleGameSelect(game)}
            >
              <div
                className={`relative p-0.5 md:p-1 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl transform transition-all duration-200 ${
                  !isMobile
                    ? "group-hover:scale-105 group-hover:shadow-3xl"
                    : ""
                } bg-gradient-to-br ${game.gradient}`}
              >
                <div
                  className="rounded-lg md:rounded-xl p-3 md:p-8 h-full border border-white/30 shadow-lg md:shadow-xl transition-all duration-200"
                  style={{
                    background: isMobile 
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(255, 255, 255, 0.12)",
                    backdropFilter: isMobile ? "none" : "blur(15px)",
                    WebkitBackdropFilter: isMobile ? "none" : "blur(15px)",
                  }}
                >
                  {isMobile ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${game.gradient} shadow-md border border-white/40`}
                        >
                          <game.icon className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(
                            game.difficulty
                          )} shadow-md`}
                        >
                          {game.difficulty}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-2 leading-tight drop-shadow-lg">
                        {game.title}
                      </h3>

                      <div className="flex flex-col gap-1 mb-3">
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-md border border-white/30 shadow-sm"
                          style={{
                            background: "rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          <Target className="w-3 h-3 text-white" />
                          <span className="text-white font-semibold text-xs">
                            {game.category}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-md border border-white/30 shadow-sm"
                          style={{
                            background: "rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          <Star className="w-3 h-3 text-white" />
                          <span className="text-white font-semibold text-xs">
                            {game.players}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-full bg-gradient-to-r ${game.gradient} text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-white/40 shadow-md`}
                      >
                        <Play className="w-3 h-3" />
                        <span className="text-xs">Play</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          animate={
                            hoveredGame === game.id
                              ? { scale: 1.1, rotate: 5 }
                              : { scale: 1, rotate: 0 }
                          }
                          transition={{ duration: 0.2 }} // Faster transition
                          className={`p-4 rounded-xl bg-gradient-to-br ${game.gradient} shadow-lg border border-white/40`}
                          style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                        >
                          <game.icon className="w-10 h-10 text-white drop-shadow-lg" />
                        </motion.div>
                        <div
                          className={`px-4 py-2 rounded-full text-sm font-bold border ${getDifficultyColor(
                            game.difficulty
                          )} shadow-md`}
                          style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                        >
                          {game.difficulty}
                        </div>
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-200 drop-shadow-lg">
                        {game.title}
                      </h3>

                      <p className="text-gray-100 text-base mb-6 leading-relaxed line-clamp-3 font-medium">
                        {game.description}
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 shadow-md"
                          style={{
                            background: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                        >
                          <Target className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold text-sm">
                            {game.category}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 shadow-md"
                          style={{
                            background: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                          }}
                        >
                          <Star className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold text-sm">
                            {game.players}
                          </span>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                          Features
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {game.features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-2 rounded-lg text-sm text-white font-medium border border-white/40 shadow-md"
                              style={{
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                          {game.features.length > 3 && (
                            <span
                              className="px-3 py-2 rounded-lg text-sm text-white font-medium border border-white/40 shadow-md"
                              style={{
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                              }}
                            >
                              +{game.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.1 }} // Faster transition
                        className={`w-full bg-gradient-to-r ${game.gradient} hover:shadow-xl text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 border border-white/40 shadow-lg`}
                        style={{
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                        }}
                      >
                        <Play className="w-6 h-6" />
                        <span className="text-lg">Play Now</span>
                        <ExternalLink className="w-5 h-5 opacity-80" />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredGame === game.id ? 1 : 0 }}
                        transition={{ duration: 0.1 }} // Faster transition
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }} // Faster transition
          className="text-center mt-8 md:mt-16"
        >
          <div
            className="inline-block p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/30 shadow-lg md:shadow-xl"
            style={{
              background: isMobile 
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(255, 255, 255, 0.1)",
              backdropFilter: isMobile ? "none" : "blur(15px)",
              WebkitBackdropFilter: isMobile ? "none" : "blur(15px)",
            }}
          >
            <div className="flex items-center justify-center gap-2 text-gray-300 text-sm md:text-base">
              <Trophy className="w-4 md:w-5 h-4 md:h-5" />
              <span>
              Made with ❤️ by{" "}
              <a
                href="https://pranavpawar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c77dff] hover:text-[#e4c6ff] transition-colors"
              >
                Pranav
              </a>
            </span>
            <a
              href="https://github.com/Pranav2442"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c77dff] hover:text-[#e4c6ff] transition-colors"
            >
              <Github size={14} />
            </a>
              <Trophy className="w-4 md:w-5 h-4 md:h-5" />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isLoading && selectedGame && (
          <LoadingScreen
            gameName={selectedGame.title}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      {/* Mobile Warning Modal for KrashKarts */}
      <AnimatePresence>
        {showMobileWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} // Faster transition
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }} // Faster transition
              className="text-center bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 p-6 md:p-8 rounded-xl border-2 border-red-500 shadow-2xl max-w-md w-full mx-4"
            >
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Device Not Supported</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-white mb-4 leading-relaxed">
                  <strong className="text-amber-400">KrashKarts</strong> requires a larger screen for optimal gameplay experience.
                </p>
                <p className="text-gray-300 text-sm">
                  Please play this game on a <strong>desktop</strong> or <strong>tablet</strong> device for the best racing experience! 🏎️
                </p>
              </div>
              
              <button
                onClick={() => setShowMobileWarning(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 shadow-lg"
              >
                Got it! 👍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GameHub;