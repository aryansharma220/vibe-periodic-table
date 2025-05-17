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
    // Add entrance animation when component mounts and subtle glow effect
  useEffect(() => {
    // Create a staggered entrance animation
    gsap.fromTo(
      cardRef.current,
      { 
        opacity: 0, 
        scale: 0.8, 
        boxShadow: 'none',
        y: 10
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        boxShadow: isFiltered ? `0 0 6px ${neonColor}, inset 0 0 4px ${neonColor}` : 'none',
        duration: 0.6,
        delay: 0.05 * element.number % 0.5, // Staggered delay based on atomic number
        ease: "power3.out"
      }
    );
    
    // If the element is filtered, add a subtle pulsing glow effect
    if (isFiltered) {
      const pulseTimeline = gsap.timeline({
        repeat: -1, 
        yoyo: true, 
        repeatDelay: 0.5,
        delay: Math.random() * 2 // Random start time for each element
      });
      
      pulseTimeline.to(cardRef.current, {
        boxShadow: `0 0 8px ${neonColor}, inset 0 0 5px ${neonColor}`,
        duration: 1.5,
        ease: "sine.inOut"
      });
      
      // Subtle text shadow pulsing for the symbol
      gsap.to(symbolRef.current, {
        textShadow: `0 0 6px ${neonColor}, 0 0 8px ${neonColor}`,
        repeat: -1,
        yoyo: true,
        duration: 2,
        delay: Math.random(),
        ease: "sine.inOut"
      });
    }
    
    // Cleanup the animations when component unmounts
    return () => {
      gsap.killTweensOf(cardRef.current);
      gsap.killTweensOf(symbolRef.current);
    };
  }, [isFiltered, element.number, neonColor]);

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
  const numberRef = useRef(null);
    
  // Symbol animation variants
  const symbolVariants = {
    initial: {
      scale: 1,
      opacity: 1,
      y: 0
    },
    hover: {
      scale: 1.15,
      y: -3,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };
    
    // Animation variants for Framer Motion
  const cardVariants = {
    initial: { 
      scale: 1,
      rotate: 0
    },
    hover: {
      scale: 1.1,
      zIndex: 20,
      rotate: isFiltered ? [0, 0.5, 0] : 0, // subtle rotation effect when filtered
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        rotate: {
          repeat: 0,
          duration: 0.5,
          ease: "easeInOut"
        }
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
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
    
    // GSAP animations with smooth transitions
    gsap.to(symbolRef.current, {
      textShadow: `0 0 10px ${neonColor}, 0 0 15px ${neonColor}, 0 0 20px ${neonColor}`,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out"
    });
    
    gsap.to(cardRef.current, {
      boxShadow: `0 0 15px ${neonColor}, 0 0 25px ${neonColor}, inset 0 0 8px ${neonColor}`,
      borderColor: neonColor,
      duration: 0.4,
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
    
    // GSAP animations with smooth transitions
    gsap.to(symbolRef.current, {
      textShadow: `0 0 4px ${neonColor}, 0 0 6px ${neonColor}`,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.to(cardRef.current, {
      boxShadow: `0 0 6px ${neonColor}, inset 0 0 4px ${neonColor}`,
      borderColor: neonColor,
      duration: 0.5,
      ease: "power2.out"
    });
  };
  // Handle click with a pulse animation
  const handleClick = (e) => {
    if (!isFiltered || !onClick) return;
    
    // Create a more elaborate click effect
    const tl = gsap.timeline();
    
    // Card animation
    tl.to(cardRef.current, {
      scale: 0.92,
      duration: 0.1,
      ease: "power1.inOut",
      boxShadow: `0 0 20px ${neonColor}, 0 0 30px ${neonColor}, inset 0 0 12px ${neonColor}`,
      borderWidth: "2px"
    })
    .to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1.2, 0.5)",
      boxShadow: `0 0 10px ${neonColor}, inset 0 0 6px ${neonColor}`,
      borderWidth: "1px"
    });
    
    // Symbol animation with glow pulse
    gsap.timeline()
      .to(symbolRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power1.inOut",
        textShadow: `0 0 12px ${neonColor}, 0 0 18px ${neonColor}, 0 0 24px ${neonColor}`
      })
      .to(symbolRef.current, {
        scale: 1.1,
        duration: 0.25,
        ease: "elastic.out(1.2, 0.5)",
      })
      .to(symbolRef.current, {
        scale: 1.05,
        duration: 0.15,
        ease: "power2.out",
        textShadow: `0 0 8px ${neonColor}, 0 0 12px ${neonColor}, 0 0 16px ${neonColor}`
      });
    
    // Create a flash effect on the border
    gsap.to(cardRef.current, {
      borderColor: '#ffffff', 
      duration: 0.1,
      onComplete: () => {
        gsap.to(cardRef.current, {
          borderColor: neonColor,
          duration: 0.3
        });
      }
    });
    
    // Call the original onClick handler
    onClick(e);
  };
  return (
    <motion.div
      ref={cardRef}
      className={`${elementStyle} p-1.5 min-h-14 flex flex-col justify-between cursor-pointer ${textStyle}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial="initial"
      variants={cardVariants}
      whileHover={isFiltered ? "hover" : {}}
      whileTap={isFiltered ? "tap" : {}}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        backdropFilter: isFiltered ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isFiltered ? 'blur(8px)' : 'none',
        borderColor: isFiltered ? `${neonColor}` : 'rgba(255,255,255,0.1)',
        boxShadow: isFiltered ? `0 0 6px ${neonColor}, inset 0 0 4px ${neonColor}` : 'none',
        background: isFiltered ? `radial-gradient(circle at center, ${neonColor}10 0%, transparent 70%)` : 'none',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease, background 0.3s ease'
      }}    >      <motion.div 
        ref={numberRef}
        className="text-xs text-left"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0.7 }}
        whileHover={isFiltered ? { 
          opacity: 1, 
          scale: 1.2, 
          x: 1,
          transition: { duration: 0.2 }
        } : {}}
        transition={{ duration: 0.2 }}
      >
        <span>{element.number}</span>
      </motion.div>
      <div className="text-center mt-auto">        <motion.div 
          ref={symbolRef}
          className={`${isFiltered ? "text-2xl font-normal" : "text-xl"}`}
          variants={symbolVariants}
          initial="initial"
          whileHover={isFiltered ? "hover" : ""}
          style={{
            textShadow: isFiltered ? `0 0 4px ${neonColor}, 0 0 6px ${neonColor}` : 'none',
            letterSpacing: '0.03em',
            transition: 'text-shadow 0.3s ease, transform 0.3s ease, color 0.3s ease'
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
