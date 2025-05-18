import PeriodicTable from "./components/PeriodicTable";
import ThemeToggle from "./components/ThemeToggle";
import ElementComparisonTool from "./components/ElementComparisonTool";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { useEffect, useRef, useState } from "react";

function ShootingStar() {
  const duration = Math.random() * 6 + 3;
  const delay = Math.random() * 5 + 2;
  const size = Math.random() * 50 + 30;
  const top = Math.random() * 70;
  const left = Math.random() * 30;
  const angle = Math.random() * 60 - 30;

  const colorChoices = [
    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)",
    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(176,224,230,0.95) 100%)",
    "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(240,248,255,0.95) 100%)",
  ];

  const gradient =
    colorChoices[Math.floor(Math.random() * colorChoices.length)];
  const isExtraBright = Math.random() > 0.7;
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

function StarParticle({ index }) {
  const size = Math.random() * 3 + 1.5;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const speed = Math.random() * 15 + 5;
  const delay = Math.random() * 5;
  const baseOpacity = Math.random() * 0.6 + 0.4;
  const isPulse = Math.random() > 0.6;
  const isExtraShiny = Math.random() > 0.8;

  const colors = [
    "rgba(255, 255, 255, OPACITY)",
    "rgba(173, 216, 230, OPACITY)",
    "rgba(240, 248, 255, OPACITY)",
    "rgba(255, 250, 240, OPACITY)",
    "rgba(240, 255, 240, OPACITY)",
    "rgba(230, 230, 250, OPACITY)",
  ];

  const color = colors[Math.floor(Math.random() * colors.length)].replace(
    "OPACITY",
    baseOpacity.toString()
  );
  const glowIntensity = isExtraShiny ? 3 : 2;

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

function LargeStar({ index }) {
  const size = Math.random() * 2 + 4;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const twinkleSpeed = Math.random() * 2 + 1.5;
  const delay = Math.random() * 0.5;

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
  const [largeStars] = useState(() => Array.from({ length: 7 }, (_, i) => i));
  const [shootingStars] = useState(() =>
    Array.from({ length: 4 }, (_, i) => i)
  );

  useEffect(() => {
    if (gridRef.current) {
      const grid = gridRef.current;

      grid.style.backgroundSize = "40px 40px";
      grid.style.backgroundImage =
        "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), " +
        "linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)";

      const starCount = 65;
      setStars(Array.from({ length: starCount }, (_, i) => i));
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
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <ThemeProvider>
      <ComparisonProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black dark:from-gray-950 dark:to-black transition-colors relative overflow-hidden">
          <div
            ref={gridRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            {stars.map((_, index) => (
              <StarParticle key={`star-${index}`} index={index} />
            ))}

            {largeStars.map((_, index) => (
              <LargeStar key={`large-${index}`} index={index} />
            ))}

            {shootingStars.map((_, index) => (
              <ShootingStar key={`shooting-${index}`} />
            ))}
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 -right-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl"></div>

            <div className="absolute top-0 left-1/4 w-1 h-64 bg-gradient-to-b from-cyan-400/20 to-transparent blur-md"></div>
            <div className="absolute top-1/4 right-1/3 w-1 h-96 bg-gradient-to-b from-purple-400/20 to-transparent blur-md"></div>
            <div className="absolute top-10 left-2/3 w-1 h-80 bg-gradient-to-b from-blue-400/20 to-transparent blur-md"></div>
          </div>

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
