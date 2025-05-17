import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { getNeonColor } from '../utils/elementUtils';

/**
 * ElementCard component displays a single element in the periodic table grid
 */
function ElementCard({ element, onMouseEnter, onMouseLeave, onClick, isFiltered = true }) {
  // Get neon color for this element
  const neonColor = getNeonColor(element.category);

  // Apply different styles based on filter state
  const elementStyle = isFiltered
    ? `backdrop-blur-md bg-white/10 dark:bg-black/20 border z-10 rounded-lg`
    : `bg-gray-100/10 dark:bg-gray-800/10 border opacity-30 z-0 rounded-lg`;
  const textStyle = isFiltered
    ? 'text-gray-800 dark:text-white'
    : 'text-gray-500 dark:text-gray-600';
    
  // Refs for GSAP animations
  const cardRef = useRef(null);
  const symbolRef = useRef(null);
  
  // Animation variants for Framer Motion
  const cardVariants = {
    hover: {
      scale: 1.1,
      zIndex: 20,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  // Handle mouse enter with GSAP
  const handleMouseEnter = (e) => {
    if (!isFiltered) return;
    
    // Run the passed onMouseEnter function
    if (onMouseEnter) {
      onMouseEnter(e);
    }
    
    // GSAP animations
    gsap.to(symbolRef.current, {
      textShadow: `0 0 10px ${neonColor}, 0 0 15px ${neonColor}, 0 0 20px ${neonColor}`,
      duration: 0.3,
      ease: "power2.out"
    });
    
    gsap.to(cardRef.current, {
      boxShadow: `0 0 15px ${neonColor}, 0 0 25px ${neonColor}, inset 0 0 8px ${neonColor}`,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  
  // Handle mouse leave with GSAP
  const handleMouseLeave = (e) => {
    if (!isFiltered) return;
    
    // Run the passed onMouseLeave function
    if (onMouseLeave) {
      onMouseLeave(e);
    }
    
    // GSAP animations
    gsap.to(symbolRef.current, {
      textShadow: `0 0 4px ${neonColor}, 0 0 6px ${neonColor}`,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.to(cardRef.current, {
      boxShadow: `0 0 6px ${neonColor}, inset 0 0 4px ${neonColor}`,
      duration: 0.5,
      ease: "power2.out"
    });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`${elementStyle} p-1.5 min-h-14 flex flex-col justify-between cursor-pointer ${textStyle}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      whileHover={isFiltered ? "hover" : {}}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        backdropFilter: isFiltered ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isFiltered ? 'blur(8px)' : 'none',
        borderColor: isFiltered ? `${neonColor}` : 'rgba(255,255,255,0.1)',
        boxShadow: isFiltered ? `0 0 6px ${neonColor}, inset 0 0 4px ${neonColor}` : 'none',
        background: isFiltered ? `radial-gradient(circle at center, ${neonColor}10 0%, transparent 70%)` : 'none'
      }}
    >      <div className="text-xs text-left">
        <span>{element.number}</span>
      </div>
      <div className="text-center mt-auto">        <motion.div 
          ref={symbolRef}
          className={`${isFiltered ? "text-2xl font-normal" : "text-xl"}`} 
          style={{
            textShadow: isFiltered ? `0 0 4px ${neonColor}, 0 0 6px ${neonColor}` : 'none',
            letterSpacing: '0.03em',
          }}
          animate={{ 
            y: [0, isFiltered ? -2 : 0, 0],
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        >
          {element.symbol}
        </motion.div>
      </div>    </motion.div>
  );
}

ElementCard.propTypes = {
  element: PropTypes.shape({
    number: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    xpos: PropTypes.number.isRequired,
    ypos: PropTypes.number.isRequired
  }).isRequired,
  isFiltered: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func
};

export default ElementCard;
