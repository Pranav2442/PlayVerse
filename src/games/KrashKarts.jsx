import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Shield, Rocket, RotateCcw, Trophy, Target, Crosshair, ArrowUp, ArrowLeft, ArrowRight, Space, MousePointerClick, Swords, Users, MessageSquare, Signal, RadioTower } from 'lucide-react';
import logo from "/logo.png"

const KART_SIZE = 20;
const MAX_SPEED = 5;
const ACCELERATION = 0.4;
const FRICTION = 0.94;
const TURN_SPEED = 0.15;
const EMP_DURATION = 1500;
const EMP_RADIUS_FACTOR = 0.4;

const path2DCache = new Map();
const getPath2D = (d) => {
  if (typeof Path2D === 'undefined') {
    console.warn("Path2D API not available.");
    return { fill: () => {}, stroke: () => {} };
  }
  if (!path2DCache.has(d)) {
    path2DCache.set(d, new Path2D(d));
  }
  return path2DCache.get(d);
};

const POWERUP_TYPES = {
  SPEED: {
    icon: Zap, color: '#ffff00', duration: 4000, name: 'SPEED',
    path: "M13 2 L3 14 L9 14 L8 22 L18 10 L12 10 L13 2 Z"
  },
  SHIELD: {
    icon: Shield, color: '#00ffff', duration: 6000, name: 'SHIELD',
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  },
  MISSILE: {
    icon: Rocket, color: '#ff4444', duration: 8000, name: 'MISSILE',
    path: "M12 2 L15.5 8 L15 17 L18 20 L12 18 L6 20 L9 17 L8.5 8 L12 2 Z",
  },
  EMP: {
    icon: Signal, color: '#aa00ff', duration: 3000, name: 'EMP',
    path: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M10.6 13.4c-.9-.9-.9-2.3 0-3.2M13.4 10.6c.9.9.9 2.3 0 3.2M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19"
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const SmashKarts = () => {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const keysRef = useRef({});
  const firstInitializationDoneRef = useRef(false);

  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 450 });
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionCountdown, setInstructionCountdown] = useState(10);


  const [gameState, setGameState] = useState({
    players: [],
    powerups: [],
    missiles: [],
    particles: [],
    score: { player: 0, ai1: 0, ai2: 0, ai3: 0 },
    gameTime: 180,
    gameActive: false,
    screenShake: { intensity: 0, duration: 0, maxDuration: 0 },
    announcements: [],
  });

  const triggerScreenShake = useCallback((intensity, duration) => {
    setGameState(prev => ({
      ...prev,
      screenShake: { intensity, duration, maxDuration: duration }
    }));
  }, []);


  const addAnnouncement = useCallback((text, x, y, life = 120, color = '#ffffff', size = 16) => {
    setGameState(prev => ({
      ...prev,
      announcements: [...prev.announcements, { id: Math.random(), text, x, y, life, maxLife: life, color, size }]
    }));
  }, []);


  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current || !canvasRef.current.parentElement) return;

    const parentContainer = canvasRef.current.parentElement;
    let newWidth = parentContainer.clientWidth;

    let newHeight = (newWidth / 16) * 9;

    const maxCanvasHeight = window.innerHeight * 0.75;
    if (newHeight > maxCanvasHeight) {
        newHeight = maxCanvasHeight;
        newWidth = (newHeight / 9) * 16;
    }

    if (newWidth > parentContainer.clientWidth) {
        newWidth = parentContainer.clientWidth;
        newHeight = (newWidth / 16) * 9;
    }

    if (newWidth < 300) newWidth = 300;
    const minHeightBasedOnMinWidth = (300/16)*9;
    if (newHeight < minHeightBasedOnMinWidth && newWidth === 300) newHeight = minHeightBasedOnMinWidth;


    setCanvasDimensions({ width: Math.round(newWidth), height: Math.round(newHeight) });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(resizeCanvas, 0);
    window.addEventListener('resize', resizeCanvas);
    return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);


  const initializeGame = useCallback((startGameImmediately = false) => {
    const { width, height } = canvasDimensions;
    const players = [
      {
        id: 'player',
        x: width * 0.1, y: height * 0.1,
        vx: 0, vy: 0, angle: 0, color: '#ff3333', name: 'YOU', isPlayer: true,
        health: 100, maxHealth: 100, powerup: null, powerupEndTime: 0, stunned: 0, lastHitTime: 0, kills: 0,
        killStreak: 0, lastKillTimestamp: 0, respawnInvincibility: 0
      },
      {
        id: 'ai1',
        x: width * 0.9, y: height * 0.1,
        vx: 0, vy: 0, angle: Math.PI, color: '#3333ff', name: 'SPEEDY', isPlayer: false,
        health: 100, maxHealth: 100, powerup: null, powerupEndTime: 0, stunned: 0, lastHitTime: 0, kills: 0,
        aiPersonality: 'aggressive', target: null, lastTargetChange: 0, avoidanceDirection: 0,
        killStreak: 0, lastKillTimestamp: 0, respawnInvincibility: 0
      },
      {
        id: 'ai2',
        x: width * 0.9, y: height * 0.9,
        vx: 0, vy: 0, angle: Math.PI, color: '#33ff33', name: 'HUNTER', isPlayer: false,
        health: 100, maxHealth: 100, powerup: null, powerupEndTime: 0, stunned: 0, lastHitTime: 0, kills: 0,
        aiPersonality: 'strategic', target: null, lastTargetChange: 0, avoidanceDirection: 0,
        killStreak: 0, lastKillTimestamp: 0, respawnInvincibility: 0
      },
      {
        id: 'ai3',
        x: width * 0.1, y: height * 0.9,
        vx: 0, vy: 0, angle: 0, color: '#ff33ff', name: 'BLITZ', isPlayer: false,
        health: 100, maxHealth: 100, powerup: null, powerupEndTime: 0, stunned: 0, lastHitTime: 0, kills: 0,
        aiPersonality: 'hunter', target: null, lastTargetChange: 0, avoidanceDirection: 0,
        killStreak: 0, lastKillTimestamp: 0, respawnInvincibility: 0
      }
    ];

    setGameState(prev => ({
      ...prev,
      players,
      powerups: [], missiles: [], particles: [], announcements: [],
      score: { player: 0, ai1: 0, ai2: 0, ai3: 0 },
      gameTime: 180,
      gameActive: startGameImmediately,
      screenShake: { intensity: 0, duration: 0, maxDuration: 0 }
    }));

    if (!startGameImmediately) {
      setShowInstructions(true);
      setInstructionCountdown(10);
    }
  }, [canvasDimensions]);

  useEffect(() => {
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0) {
      if (!firstInitializationDoneRef.current) {
        initializeGame();
        firstInitializationDoneRef.current = true;
      }
    }
  }, [canvasDimensions, initializeGame]);


  const spawnPowerup = useCallback(() => {
    const { width, height } = canvasDimensions;
    const types = Object.keys(POWERUP_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const padding = Math.min(width * 0.1, height * 0.1, 50);

    return {
      id: Math.random().toString(36),
      x: padding + Math.random() * (width - 2 * padding),
      y: padding + Math.random() * (height - 2 * padding),
      type,
      spawnTime: Date.now(),
      pulsePhase: Math.random() * Math.PI * 2
    };
  }, [canvasDimensions]);

  const createMissile = useCallback((player, targetX, targetY) => {
    const angle = Math.atan2(targetY - player.y, targetX - player.x);
    return {
      id: Math.random().toString(36),
      x: player.x + Math.cos(angle) * (KART_SIZE / 2 + 5),
      y: player.y + Math.sin(angle) * (KART_SIZE / 2 + 5),
      vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
      ownerId: player.id, life: 120, angle: angle
    };
  }, []);

  const createParticle = useCallback((x, y, color, count = 5, speed = 1, life = 30, size = 3, shape = 'random') => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 8 * speed * (Math.random() * 0.5 + 0.5),
        vy: (Math.random() - 0.5) * 8 * speed * (Math.random() * 0.5 + 0.5),
        life: life + Math.random() * (life * 0.5), maxLife: life + Math.random() * (life * 0.5),
        color, size: size + Math.random() * (size/2),
        shape: shape === 'random' ? (Math.random() > 0.3 ? 'square' : 'circle') : shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }
    return particles;
  }, []);

  const updateAI = useCallback((ai, allPlayers, powerups, currentTime) => {
    const { width: currentCanvasWidth, height: currentCanvasHeight } = canvasDimensions;
    if (ai.stunned > currentTime || ai.health <= 0) return { forward: false, left: false, right: false, shoot: false };

    const playerTarget = allPlayers.find(p => p.isPlayer && p.health > 0);
    let targetX = ai.x, targetY = ai.y;
    let shouldAccelerate = false;
    let shouldShoot = false;

    const margin = Math.min(60, currentCanvasWidth * 0.1);
    let avoidingBoundary = false;

    if (ai.x < margin) { targetX = ai.x + 100; targetY = ai.y; shouldAccelerate = true; avoidingBoundary = true; }
    else if (ai.x > currentCanvasWidth - margin) { targetX = ai.x - 100; targetY = ai.y; shouldAccelerate = true; avoidingBoundary = true; }
    else if (ai.y < margin) { targetX = ai.x; targetY = ai.y + 100; shouldAccelerate = true; avoidingBoundary = true; }
    else if (ai.y > currentCanvasHeight - margin) { targetX = ai.x; targetY = ai.y - 100; shouldAccelerate = true; avoidingBoundary = true; }

    if (!avoidingBoundary && playerTarget) {
      switch (ai.aiPersonality) {
        case 'aggressive':
          targetX = playerTarget.x; targetY = playerTarget.y; shouldAccelerate = true;
          const distToPlayerAgg = Math.hypot(playerTarget.x - ai.x, playerTarget.y - ai.y);
          if ((ai.powerup === 'MISSILE' || ai.powerup === 'EMP') && distToPlayerAgg < currentCanvasWidth * 0.35 && distToPlayerAgg > 50) { shouldShoot = true; }
          break;
        case 'strategic':
          const nearbyPowerup = powerups.sort((a,b) => Math.hypot(a.x - ai.x, a.y - ai.y) - Math.hypot(b.x - ai.x, b.y - ai.y))
                                    .find(p => Math.hypot(p.x - ai.x, p.y - ai.y) < currentCanvasWidth * 0.25);
          if (nearbyPowerup && !ai.powerup && POWERUP_TYPES[nearbyPowerup.type]) { targetX = nearbyPowerup.x; targetY = nearbyPowerup.y; shouldAccelerate = true; }
          else {
            targetX = playerTarget.x + playerTarget.vx * 10; targetY = playerTarget.y + playerTarget.vy * 10; shouldAccelerate = true;
            const distToPlayerStrat = Math.hypot(playerTarget.x - ai.x, playerTarget.y - ai.y);
            if ((ai.powerup === 'MISSILE' || ai.powerup === 'EMP') && distToPlayerStrat < currentCanvasWidth * 0.4) { shouldShoot = true; }
          }
          break;
        case 'hunter':
          const timeToIntercept = Math.hypot(playerTarget.x - ai.x, playerTarget.y - ai.y) / (MAX_SPEED * 1.2);
          targetX = playerTarget.x + playerTarget.vx * timeToIntercept; targetY = playerTarget.y + playerTarget.vy * timeToIntercept; shouldAccelerate = true;
          const distToPlayerHunt = Math.hypot(playerTarget.x - ai.x, playerTarget.y - ai.y);
          if ((ai.powerup === 'MISSILE' || ai.powerup === 'EMP') && distToPlayerHunt < currentCanvasWidth * 0.45) { shouldShoot = true; }
          break;
        default:
          targetX = playerTarget.x; targetY = playerTarget.y; shouldAccelerate = true;
          break;
      }
    } else if (!playerTarget || playerTarget.health <= 0) {
        const anyPowerup = powerups.find(p => Math.hypot(p.x - ai.x, p.y - ai.y) < currentCanvasWidth * 0.3 && !ai.powerup && POWERUP_TYPES[p.type]);
        if(anyPowerup) {
            targetX = anyPowerup.x; targetY = anyPowerup.y; shouldAccelerate = true;
        } else {
            if(Date.now() - ai.lastTargetChange > 3000 || Math.hypot(targetX - ai.x, targetY - ai.y) < 50) {
                targetX = Math.random() * currentCanvasWidth;
                targetY = Math.random() * currentCanvasHeight;
                ai.lastTargetChange = Date.now();
            }
            shouldAccelerate = true;
        }
    }


    const dx = targetX - ai.x; const dy = targetY - ai.y;
    const targetAngle = Math.atan2(dy, dx);
    let angleDiff = targetAngle - ai.angle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    allPlayers.forEach(otherPlayer => {
        if (otherPlayer.id !== ai.id && otherPlayer.health > 0) {
            const distToOther = Math.hypot(otherPlayer.x - ai.x, otherPlayer.y - ai.y);
            if (distToOther < KART_SIZE * 3) {
                const angleToOther = Math.atan2(otherPlayer.y - ai.y, otherPlayer.x - ai.x);
                let avoidAngleDiff = angleToOther - ai.angle;
                while (avoidAngleDiff > Math.PI) avoidAngleDiff -= 2 * Math.PI;
                while (avoidAngleDiff < -Math.PI) avoidAngleDiff += 2 * Math.PI;

                if (Math.abs(avoidAngleDiff) < Math.PI / 4) {
                   if(angleDiff * avoidAngleDiff < 0){

                   } else {
                       if(avoidAngleDiff > 0) angleDiff = Math.max(angleDiff, 0.2);
                       else angleDiff = Math.min(angleDiff, -0.2);
                   }
                }
            }
        }
    });


    return { forward: shouldAccelerate, left: angleDiff < -0.05, right: angleDiff > 0.05, shoot: shouldShoot };
  }, [canvasDimensions]);

  const checkCollisions = useCallback((currentPlayers, currentMissiles, currentTime) => {
    const { width: currentCanvasWidth, height: currentCanvasHeight } = canvasDimensions;
    let players = currentPlayers.map(p => ({...p}));
    let missiles = [...currentMissiles];
    const newParticles = [];
    let scoreUpdates = {};
    let newAnnouncementsCollection = [];

    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const p1 = players[i]; const p2 = players[j];
        if (p1.health <= 0 || p2.health <= 0 || p1.respawnInvincibility > currentTime || p2.respawnInvincibility > currentTime) continue;

        const dx = p2.x - p1.x; const dy = p2.y - p1.y;
        const distance = Math.hypot(dx, dy);

        if (distance < KART_SIZE * 0.9) {
          const speed1 = Math.hypot(p1.vx, p1.vy); const speed2 = Math.hypot(p2.vx, p2.vy);
          const totalSpeed = speed1 + speed2;

          if (totalSpeed > 1.5 && currentTime - Math.max(p1.lastHitTime, p2.lastHitTime) > 300) {
            const damage = Math.floor(totalSpeed * 2.5 + 3);
            if (p1.powerup !== 'SHIELD') {
                p1.health = Math.max(0, p1.health - damage); p1.lastHitTime = currentTime; p1.stunned = currentTime + 200;
            }
            if (p2.powerup !== 'SHIELD') {
                p2.health = Math.max(0, p2.health - damage); p2.lastHitTime = currentTime; p2.stunned = currentTime + 200;
            }

            const overlap = KART_SIZE - distance + 1;
            const separateX = (dx / distance) * overlap * 0.5; const separateY = (dy / distance) * overlap * 0.5;
            p1.x -= separateX; p1.y -= separateY; p2.x += separateX; p2.y += separateY;
            const angle = Math.atan2(dy, dx); const bounceForce = Math.max(1.5, totalSpeed * 0.25);
            p1.vx -= Math.cos(angle) * bounceForce; p1.vy -= Math.sin(angle) * bounceForce;
            p2.vx += Math.cos(angle) * bounceForce; p2.vy += Math.sin(angle) * bounceForce;

            newParticles.push(...createParticle((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, '#cccccc', 12, 1.8, 20, 2, 'square'));
            triggerScreenShake(3, 15);
          }

          if (p1.health <= 0 && p1.health !== -100) {
            p1.health = -100;
            p2.kills++; scoreUpdates[p2.id] = (scoreUpdates[p2.id] || 0) + 1;
            newParticles.push(...createParticle(p1.x, p1.y, p1.color, 30, 2.5, 40, 4));
            p1.killStreak = 0;
            p2.lastKillTimestamp = currentTime;
            p2.killStreak++;
            if (p2.killStreak >= 2) {
                 newAnnouncementsCollection.push({ text: `STREAK x${p2.killStreak}!`, x: p2.x, y: p2.y - KART_SIZE - 25, life: 90, color: p2.color, size: 14 });
            }
          }
          if (p2.health <= 0 && p2.health !== -100) {
            p2.health = -100;
            p1.kills++; scoreUpdates[p1.id] = (scoreUpdates[p1.id] || 0) + 1;
            newParticles.push(...createParticle(p2.x, p2.y, p2.color, 30, 2.5, 40, 4));
            p2.killStreak = 0;
            p1.lastKillTimestamp = currentTime;
            p1.killStreak++;
            if (p1.killStreak >= 2) {
                 newAnnouncementsCollection.push({ text: `STREAK x${p1.killStreak}!`, x: p1.x, y: p1.y - KART_SIZE - 25, life: 90, color: p1.color, size: 14 });
            }
          }
        }
      }
    }

    for (let i = missiles.length - 1; i >= 0; i--) {
      const missile = missiles[i];
      let hit = false;
      for (const player of players) {
        if (player.id === missile.ownerId || player.health <= 0 || player.respawnInvincibility > currentTime) continue;
        const dx = player.x - missile.x; const dy = player.y - missile.y;
        const distance = Math.hypot(dx, dy);
        if (distance < KART_SIZE * 0.8) {
          if (player.powerup !== 'SHIELD') {
            player.health = Math.max(0, player.health - 30);
            player.lastHitTime = currentTime; player.stunned = currentTime + 600;
            const knockback = 4.5; player.vx += Math.cos(missile.angle) * knockback; player.vy += Math.sin(missile.angle) * knockback;
          }
          newParticles.push(...createParticle(missile.x, missile.y, '#ff6600', 20, 2.5, 35, 3));
          triggerScreenShake(5, 20);
          if (player.health <= 0 && player.health !== -100) {
            player.health = -100;
            const shooter = players.find(p => p.id === missile.ownerId);
            if (shooter) {
                shooter.kills++; scoreUpdates[missile.ownerId] = (scoreUpdates[missile.ownerId] || 0) + 1;
                player.killStreak = 0;
                shooter.lastKillTimestamp = currentTime;
                shooter.killStreak++;
                 if (shooter.killStreak >= 2) {
                    newAnnouncementsCollection.push({ text: `STREAK x${shooter.killStreak}!`, x: shooter.x, y: shooter.y - KART_SIZE - 25, life: 90, color: shooter.color, size: 14 });
                 }
            }
            newParticles.push(...createParticle(player.x, player.y, player.color, 35, 3, 45, 4.5));
          }
          hit = true; break;
        }
      }
      if (hit || missile.life <= 0 || missile.x < -10 || missile.x > currentCanvasWidth + 10 || missile.y < -10 || missile.y > currentCanvasHeight + 10) {
        if (!hit && missile.life > 0) {
            newParticles.push(...createParticle(missile.x, missile.y, '#aaaaaa', 5, 1, 20, 2));
        }
        missiles.splice(i, 1);
      }
    }
    return { updatedPlayers: players, updatedMissiles: missiles, particles: newParticles, scoreUpdates, newAnnouncements: newAnnouncementsCollection };
  }, [createParticle, canvasDimensions, triggerScreenShake]);

  const gameLoop = useCallback(() => {
    const { width: currentCanvasWidth, height: currentCanvasHeight } = canvasDimensions;

    setGameState(prevState => {
      if (!prevState.gameActive) return prevState;

      const currentTime = Date.now();
      let newPlayers = [...prevState.players];
      let newMissiles = [...prevState.missiles];
      let newPowerups = [...prevState.powerups];
      let newParticles = [...prevState.particles];
      let newAnnouncements = [...prevState.announcements];
      let newScore = {...prevState.score};

      let gameTimeValue = Math.max(0, prevState.gameTime - 1/60);
      if (gameTimeValue <= 0) return { ...prevState, gameActive: false, gameTime: gameTimeValue };

      let newScreenShake = { ...prevState.screenShake };
      if (newScreenShake.duration > 0) {
        newScreenShake.duration -= 16.67;
      } else {
        newScreenShake.intensity = 0;
      }

      let shotMissilesThisFrame = [];
      let empActivatedThisFrame = null;

      newPlayers = newPlayers.map(player => {
        let newPlayer = { ...player };
        if (newPlayer.powerup && currentTime > newPlayer.powerupEndTime) newPlayer.powerup = null;
        if (newPlayer.respawnInvincibility > 0 && currentTime > newPlayer.respawnInvincibility) newPlayer.respawnInvincibility = 0;

        if (newPlayer.killStreak > 0 && currentTime - newPlayer.lastKillTimestamp > 5000) {
            newPlayer.killStreak = 0;
        }


        if (newPlayer.health <= 0) {
          if (currentTime - newPlayer.lastHitTime > 3000) {
            newPlayer.health = newPlayer.maxHealth;
            newPlayer.x = (0.1 + Math.random() * 0.8) * currentCanvasWidth;
            newPlayer.y = (0.1 + Math.random() * 0.8) * currentCanvasHeight;
            newPlayer.vx = 0; newPlayer.vy = 0; newPlayer.stunned = 0; newPlayer.powerup = null;
            newPlayer.respawnInvincibility = currentTime + 1500;
            newPlayer.killStreak = 0;
          }
          return newPlayer;
        }

        let controls = newPlayer.isPlayer ? {
            forward: keysRef.current['ArrowUp'] || keysRef.current['KeyW'],
            left: keysRef.current['ArrowLeft'] || keysRef.current['KeyA'],
            right: keysRef.current['ArrowRight'] || keysRef.current['KeyD'],
            shoot: keysRef.current['Space']
          } : updateAI(newPlayer, prevState.players, prevState.powerups, currentTime);

        if (newPlayer.stunned < currentTime) {
          if (controls.forward) {
            const speedMultiplier = newPlayer.powerup === 'SPEED' ? 1.8 : 1;
            newPlayer.vx += Math.cos(newPlayer.angle) * ACCELERATION * speedMultiplier;
            newPlayer.vy += Math.sin(newPlayer.angle) * ACCELERATION * speedMultiplier;
          }
          if (controls.left) newPlayer.angle -= TURN_SPEED;
          if (controls.right) newPlayer.angle += TURN_SPEED;

          if (controls.shoot && newPlayer.powerup) {
            if (newPlayer.powerup === 'MISSILE') {
              let target;
              const potentialTargets = prevState.players.filter(p => p.id !== newPlayer.id && p.health > 0);
              if (potentialTargets.length > 0) {
                target = newPlayer.isPlayer
                    ? potentialTargets.sort((a, b) =>
                        Math.hypot(a.x - newPlayer.x, a.y - newPlayer.y) -
                        Math.hypot(b.x - newPlayer.x, b.y - newPlayer.y)
                      )[0]
                    : potentialTargets.find(p => p.isPlayer);

                 if (!target && !newPlayer.isPlayer) {
                     target = potentialTargets.sort((a, b) =>
                        Math.hypot(a.x - newPlayer.x, a.y - newPlayer.y) -
                        Math.hypot(b.x - newPlayer.x, b.y - newPlayer.y)
                      )[0];
                 }
              }
              if (target) {
                shotMissilesThisFrame.push(createMissile(newPlayer, target.x, target.y));
                newParticles.push(...createParticle(newPlayer.x + Math.cos(newPlayer.angle) * KART_SIZE * 0.6, newPlayer.y + Math.sin(newPlayer.angle) * KART_SIZE * 0.6, '#ffffff', 5, 1, 15, 2));
                newPlayer.powerup = null;
              }
            } else if (newPlayer.powerup === 'EMP') {
              empActivatedThisFrame = { owner: newPlayer };
              newPlayer.powerup = null;
            }
          }
        }

        const speed = Math.hypot(newPlayer.vx, newPlayer.vy);
        const maxSpeedCurrent = newPlayer.powerup === 'SPEED' ? MAX_SPEED * 1.7 : MAX_SPEED;
        if (speed > maxSpeedCurrent) { newPlayer.vx *= maxSpeedCurrent / speed; newPlayer.vy *= maxSpeedCurrent / speed; }
        newPlayer.vx *= FRICTION; newPlayer.vy *= FRICTION;
        newPlayer.x += newPlayer.vx; newPlayer.y += newPlayer.vy;

        if (speed > 1.5 && newPlayer.health > 0 && newPlayer.stunned < currentTime) {
            const trailChance = (Math.abs(newPlayer.vx * Math.sin(newPlayer.angle) - newPlayer.vy * Math.cos(newPlayer.angle)) > 1 || newPlayer.powerup === 'SPEED') ? 0.8 : 0.3;
            if (Math.random() < trailChance) {
                 const wheelOffsetX = KART_SIZE * 0.4;
                 const wheelOffsetY = KART_SIZE * 0.45;
                 const trailColor = 'rgba(80, 80, 80, 0.3)';

                 newParticles.push({
                    x: newPlayer.x - Math.sin(newPlayer.angle) * wheelOffsetY - Math.cos(newPlayer.angle) * wheelOffsetX,
                    y: newPlayer.y + Math.cos(newPlayer.angle) * wheelOffsetY - Math.sin(newPlayer.angle) * wheelOffsetX,
                    vx: 0, vy: 0, life: 25, maxLife: 25, color: trailColor, size: 3 + Math.random() * 2, shape: 'square', rotation: newPlayer.angle
                 });
                 newParticles.push({
                    x: newPlayer.x + Math.sin(newPlayer.angle) * wheelOffsetY - Math.cos(newPlayer.angle) * wheelOffsetX,
                    y: newPlayer.y - Math.cos(newPlayer.angle) * wheelOffsetY - Math.sin(newPlayer.angle) * wheelOffsetX,
                    vx: 0, vy: 0, life: 25, maxLife: 25, color: trailColor, size: 3 + Math.random() * 2, shape: 'square', rotation: newPlayer.angle
                 });
            }
        }


        const bounce = 0.5;
        if (newPlayer.x < KART_SIZE/2) { newPlayer.x = KART_SIZE/2; newPlayer.vx = Math.abs(newPlayer.vx) * bounce; }
        if (newPlayer.x > currentCanvasWidth - KART_SIZE/2) { newPlayer.x = currentCanvasWidth - KART_SIZE/2; newPlayer.vx = -Math.abs(newPlayer.vx) * bounce; }
        if (newPlayer.y < KART_SIZE/2) { newPlayer.y = KART_SIZE/2; newPlayer.vy = Math.abs(newPlayer.vy) * bounce; }
        if (newPlayer.y > currentCanvasHeight - KART_SIZE/2) { newPlayer.y = currentCanvasHeight - KART_SIZE/2; newPlayer.vy = -Math.abs(newPlayer.vy) * bounce; }

        return newPlayer;
      });

      if (empActivatedThisFrame) {
        const empOwner = empActivatedThisFrame.owner;
        newParticles.push(...createParticle(empOwner.x, empOwner.y, POWERUP_TYPES.EMP.color, 50, 5, 60, 8, 'circle'));
        triggerScreenShake(10, 30);
        newPlayers = newPlayers.map(p => {
          if (p.id !== empOwner.id && p.health > 0) {
            const distToEmp = Math.hypot(p.x - empOwner.x, p.y - empOwner.y);
            if (distToEmp < currentCanvasWidth * EMP_RADIUS_FACTOR) {
              if(p.powerup !== 'SHIELD') {
                p.stunned = currentTime + EMP_DURATION;
                newParticles.push(...createParticle(p.x, p.y, POWERUP_TYPES.EMP.color, 10, 2, 30, 3));
              }
            }
          }
          return p;
        });
      }


      newMissiles = newMissiles.map(missile => ({
        ...missile, x: missile.x + missile.vx, y: missile.y + missile.vy, life: missile.life - 1
      })).filter(missile => missile.life > 0 &&
                           missile.x >= -10 && missile.x <= currentCanvasWidth + 10 &&
                           missile.y >= -10 && missile.y <= currentCanvasHeight + 10);
      newMissiles.push(...shotMissilesThisFrame);

      const collectedPowerupIdsThisFrame = new Set();
      let playersAfterCollectingPowerups = [...newPlayers];
      const powerupDespawnTime = 15000;

      prevState.powerups.forEach(powerupToCollect => {
          if (collectedPowerupIdsThisFrame.has(powerupToCollect.id) || (currentTime - powerupToCollect.spawnTime >= powerupDespawnTime)) return;
          for (let i = 0; i < playersAfterCollectingPowerups.length; i++) {
              const player = playersAfterCollectingPowerups[i];
              if (player.health > 0 && !player.powerup && player.stunned < currentTime && Math.hypot(player.x - powerupToCollect.x, player.y - powerupToCollect.y) < (KART_SIZE + 12)) {
                  playersAfterCollectingPowerups[i] = { ...player, powerup: powerupToCollect.type, powerupEndTime: currentTime + POWERUP_TYPES[powerupToCollect.type].duration };
                  collectedPowerupIdsThisFrame.add(powerupToCollect.id);
                  newParticles.push(...createParticle(powerupToCollect.x, powerupToCollect.y, POWERUP_TYPES[powerupToCollect.type].color, 20, 2, 30, 3.5));
                  break;
              }
          }
      });
      newPlayers = playersAfterCollectingPowerups;
      newPowerups = prevState.powerups.filter(p => !collectedPowerupIdsThisFrame.has(p.id) && (currentTime - p.spawnTime < powerupDespawnTime));

      if (Math.random() < 0.02 && newPowerups.length < 6) newPowerups.push(spawnPowerup());

      const collisionOutcome = checkCollisions(newPlayers, newMissiles, currentTime);
      newPlayers = collisionOutcome.updatedPlayers; newMissiles = collisionOutcome.updatedMissiles;
      newParticles.push(...collisionOutcome.particles);
      collisionOutcome.newAnnouncements.forEach(ann => newAnnouncements.push({ ...ann, id: Math.random()}));

      Object.keys(collisionOutcome.scoreUpdates).forEach(playerId => { newScore[playerId] = (newScore[playerId] || 0) + collisionOutcome.scoreUpdates[playerId]; });

      newParticles = newParticles.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.97, vy: p.vy * 0.97, life: p.life - 1, rotation: p.rotation + p.rotationSpeed })).filter(p => p.life > 0);
      newAnnouncements = newAnnouncements.map(a => ({...a, life: a.life -1, y: a.y - 0.3 })).filter(a => a.life > 0);


      return { ...prevState, players: newPlayers, missiles: newMissiles, powerups: newPowerups, particles: newParticles, score: newScore, gameTime: gameTimeValue, gameActive: gameTimeValue > 0, screenShake: newScreenShake, announcements: newAnnouncements };
    });
  }, [canvasDimensions, updateAI, checkCollisions, spawnPowerup, createParticle, createMissile, triggerScreenShake]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasDimensions;
    const currentTime = Date.now();

    let shakeX = 0;
    let shakeY = 0;
    if (gameState.screenShake.duration > 0 && gameState.screenShake.intensity > 0) {
        const shakeFactor = gameState.screenShake.intensity * (gameState.screenShake.duration / gameState.screenShake.maxDuration);
        shakeX = (Math.random() - 0.5) * shakeFactor * 2;
        shakeY = (Math.random() - 0.5) * shakeFactor * 2;
        ctx.save();
        ctx.translate(shakeX, shakeY);
    }


    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#10101f');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(60, 60, 90, 0.5)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    gameState.powerups.forEach((powerup, index) => {
      const powerupInfo = POWERUP_TYPES[powerup.type];
      if (!powerupInfo) return;

      const timeAlive = currentTime - powerup.spawnTime;
      const despawnTime = 15000;
      const nearingDespawn = timeAlive > despawnTime - 3000;
      if (nearingDespawn && Math.floor(currentTime / 200) % 2 === 0) {
          return;
      }


      const timeParam = currentTime * 0.006 + powerup.pulsePhase;

      const pulseValueAlpha = Math.sin(timeParam);
      const iconAlpha = 0.75 + (pulseValueAlpha * 0.25);

      const pulseValueSize = Math.sin(timeParam * 1.2 + Math.PI / 2);
      const iconScaleEffect = 1.0 + (pulseValueSize * 0.20);

      const glowValue = Math.sin(timeParam * 1.8 + index);
      const shadowBlurAmount = 10 + (glowValue * 8);

      ctx.save();
      ctx.translate(powerup.x, powerup.y);

      ctx.beginPath();
      ctx.arc(0, 0, 22 * iconScaleEffect, 0, Math.PI * 2);
      ctx.fillStyle = powerupInfo.color;
      ctx.globalAlpha = 0.25 * iconAlpha;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 25, 45, 0.85)';
      ctx.fill();
      ctx.strokeStyle = powerupInfo.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();


      const baseIconSize = 23;
      const currentIconSize = baseIconSize * iconScaleEffect;
      const scaleFactor = currentIconSize / 24.0;

      ctx.shadowColor = powerupInfo.color;
      ctx.shadowBlur = shadowBlurAmount;
      ctx.globalAlpha = iconAlpha;

      ctx.scale(scaleFactor, scaleFactor);
      ctx.translate(-12, -12);

      ctx.fillStyle = powerupInfo.color;

      if (powerupInfo.path) {
        const path2d = getPath2D(powerupInfo.path);
        ctx.fill(path2d);
      } else if (powerupInfo.icon) {

      }
      ctx.restore();
    });

    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      if (particle.shape === 'square') {
          ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
      } else {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    });

    gameState.missiles.forEach(missile => {
      ctx.save(); ctx.translate(missile.x, missile.y); ctx.rotate(missile.angle);

      ctx.fillStyle = '#ff5555';
      ctx.shadowColor = '#ff2222';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-9, -4.5);
      ctx.lineTo(-9, 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      const numFlames = 3 + Math.floor(Math.random() * 3);
      for(let i=0; i<numFlames; i++) {
          const flameSize = (Math.random() * 10 + 12) * (missile.life / 120 + 0.3) ;
          const flameOffset = (Math.random() -0.5) * 3;
          const flameColorStop = Math.random() * 0.3 + 0.6;
          const flameGradient = ctx.createLinearGradient(-9, flameOffset, -9 - flameSize, flameOffset);
          flameGradient.addColorStop(0, `rgba(255, ${150 + Math.random()*50}, 0, 0.9)`);
          flameGradient.addColorStop(flameColorStop, `rgba(255, ${50 + Math.random()*50}, 0, 0.5)`);
          flameGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = flameGradient;
          ctx.beginPath();
          ctx.moveTo(-9, flameOffset);
          ctx.lineTo(-9 - flameSize, flameOffset - flameSize / (3 + Math.random()*2) );
          ctx.lineTo(-9 - flameSize, flameOffset + flameSize / (3 + Math.random()*2) );
          ctx.closePath();
          ctx.fill();
      }
      ctx.restore();
    });

    gameState.players.forEach(player => {
      if (player.health <= 0) return;
      ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(player.angle);

      const isHit = player.lastHitTime > 0 && (currentTime - player.lastHitTime < 150);
      const isRespawning = player.respawnInvincibility > currentTime;

      if (player.powerup === 'SHIELD') {
        const shieldPulse = Math.sin(currentTime * 0.015) * 0.25 + 0.6;
        ctx.fillStyle = `rgba(0, 220, 220, ${0.15 * shieldPulse})`;
        ctx.strokeStyle = `rgba(0, 255, 255, ${shieldPulse})`; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 0, KART_SIZE + 7, 0, Math.PI * 2); ctx.stroke(); ctx.fill();
      } else if (player.powerup === 'SPEED') {
        const speedPulse = Math.sin(currentTime * 0.02) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255, 255, 0, ${0.5 * speedPulse})`; ctx.lineWidth = 2;
        for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(0, 0, KART_SIZE + i * 2.5, -Math.PI*0.2, Math.PI*0.2); ctx.stroke(); }
      } else if (player.powerup === 'EMP') {
        const empPulse = Math.sin(currentTime * 0.01) * 0.2 + 0.5;
        ctx.fillStyle = `rgba(170, 0, 255, ${0.1 * empPulse})`;
        ctx.strokeStyle = `rgba(170, 0, 255, ${empPulse * 0.8})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, KART_SIZE + 6, 0, Math.PI * 2); ctx.stroke(); ctx.fill();
      }


      let kartColor = player.color;
      if (player.stunned > currentTime) {
        kartColor = '#888888';
        ctx.strokeStyle = 'rgba(220, 220, 255, 0.7)';
        ctx.lineWidth = 1;
        for(let i=0; i<3; i++){
            ctx.beginPath();
            const stunRad = KART_SIZE * 0.7;
            ctx.moveTo((Math.random()-0.5)*stunRad, (Math.random()-0.5)*stunRad);
            ctx.lineTo((Math.random()-0.5)*stunRad*1.5, (Math.random()-0.5)*stunRad*1.5);
            ctx.stroke();
        }
      }
      if (isHit || (isRespawning && Math.floor(currentTime / 100) % 2 === 0)) {
        kartColor = '#ffffff';
      }


      ctx.fillStyle = kartColor;
      ctx.shadowColor = kartColor;
      ctx.shadowBlur = player.stunned > currentTime ? 5 : 12;

      ctx.beginPath();
      ctx.moveTo(-KART_SIZE * 0.5, -KART_SIZE * 0.4);
      ctx.lineTo(KART_SIZE * 0.3, -KART_SIZE * 0.5);
      ctx.lineTo(KART_SIZE * 0.6, -KART_SIZE * 0.25);
      ctx.lineTo(KART_SIZE * 0.6, KART_SIZE * 0.25);
      ctx.lineTo(KART_SIZE * 0.3, KART_SIZE * 0.5);
      ctx.lineTo(-KART_SIZE * 0.5, KART_SIZE * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#444444';
      ctx.fillRect(-KART_SIZE * 0.6, -KART_SIZE * 0.2, KART_SIZE * 0.2, KART_SIZE * 0.4);
      ctx.fillRect(-KART_SIZE * 0.7, -KART_SIZE * 0.25, KART_SIZE * 0.1, KART_SIZE * 0.5);

      ctx.fillStyle = isHit ? '#aaaaaa' : '#282828';
      ctx.beginPath();
      ctx.moveTo(-KART_SIZE * 0.2, -KART_SIZE * 0.3);
      ctx.lineTo(KART_SIZE * 0.25, -KART_SIZE * 0.35);
      ctx.lineTo(KART_SIZE * 0.15, KART_SIZE * 0.35);
      ctx.lineTo(-KART_SIZE * 0.2, KART_SIZE * 0.3);
      ctx.closePath();
      ctx.fill();


      const wheelWidth = KART_SIZE * 0.2;
      const wheelHeight = KART_SIZE * 0.15;
      const wheelInsetX = KART_SIZE * 0.05;
      const wheelInsetY = KART_SIZE * 0.02;
      ctx.fillStyle = '#303030';
      ctx.fillRect(-KART_SIZE * 0.5 + wheelInsetX, -KART_SIZE * 0.45 + wheelInsetY, wheelWidth, wheelHeight);
      ctx.fillRect(KART_SIZE * 0.3 - wheelInsetX - wheelWidth, -KART_SIZE * 0.5 + wheelInsetY, wheelWidth, wheelHeight);
      ctx.fillRect(-KART_SIZE * 0.5 + wheelInsetX, KART_SIZE * 0.45 - wheelInsetY - wheelHeight, wheelWidth, wheelHeight);
      ctx.fillRect(KART_SIZE * 0.3 - wheelInsetX - wheelWidth, KART_SIZE * 0.45 - wheelInsetY - wheelHeight, wheelWidth, wheelHeight);


      ctx.restore();

      const barWidth = 35; const barHeight = 5;
      const healthPercent = Math.max(0, player.health) / player.maxHealth;
      ctx.fillStyle = 'rgba(50,50,50,0.7)'; ctx.fillRect(player.x - barWidth/2, player.y - KART_SIZE - 12, barWidth, barHeight);
      ctx.fillStyle = healthPercent > 0.6 ? '#00dd00' : healthPercent > 0.3 ? '#dddd00' : '#dd0000';
      ctx.fillRect(player.x - barWidth/2, player.y - KART_SIZE - 12, barWidth * healthPercent, barHeight);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.5;
      ctx.strokeRect(player.x - barWidth/2, player.y - KART_SIZE - 12, barWidth, barHeight);


      ctx.fillStyle = isHit ? '#ff0000' : '#ffffff';
      ctx.shadowColor = 'black'; ctx.shadowBlur = 3;
      ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
      ctx.fillText(player.name, player.x, player.y - KART_SIZE - 17);
      ctx.shadowBlur = 0;

      if (player.powerup && POWERUP_TYPES[player.powerup]) {
        const pInfo = POWERUP_TYPES[player.powerup];
        const timeLeft = (player.powerupEndTime - currentTime) / 1000;
        const iconSize = 12;
        const iconYOffset = player.y - KART_SIZE - 30;

        ctx.save();
        ctx.translate(player.x, iconYOffset);
        const scale = iconSize / 24;
        ctx.scale(scale,scale);
        ctx.translate(-12,-12);
        ctx.fillStyle = pInfo.color;
        if (pInfo.path) {
            const path2d = getPath2D(pInfo.path);
            ctx.fill(path2d);
        }
        ctx.restore();

        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8px Arial'; ctx.textAlign = 'center';
        ctx.fillText(Math.ceil(timeLeft).toString(), player.x, iconYOffset + iconSize + 2);
      }
    });

    gameState.announcements.forEach(ann => {
        const alpha = ann.life / ann.maxLife;
        ctx.fillStyle = ann.color;
        ctx.globalAlpha = alpha * 0.9;
        ctx.font = `bold ${ann.size}px 'Arial Black', Gadget, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
        ctx.fillText(ann.text, ann.x, ann.y);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    });


    const humanPlayer = gameState.players.find(p => p.isPlayer);
    if (humanPlayer && humanPlayer.powerup && POWERUP_TYPES[humanPlayer.powerup]) {
        const pInfo = POWERUP_TYPES[humanPlayer.powerup];
        const uiIconSize = 18;
        const uiIconX = width / 2 - 60; 
        const uiIconY = 10; 

        
        ctx.save();
        ctx.translate(uiIconX + uiIconSize/2, uiIconY + uiIconSize/2);
        const scale = uiIconSize / 24;
        ctx.scale(scale,scale);
        ctx.translate(-12,-12);
        ctx.fillStyle = pInfo.color;
        if (pInfo.path) {
            const path2d = getPath2D(pInfo.path);
            ctx.fill(path2d);
        }
        ctx.restore();
        ctx.fillStyle = pInfo.color;
        ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left';
        ctx.fillText(pInfo.name, uiIconX + uiIconSize + 8, 26); 
    }

    if (gameState.screenShake.duration > 0 && gameState.screenShake.intensity > 0) {
        ctx.restore();
    }

  }, [gameState, canvasDimensions]);

  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) e.preventDefault();
  }, []);
  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.code] = false;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) e.preventDefault();
  }, []);


  useEffect(() => {
    if (showInstructions) {
      const countdownInterval = setInterval(() => {
        setInstructionCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowInstructions(false);
            setGameState(currentGameState => ({ ...currentGameState, gameActive: true }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [showInstructions]);


  useEffect(() => { if (canvasRef.current) canvasRef.current.focus(); }, []);
  const handleCanvasClick = useCallback(() => { if (canvasRef.current) canvasRef.current.focus(); }, []);

  useEffect(() => {
    const loop = () => {
      if (!gameState.gameActive && !showInstructions) {
          if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
          render();
          return;
      }
      if(gameState.gameActive) gameLoop();
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    if (gameState.gameActive || showInstructions) {
      if(!animationFrameIdRef.current) animationFrameIdRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
       render();
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [gameState.gameActive, gameLoop, showInstructions, render]);

  useEffect(() => {
    render();
  }, [gameState, render]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getWinner = () => {
    if (!gameState.players || gameState.players.length === 0) return { name: "NO ONE", color: '#aaaaaa' };
    const scores = Object.entries(gameState.score);
    if (scores.length === 0) return { name: "NO ONE", color: '#aaaaaa' };

    const validScores = gameState.players.map(p => ({ id: p.id, name: p.name, score: gameState.score[p.id] || 0, color: p.color }));
    if(validScores.length === 0) return { name: "NO ONE", color: '#aaaaaa' };

    const maxScore = Math.max(...validScores.map(p => p.score));
    const winners = validScores.filter(p => p.score === maxScore);

    if (winners.length === 1) {
      return winners[0];
    }
    return { name: 'TIE', color: '#aaaaaa' };
  };

  const winnerInfo = (!gameState.gameActive && !showInstructions) ? getWinner() : null;


  return (
    <div className="w-440 flex flex-col items-center bg-gray-900 min-h-screen p-2 md:p-4 text-white font-mono ">
     <div className="mb-2 md:mb-4 text-center w-full">
        <div className="flex items-center justify-center mb-1 md:mb-2">
          <img
            src={logo}
            alt="KrashKarts Logo"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full mr-3 md:mr-4 object-cover border-2 border-yellow-500 shadow-lg"
          />
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-600 to-rose-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            💥 KrashKarts 🏎️
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-8 text-sm md:text-lg">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            <span className="text-yellow-300">Time: {formatTime(gameState.gameTime)}</span>
          </div>

        </div>
      </div>

      <div className="mb-2 md:mb-4 flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold w-full">
        {gameState.players.map(p => (
            <div key={p.id} className={`bg-gradient-to-r ${p.isPlayer ? 'from-red-600 to-red-700 border-red-500' : p.id ==='ai1' ? 'from-blue-600 to-blue-700 border-blue-500' : p.id === 'ai2' ? 'from-green-600 to-green-700 border-green-500' : 'from-purple-600 to-purple-700 border-purple-500'} px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-lg border`}>
                <div className="flex items-center gap-1 md:gap-2">
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full`} style={{backgroundColor: p.color}}></div>
                    {p.name}: {gameState.score[p.id] !== undefined ? gameState.score[p.id] : 0}
                    {p.killStreak > 1 && <span className="ml-1 text-xs text-orange-300">(🔥x{p.killStreak})</span>}
                </div>
            </div>
        ))}
      </div>

      <div className="w-full flex justify-center px-1">
          <div className="w-full">
            <canvas
                ref={canvasRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                className="border-2 md:border-4 border-gray-600 bg-gray-800 rounded-lg md:rounded-xl shadow-2xl block mx-auto"
                style={{ boxShadow: '0 0 25px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.03)'}}
                tabIndex={0}
                onClick={handleCanvasClick}
            />
          </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="text-center bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 p-4 md:p-8 rounded-xl border-2 md:border-4 border-yellow-500 shadow-2xl shadow-yellow-400/70 w-full max-w-md md:max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-yellow-400 tracking-wider drop-shadow-lg">GET READY!</h2>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 text-white text-base md:text-lg">
              <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600/70 hover:bg-gray-700 transition-all">
                <div className="p-2 md:p-3 bg-gray-600 rounded-full mb-2 shadow-md border border-gray-500">
                  <div className="flex gap-1">
                    <ArrowUp size={28} className="text-green-400"/>
                    <ArrowLeft size={28} className="text-blue-400"/>
                    <ArrowRight size={28} className="text-orange-400"/>
                  </div>
                </div>
                <span className="font-semibold">Move Kart</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600/70 hover:bg-gray-700 transition-all">
                <div className="p-2 md:p-3 bg-gray-600 rounded-full mb-2 shadow-md border border-gray-500">
                  <Space size={28} className="text-red-400"/>
                </div>
                <span className="font-semibold">Use Power-up</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600/70 hover:bg-gray-700 transition-all">
                <div className="p-2 md:p-3 bg-gray-600 rounded-full mb-2 shadow-md border border-gray-500">
                  <Swords size={28} className="text-yellow-400"/>
                </div>
                <span className="font-semibold">Ram Enemies</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600/70 hover:bg-gray-700 transition-all">
              <div className="flex flex-row items-center justify-center p-2 md:p-3 bg-gray-600 rounded-full mb-2 shadow-md border border-gray-500">
                   <Zap size={22} className="text-yellow-300 mx-1"/>
                   <Shield size={22} className="text-cyan-300 mx-1"/>
                   <Rocket size={22} className="text-red-300 mx-1"/>
                   <Signal size={22} className="text-purple-300 mx-1"/>
                 </div>
                <span className="font-semibold">Collect Power-ups</span>
              </div>
            </div>

            <div className="text-5xl md:text-7xl font-extrabold text-yellow-500 animate-pulse drop-shadow-xl">
              {instructionCountdown}
            </div>
            <p className="mt-2 text-md md:text-lg text-gray-300">Game starting in...</p>
          </div>
        </div>
      )}

      {winnerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="text-center bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 p-4 md:p-8 rounded-xl border-2 md:border-4 border-yellow-400 shadow-2xl w-full max-w-md md:max-w-lg">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-yellow-400 drop-shadow-lg">⚡ GAME OVER! ⚡</h2>
            <div className="text-xl md:text-3xl mb-3 md:mb-6 font-bold" style={{color: winnerInfo.color || '#FFFFFF'}}>
                {winnerInfo.name === (gameState.players.find(p=>p.isPlayer)?.name) ? (
                <span className="text-green-400">🏆 {winnerInfo.name ? winnerInfo.name.toUpperCase() : 'YOU'} WINS! (VICTORY!) 🏆</span>
                ) : winnerInfo.name === 'TIE' ? (
                <span className="text-yellow-400">🤝 TIE BATTLE! 🤝</span>
                ) : (
                <span style={{color: winnerInfo.color}}>💥 {winnerInfo.name ? winnerInfo.name.toUpperCase() : 'SOMEONE'} WINS! 💥</span>
                )}
            </div>

            <div className="mb-3 md:mb-6 grid grid-cols-2 gap-2 md:gap-4 text-sm md:text-lg">
                {gameState.players.sort((a,b) => (gameState.score[b.id] || 0) - (gameState.score[a.id] || 0)).map(p => (
                    <div key={p.id} className={`p-2 md:p-3 rounded-lg shadow-inner`} style={{backgroundColor: `${p.color}33`, border: `2px solid ${p.color}88`}}>
                        <div className="font-bold flex items-center justify-center gap-2" style={{color: p.color}}>
                            {p.name}
                            {winnerInfo && winnerInfo.name === p.name && p.name !== 'TIE' && <Trophy size={18} className="inline" />}
                        </div>
                        <div className="text-xl md:text-2xl text-white font-black drop-shadow-sm">{gameState.score[p.id] !== undefined ? gameState.score[p.id] : 0} <span className="text-xs">KILLS</span></div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => initializeGame(false)}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 px-4 md:px-8 py-2 md:py-4 rounded-xl font-bold text-gray-900 text-lg md:text-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/50"
            >
                <RotateCcw className="inline mr-1 md:mr-3" size={20} />
                PLAY AGAIN!
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default SmashKarts;