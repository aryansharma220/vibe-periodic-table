import PeriodicTable from "./components/PeriodicTable";
import ThemeToggle from "./components/ThemeToggle";
import ElementComparisonTool from "./components/ElementComparisonTool";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { useEffect, useRef, useState } from "react";

// Component for shooting star effect
function ShootingStar() {
  const duration = Math.random() * 6 + 3; // 3-9 second duration (slower)
  const delay = Math.random() * 5 + 2; // Random delay between 2-7s (much shorter initial delay)
  const size = Math.random() * 50 + 30; // Trail length between 30-80px (shorter)
  const top = Math.random() * 70; // Position in top 70% of screen
  const left = Math.random() * 30; // Start position in left 30% of screen
  const angle = Math.random() * 60 - 30; // Angle between -30 and 30 degrees

  // Add some color variety to shooting stars
  const colorChoices = [
    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)",
    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(176,224,230,0.95) 100%)",
    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(240,248,255,0.95) 100%)",
  ];

  const gradient =
    colorChoices[Math.floor(Math.random() * colorChoices.length)];
  const isExtraBright = Math.random() > 0.7; // 30% chance of extra bright shooting star
  const height = isExtraBright ? "3px" : "2px";

  return (
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: height,
        backgroundImage: gradient,
        boxShadow: isExtraBright
          ? "0 0 6px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5)"
          : "0 0 4px rgba(255,255,255,0.6)",
        animationName: "shooting-star",
        animationDuration: `${duration}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationDelay: `${delay}s`,
        transform: `rotate(${angle}deg)`,
        opacity: 0,
      }}
    />
  );
}

// Component for individual star particles
function StarParticle({ index }) {
  const size = Math.random() * 3 + 1.5; // Slightly larger base size
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const speed = Math.random() * 15 + 5;
  const delay = Math.random() * 5;
  const baseOpacity = Math.random() * 0.6 + 0.4; // Higher opacity range (0.4-1.0)
  const isPulse = Math.random() > 0.6; // 40% of stars will have a pulse effect
  const isExtraShiny = Math.random() > 0.8; // 20% will be extra shiny

  // More vibrant color palette
  const colors = [
    "rgba(255, 255, 255, OPACITY)", // White
    "rgba(173, 216, 230, OPACITY)", // Light blue
    "rgba(240, 248, 255, OPACITY)", // Alice blue
    "rgba(255, 250, 240, OPACITY)", // Floral white
    "rgba(240, 255, 240, OPACITY)", // Honeydew
    "rgba(230, 230, 250, OPACITY)", // Lavender
  ];

  const color = colors[Math.floor(Math.random() * colors.length)].replace(
    "OPACITY",
    baseOpacity.toString()
  );
  const glowIntensity = isExtraShiny ? 3 : 2; // More intense glow for extra shiny stars

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${initialX}%`,
        top: `${initialY}%`,
        backgroundColor: isExtraShiny ? "#fff" : color,
        boxShadow: isExtraShiny
          ? `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}, 0 0 ${
              size * 6
            }px rgba(255,255,255,0.3)`
          : `0 0 ${size * glowIntensity}px ${color}`,
        animation: isPulse
          ? `float-${index % 3} ${speed}s infinite ease-in-out ${delay}s, ${
              isExtraShiny ? "shine" : "pulse"
            } ${Math.random() * 1.5 + 0.8}s infinite ease-in-out ${delay}s`
          : `float-${index % 3} ${speed}s infinite ease-in-out ${delay}s`,
      }}
    />
  );
}

// Component for special large twinkling stars
function LargeStar({ index }) {
  const size = Math.random() * 2 + 4; // 4-6px size for larger stars
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const twinkleSpeed = Math.random() * 2 + 1.5; // 1.5-3.5 second twinkle (much faster)
  const delay = Math.random() * 0.5; // Reduced delay

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${initialX}%`,
        top: `${initialY}%`,
        backgroundColor: "#fff",
        boxShadow: `0 0 ${size}px #fff, 0 0 ${
          size * 2
        }px rgba(255,255,255,0.8), 0 0 ${size * 3}px rgba(255,255,255,0.6)`,
        animation: `twinkle ${twinkleSpeed}s infinite ease-in-out ${delay}s`,
      }}
    />
  );
}

function App() {
  const gridRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [largeStars] = useState(() => Array.from({ length: 7 }, (_, i) => i)); // 7 large twinkling stars
  const [shootingStars] = useState(() =>
    Array.from({ length: 4 }, (_, i) => i)
  ); // 3 shooting stars (reduced from 5)
  
  // Refs for cursor effect
  const cursorLightRef = useRef(null);
  const cursorDotRef = useRef(null);

  // Initialize grid background and stars
  useEffect(() => {
    if (gridRef.current) {
      const grid = gridRef.current;

      // Create grid pattern with CSS
      grid.style.backgroundSize = "40px 40px";
      grid.style.backgroundImage =
        "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), " +
        "linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)";

      // Generate stars - increased to 65 for a more populated sky
      const starCount = 65;
      setStars(Array.from({ length: starCount }, (_, i) => i));

      // Add the CSS animations for stars
      const style = document.createElement("style");
      style.textContent = `
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-15px, 10px); }
          66% { transform: translate(5px, -15px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes shine {
          0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          50% { opacity: 1; transform: scale(1.3); filter: brightness(1.8); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.4; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.2); filter: brightness(1.4); }
          75% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes shooting-star {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100px));
            opacity: 0;
          }
        }
        /* Smooth cursor hover effect */
        @keyframes cursor-hover-in {
          0% { transform: scale(1); }
          100% { transform: scale(1.5); }
        }
        @keyframes cursor-hover-out {
          0% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        /* Nice ripple effect animation */
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);    // Add cursor perspective light effect
  useEffect(() => {
    // Create cursor light elements if they don't exist
    if (!document.querySelector('.cursor-light')) {
      const cursorLight = document.createElement('div');
      cursorLight.className = 'cursor-light';
      document.body.appendChild(cursorLight);
      cursorLightRef.current = cursorLight;
      
      const cursorDot = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      document.body.appendChild(cursorDot);
      cursorDotRef.current = cursorDot;
      
      // Add depth reveal layer
      const depthLayer = document.createElement('div');
      depthLayer.className = 'cursor-depth-reveal';
      document.body.appendChild(depthLayer);
      
      // Add global style to hide cursor
      const style = document.createElement('style');
      style.textContent = '* { cursor: none !important; }';
      document.head.appendChild(style);
    }
    
    // Variables to track mouse position and movement
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseSpeedX = 0;
    let mouseSpeedY = 0;
    let targetWidth = 180;
    let targetHeight = 180;
    let currentWidth = 180;
    let currentHeight = 180;
    let isOverInteractive = false;
    let cursorColor = 'white';
    let cursorScale = 1;
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let rafId = null;
    
    // Constants for smoother interpolation
    const CURSOR_DOT_LERP_FACTOR = 0.5; // Faster for dot (more responsive)
    const CURSOR_LIGHT_LERP_FACTOR = 0.16; // Slower for light glow (smoother trail)
    const TRANSFORM_LERP_FACTOR = 0.14; // For transform effects
    const SIZE_LERP_FACTOR = 0.15; // For size changes
    
    // Linear interpolation function
    const lerp = (start, end, factor) => start * (1 - factor) + end * factor;
    
    // Animation frame function for smooth cursor updates
    const animateCursor = () => {
      if (cursorDotRef.current && cursorLightRef.current) {
        // Interpolate positions for smooth movement
        currentX = lerp(currentX, mouseX, CURSOR_DOT_LERP_FACTOR);
        currentY = lerp(currentY, mouseY, CURSOR_DOT_LERP_FACTOR);
        
        // Interpolate size and offset
        currentWidth = lerp(currentWidth, targetWidth, SIZE_LERP_FACTOR);
        currentHeight = lerp(currentHeight, targetHeight, SIZE_LERP_FACTOR);
        currentOffsetX = lerp(currentOffsetX, targetOffsetX, TRANSFORM_LERP_FACTOR);
        currentOffsetY = lerp(currentOffsetY, targetOffsetY, TRANSFORM_LERP_FACTOR);
        
        // Calculate distance from center for perspective effect
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distanceX = (currentX - centerX) / centerX;
        const distanceY = (currentY - centerY) / centerY;
        
        // Update cursor dot position - needs to be very responsive
        cursorDotRef.current.style.left = `${currentX}px`;
        cursorDotRef.current.style.top = `${currentY}px`;
        cursorDotRef.current.style.transform = `translate(-50%, -50%) scale(${cursorScale})`;
        cursorDotRef.current.style.backgroundColor = cursorColor;
        
        // Update cursor light with smoother interpolation
        cursorLightRef.current.style.width = `${currentWidth}px`;
        cursorLightRef.current.style.height = `${currentHeight}px`;
        cursorLightRef.current.style.left = `${currentX}px`;
        cursorLightRef.current.style.top = `${currentY}px`;
        cursorLightRef.current.style.transform = `
          translate(-50%, -50%)
          rotateX(${distanceY * -20}deg)
          rotateY(${distanceX * 20}deg)
          scale(${1 + Math.abs(distanceX) * 0.3 + Math.abs(distanceY) * 0.3})
          translate(${currentOffsetX}px, ${currentOffsetY}px)
        `;
        
        // Update depth layer CSS variables 
        // Using currentX/Y for smoother gradients
        document.documentElement.style.setProperty('--cursor-x', `${currentX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${currentY}px`);
      }
      
      // Continue animation loop
      rafId = requestAnimationFrame(animateCursor);
    };
    
    // Start animation loop immediately
    rafId = requestAnimationFrame(animateCursor);
    
    // Mouse move handler - now just updates target values
    const handleMouseMove = (e) => {
      // Get mouse position
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Calculate mouse speed for dynamic effects
      mouseSpeedX = mouseX - prevMouseX;
      mouseSpeedY = mouseY - prevMouseY;
      const mouseSpeed = Math.sqrt(mouseSpeedX * mouseSpeedX + mouseSpeedY * mouseSpeedY);
      
      // Save current position as previous for next calculation
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      
      // Dynamically adjust the light size based on mouse speed
      const speedFactor = Math.min(Math.abs(mouseSpeed) * 0.4, 40);
      const baseSize = 180;
      targetWidth = baseSize + speedFactor;
      targetHeight = baseSize + speedFactor;
      
      // Calculate slight offset based on mouse speed for more natural movement
      targetOffsetX = Math.sign(mouseSpeedX) * Math.min(Math.abs(mouseSpeedX * 0.2), 20);
      targetOffsetY = Math.sign(mouseSpeedY) * Math.min(Math.abs(mouseSpeedY * 0.2), 20);
      
      // Check if cursor is over interactive elements
      const target = e.target;
      isOverInteractive = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.getAttribute('role') === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'select' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.element-card') ||
        target.closest('[class*="interactive"]') ||
        target.getAttribute('tabindex') === '0' ||
        getComputedStyle(target).cursor === 'pointer';
      
      // Set target styles for interactive elements
      if (isOverInteractive) {
        cursorScale = 1.5;
        cursorColor = 'rgba(6, 182, 212, 0.8)';
      } else {
        cursorScale = 1;
        cursorColor = 'white';
      }
    };
    
    // Track click state for dynamic effects
    let cursorClickMode = false;
    let cursorBackground = `
      radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(6, 182, 212, 0.7) 15%,
        rgba(124, 58, 237, 0.5) 30%,
        transparent 60%
      )
    `;
    let cursorFilter = 'blur(3px)';
    
    // Mouse down/up handlers for interactive feedback
    const handleMouseDown = (e) => {
      // Update parameters for animation loop
      cursorClickMode = true;
      cursorScale = 0.6;
      cursorColor = 'rgba(124, 58, 237, 0.9)';
      targetWidth = 130;
      targetHeight = 130;
      cursorFilter = 'blur(2px)';
      cursorBackground = `
        radial-gradient(
          circle at center,
          rgba(255, 255, 255, 1) 0%,
          rgba(124, 58, 237, 0.8) 15%,
          rgba(6, 182, 212, 0.6) 30%,
          transparent 60%
        )
      `;
      
      if (cursorLightRef.current) {
        cursorLightRef.current.style.filter = cursorFilter;
        cursorLightRef.current.style.background = cursorBackground;
      }
      
      // Add a ripple effect on click with smoother animation
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';
      ripple.style.opacity = '1';
      
      // Use requestAnimationFrame for smoother ripple expansion
      document.body.appendChild(ripple);
      
      // Use smoother animation with requestAnimationFrame
      let startTime = null;
      const duration = 500; // ms
      const initialSize = 10;
      const targetSize = 100;
      
      const animateRipple = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic ease out for natural motion
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const size = initialSize + (targetSize - initialSize) * easeProgress;
        
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        
        if (progress < 1) {
          ripple.style.opacity = `${1 - easeProgress}`;
          requestAnimationFrame(animateRipple);
        } else {
          ripple.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(ripple)) {
              document.body.removeChild(ripple);
            }
          }, 100);
        }
      };
      
      requestAnimationFrame(animateRipple);
    };
    
    const handleMouseUp = () => {
      cursorClickMode = false;
      
      // Update back to normal state (or interactive state if over interactive element)
      if (isOverInteractive) {
        cursorScale = 1.5;
        cursorColor = 'rgba(6, 182, 212, 0.8)';
      } else {
        cursorScale = 1;
        cursorColor = 'white';
      }
      
      targetWidth = 180;
      targetHeight = 180;
      cursorFilter = 'blur(3px)';
      cursorBackground = `
        radial-gradient(
          circle at center,
          rgba(255, 255, 255, 0.9) 0%,
          rgba(6, 182, 212, 0.7) 15%,
          rgba(124, 58, 237, 0.5) 30%,
          transparent 60%
        )
      `;
      
      if (cursorLightRef.current) {
        cursorLightRef.current.style.filter = cursorFilter;
        cursorLightRef.current.style.background = cursorBackground;
      }
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up event listeners on unmount
    return () => {
      // Cancel animation frame to prevent memory leaks
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Remove cursor elements
      if (cursorLightRef.current && document.body.contains(cursorLightRef.current)) {
        document.body.removeChild(cursorLightRef.current);
      }
      if (cursorDotRef.current && document.body.contains(cursorDotRef.current)) {
        document.body.removeChild(cursorDotRef.current);
      }
      
      // Remove depth layer
      const depthLayer = document.querySelector('.cursor-depth-reveal');
      if (depthLayer && document.body.contains(depthLayer)) {
        document.body.removeChild(depthLayer);
      }
      
      // Reset CSS variables
      document.documentElement.style.removeProperty('--cursor-x');
      document.documentElement.style.removeProperty('--cursor-y');
    };
  }, []);

  return (
    <ThemeProvider>
      <ComparisonProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black dark:from-gray-950 dark:to-black transition-colors relative overflow-hidden">
          {/* Grid background */}
        <div
          ref={gridRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Animated star particles */}
          {stars.map((_, index) => (
            <StarParticle key={`star-${index}`} index={index} />
          ))}

          {/* Special large twinkling stars */}
          {largeStars.map((_, index) => (
            <LargeStar key={`large-${index}`} index={index} />
          ))}

          {/* Shooting stars */}
          {shootingStars.map((_, index) => (
            <ShootingStar key={`shooting-${index}`} />
          ))}
        </div>

        {/* Decorative elements - neon glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          {/* Color orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl"></div>

          {/* Light beams */}
          <div className="absolute top-0 left-1/4 w-1 h-64 bg-gradient-to-b from-cyan-400/20 to-transparent blur-md"></div>
          <div className="absolute top-1/4 right-1/3 w-1 h-96 bg-gradient-to-b from-purple-400/20 to-transparent blur-md"></div>
          <div className="absolute top-10 left-2/3 w-1 h-80 bg-gradient-to-b from-blue-400/20 to-transparent blur-md"></div>
        </div>

        {/* Gradient light spots */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/5 to-red-500/5 blur-2xl"></div>
        <div className="absolute top-2/3 right-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 blur-2xl"></div>

        <div className="relative z-10">
          <PeriodicTable />
          <ElementComparisonTool />
        </div>
      </div>
      </ComparisonProvider>
    </ThemeProvider>
  );
}

export default App;
