import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  ArrowLeft,
  Home,
  Loader2,
  Cpu,
  Zap,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

const AtomsSurge = lazy(() => import("../games/AtomsSurge"));
const ColorChainPro = lazy(() => import("../games/ColorChainPro"));
const KrashKarts = lazy(() => import("../games/KrashKarts"));

const gameComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  "atoms-surge": AtomsSurge,
  "color-chain": ColorChainPro,
  "krash-karts": KrashKarts,
};

const gameNames: Record<string, string> = {
  "atoms-surge": "Atoms Surge",
  "color-chain": "Color Chain Pro",
  "krash-karts": "KrashKarts",
};

// Simplified loading screen for game wrapper (no double loading)
const LoadingScreen: React.FC<{ gameName: string }> = ({ gameName }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const loadingSteps = useMemo(
    () => [
      {
        text: "Initializing game engine",
        icon: Cpu,
        color: "from-blue-500 to-purple-600",
      },
      {
        text: "Loading game assets",
        icon: Loader2,
        color: "from-purple-500 to-pink-600",
      },
      {
        text: "Optimizing performance",
        icon: Zap,
        color: "from-pink-500 to-yellow-600",
      },
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
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 800); // Faster cycling

    return () => clearInterval(timer);
  }, [loadingSteps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Minimal background effects for better performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i: number) => ( // Reduced from 15 to 6
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div
        className="relative text-center p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/30 shadow-xl md:shadow-2xl max-w-sm md:max-w-md w-full mx-4 z-10"
        style={{
          background: isMobile 
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.08)",
          backdropFilter: isMobile ? "none" : "blur(20px)",
          WebkitBackdropFilter: isMobile ? "none" : "blur(20px)",
          boxShadow: isMobile 
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            : "0 20px 40px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <motion.div
          animate={isMobile ? {
            scale: [1, 1.1, 1], // Simplified animation for mobile
          } : {
            rotate: 360,
            scale: [1, 1.15, 1],
          }}
          transition={isMobile ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          } : {
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-lg border border-white/30"
          style={{
            backdropFilter: isMobile ? "none" : "blur(8px)",
            WebkitBackdropFilter: isMobile ? "none" : "blur(8px)",
          }}
        >
          <Gamepad2 className="w-8 md:w-10 h-8 md:h-10 text-white" />

          {!isMobile && (
            <motion.div
              className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-purple-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </motion.div>

        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg"
          style={{
            background: "linear-gradient(45deg, #a855f7, #ec4899, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Loading {gameName}
        </motion.h2>

        <p className="text-gray-200 mb-4 md:mb-6 text-sm md:text-base">
          Preparing your gaming experience...
        </p>

        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={step.text}
              initial={{ opacity: 0.3, x: -5 }} // Reduced animation distance
              animate={{
                opacity: index === currentStep ? 1 : 0.3,
                x: index === currentStep ? 0 : -5,
                scale: index === currentStep ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }} // Faster transition
              className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-200"
            >
              <motion.div
                animate={
                  index === currentStep && !isMobile
                    ? {
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }
                    : index === currentStep && isMobile
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                }}
                className={`p-1.5 md:p-2 rounded-md md:rounded-lg bg-gradient-to-br ${step.color} border border-white/30`}
                style={{
                  backdropFilter: isMobile ? "none" : "blur(8px)",
                  WebkitBackdropFilter: isMobile ? "none" : "blur(8px)",
                }}
              >
                <step.icon className="w-3 md:w-4 h-3 md:h-4 text-white" />
              </motion.div>
              <span className={index === currentStep ? "font-semibold" : ""}>
                {step.text}...
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
          <Cpu className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />
          <span className="text-purple-400 font-semibold text-sm md:text-base">
            Get ready to play!
          </span>
          <Zap className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />
        </div>

        <div className="flex justify-center space-x-1.5 md:space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 md:w-2 h-1.5 md:h-2 bg-purple-400 rounded-full"
              animate={isMobile ? {
                opacity: [0.5, 1, 0.5],
              } : {
                scale: [1, 1.4, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const BackToHubLoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 3; // Faster progress
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

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
      {/* Reduced background effects for better performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => ( // Reduced from 20 to 8
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
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

      <div
        className="relative text-center p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/30 shadow-xl md:shadow-2xl max-w-sm md:max-w-lg w-full mx-4 z-10"
        style={{
          background: isMobile 
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.08)",
          backdropFilter: isMobile ? "none" : "blur(20px)",
          WebkitBackdropFilter: isMobile ? "none" : "blur(20px)",
          boxShadow: isMobile 
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            : "0 20px 40px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <motion.div
          animate={isMobile ? {
            scale: [1, 1.1, 1], // Simplified animation for mobile
          } : {
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={isMobile ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          } : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-16 md:w-24 h-16 md:h-24 mx-auto mb-6 md:mb-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border border-white/30"
          style={{
            backdropFilter: isMobile ? "none" : "blur(8px)",
            WebkitBackdropFilter: isMobile ? "none" : "blur(8px)",
          }}
        >
          <Home className="w-8 md:w-12 h-8 md:h-12 text-white" />

          {/* Simplified orbiting elements for desktop only */}
          {!isMobile &&
            [Star, Sparkles, Target].map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute w-4 h-4 text-white/70"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 0",
                }}
                animate={{
                  rotate: 360,
                  x: Math.cos((index * 120 * Math.PI) / 180) * 30,
                  y: Math.sin((index * 120 * Math.PI) / 180) * 30,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.5,
                }}
              >
                <Icon className="w-3 h-3" />
              </motion.div>
            ))}
        </motion.div>

        <motion.h2
          className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg"
          style={{
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: isMobile ? "none" : "drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))",
          }}
        >
          Returning to Hub
        </motion.h2>

        <p className="text-gray-200 mb-6 md:mb-8 text-sm md:text-lg">
          Taking you back to the game selection...
        </p>

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
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                boxShadow: isMobile ? "none" : "0 0 15px rgba(59, 130, 246, 0.6)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }} // Faster transition
            />

            {/* Simplified shimmer for desktop only */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-60, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ width: "60px" }}
              />
            )}
          </div>
        </div>

        <motion.div className="text-white font-mono text-lg md:text-xl font-bold mb-4 md:mb-6">
          {Math.round(progress)}%
        </motion.div>

        <div className="flex justify-center space-x-2 md:space-x-3 mb-4 md:mb-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 md:w-3 h-2 md:h-3 rounded-full"
              style={{
                background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                boxShadow: isMobile ? "none" : "0 0 8px rgba(59, 130, 246, 0.6)",
              }}
              animate={isMobile ? {
                opacity: [0.4, 1, 0.4],
              } : {
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1, // Reduced delay
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }} // Reduced delay
          className="text-gray-300 text-xs md:text-sm"
        >
          <motion.p
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏠 Navigating back to Game Hub...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const GameWrapper: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [isReturningToHub, setIsReturningToHub] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (gameId === "krash-karts" && isMobile) {
      alert("⚠️ KrashKarts requires a larger screen. Redirecting to game hub...");
      window.location.href = "/";
    }
  }, [gameId, isMobile]);

  const handleBackToHub = useCallback(() => {
    setIsReturningToHub(true);

    setTimeout(() => {
      window.close();

      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }, 1000); // Reduced from 1500ms
  }, []);

  if (!gameId || !gameComponents[gameId]) {
    return <Navigate to="/" replace />;
  }

  const GameComponent = gameComponents[gameId];
  const gameName = gameNames[gameId];

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <motion.button
        initial={{ opacity: 0, x: -20 }} // Reduced animation distance
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }} // Faster transition
        onClick={handleBackToHub}
        className="fixed top-2 md:top-4 left-2 md:left-4 z-50 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30 text-sm md:text-base"
        style={{
          background: isMobile 
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.15)",
          backdropFilter: isMobile ? "none" : "blur(15px)",
          WebkitBackdropFilter: isMobile ? "none" : "blur(15px)",
        }}
        whileHover={
          !isMobile
            ? {
                scale: 1.05,
                background: "rgba(255, 255, 255, 0.2)",
              }
            : {}
        }
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
        <span className="hidden sm:inline">Back to Hub</span>
      </motion.button>

      <Suspense fallback={<LoadingScreen gameName={gameName} />}>
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }} // Faster transition
          className="w-full h-full"
        >
          <GameComponent />
        </motion.div>
      </Suspense>

      <AnimatePresence>
        {isReturningToHub && <BackToHubLoadingScreen />}
      </AnimatePresence>
    </div>
  );
};

export default GameWrapper;