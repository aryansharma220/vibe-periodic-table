import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import gsap from "gsap";
import { getNeonColor } from "../utils/elementUtils";

function ElementCard({
  element,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isFiltered = true,
  isInComparison = false,
  comparisonMode = false,
  style = {},
}) {  const neonColor = getNeonColor(element.category);
  
  const cardRef = useRef(null);
  const symbolRef = useRef(null);
  const numberRef = useRef(null);
  
  useEffect(() => {    
    // Special animation for comparison mode
    if (isInComparison) {
      gsap.to(cardRef.current, {
        boxShadow: `0 0 15px ${neonColor}, 0 0 25px ${neonColor}`,
        scale: 1.05,
        borderColor: "#ffffff",
        zIndex: 20,
        yoyo: true,
        repeat: -1,
        repeatDelay: 2,
        duration: 1.2
      });    } else {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          scale: 0.8,
          boxShadow: "none",
          y: 15,
          fontWeight: "400",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          fontWeight: isFiltered ? "500" : "400",
          boxShadow: isFiltered
            ? `0 0 8px ${neonColor}, inset 0 0 5px ${neonColor}, 0 4px 8px rgba(0,0,0,0.3)`
            : "0 2px 4px rgba(0,0,0,0.1)",
          duration: 0.6,
          delay: (0.05 * element.number) % 0.5,
          ease: "power3.out",
        }
      );
    }

    if (isFiltered) {
      const pulseTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.5,
        delay: Math.random() * 2,
      });

      pulseTimeline.to(cardRef.current, {
        boxShadow: `0 0 8px ${neonColor}, inset 0 0 5px ${neonColor}`,
        duration: 1.5,
        ease: "sine.inOut",
      });

      gsap.to(symbolRef.current, {
        textShadow: `0 0 6px ${neonColor}, 0 0 8px ${neonColor}`,
        repeat: -1,
        yoyo: true,
        duration: 2,
        delay: Math.random(),
        ease: "sine.inOut",
      });
    }

    return () => {
      gsap.killTweensOf(cardRef.current);
      gsap.killTweensOf(symbolRef.current);
    };
  }, [isFiltered, element.number, neonColor]);
  const elementStyle = isFiltered
    ? `backdrop-blur-md bg-white/10 dark:bg-black/20 border z-10 rounded-lg`
    : `bg-gray-100/10 dark:bg-gray-800/10 border opacity-30 z-0 rounded-lg`;
  const textStyle = isFiltered
    ? "text-gray-800 dark:text-white"
    : "text-gray-500 dark:text-gray-600";

  const symbolVariants = {
    initial: {
      scale: 1,
      opacity: 1,
      y: 0,
    },
    hover: {
      scale: 1.15,
      y: -3,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      zIndex: 20,
      rotate: isFiltered ? [0, 0.5, 0] : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        rotate: {
          repeat: 0,
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
  };
  const handleMouseEnter = (e) => {
    if (!isFiltered) return;

    if (onMouseEnter) {
      onMouseEnter(e);
    }

    gsap.to(symbolRef.current, {
      textShadow: `0 0 10px ${neonColor}, 0 0 15px ${neonColor}, 0 0 20px ${neonColor}`,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out",
    });
    
    gsap.to(cardRef.current, {
      boxShadow: `0 0 15px ${neonColor}, 0 0 25px ${neonColor}, inset 0 0 10px ${neonColor}, 0 10px 15px rgba(0,0,0,0.4)`,
      borderColor: neonColor,
      duration: 0.4,
      fontWeight: "600",
      ease: "power2.out",
    });
  };
  const handleMouseLeave = (e) => {
    if (!isFiltered) return;

    if (onMouseLeave) {
      onMouseLeave(e);
    }    gsap.to(symbolRef.current, {
      textShadow: `0 0 4px ${neonColor}, 0 0 6px ${neonColor}`,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    
    gsap.to(cardRef.current, {
      boxShadow: `0 0 8px ${neonColor}, inset 0 0 5px ${neonColor}, 0 4px 8px rgba(0,0,0,0.3)`,
      borderColor: neonColor,
      fontWeight: "500",
      duration: 0.5,
      ease: "power2.out",
    });
  };  const handleClick = (e) => {
    if (!isFiltered || !onClick) return;

    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      scale: 0.92,
      duration: 0.1,
      ease: "power1.inOut",
      boxShadow: `0 0 20px ${neonColor}, 0 0 30px ${neonColor}, inset 0 0 12px ${neonColor}, 0 15px 20px rgba(0,0,0,0.5)`,
      borderWidth: "2px",
      fontWeight: "700",
    }).to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1.2, 0.5)",
      boxShadow: `0 0 12px ${neonColor}, inset 0 0 8px ${neonColor}, 0 6px 12px rgba(0,0,0,0.35)`,
      borderWidth: "1px",
      fontWeight: "600",
    });

    gsap
      .timeline()
      .to(symbolRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power1.inOut",
        textShadow: `0 0 12px ${neonColor}, 0 0 18px ${neonColor}, 0 0 24px ${neonColor}`,
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
        textShadow: `0 0 8px ${neonColor}, 0 0 12px ${neonColor}, 0 0 16px ${neonColor}`,
      });

    gsap.to(cardRef.current, {
      borderColor: "#ffffff",
      duration: 0.1,
      onComplete: () => {
        gsap.to(cardRef.current, {
          borderColor: neonColor,
          duration: 0.3,
        });
      },
    });

    onClick(e);
  };
  return (
    <motion.div
      ref={cardRef}
      className={`${elementStyle} p-1.5 min-h-14 flex flex-col justify-between cursor-pointer ${textStyle}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}      onMouseLeave={handleMouseLeave}
      initial="initial"
      variants={cardVariants}
      whileHover={isFiltered ? "hover" : {}}
      whileTap={isFiltered ? "tap" : {}}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        backdropFilter: isFiltered ? "blur(8px)" : "none",
        WebkitBackdropFilter: isFiltered ? "blur(8px)" : "none",
        borderColor: isFiltered ? `${neonColor}` : "rgba(255,255,255,0.1)",
        boxShadow: isFiltered
          ? `0 0 8px ${neonColor}, inset 0 0 5px ${neonColor}, 0 4px 8px rgba(0,0,0,0.3)`
          : "0 2px 4px rgba(0,0,0,0.1)",
        background: isFiltered
          ? `radial-gradient(circle at center, ${neonColor}15 0%, transparent 70%)`
          : "none",
        transition:
          "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease, background 0.3s ease",
        fontWeight: isFiltered ? "500" : "400",
        ...style
      }}
    >
      {" "}
      <motion.div
        ref={numberRef}
        className="text-xs text-left"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0.7 }}
        whileHover={
          isFiltered
            ? {
                opacity: 1,
                scale: 1.2,
                x: 1,
                transition: { duration: 0.2 },
              }
            : {}
        }
        transition={{ duration: 0.2 }}
      >
        <span>{element.number}</span>
      </motion.div>      <div className="text-center mt-auto">
        {" "}
        <motion.div
          ref={symbolRef}
          className={`${isFiltered ? "text-2xl font-semibold" : "text-xl font-medium"}`}
          variants={symbolVariants}
          initial="initial"
          whileHover={isFiltered ? "hover" : ""}
          style={{
            textShadow: isFiltered
              ? `0 0 4px ${neonColor}, 0 0 8px ${neonColor}, 0 2px 4px rgba(0, 0, 0, 0.5)`
              : "0 1px 2px rgba(0, 0, 0, 0.3)",
            letterSpacing: "0.03em",
            transition:
              "text-shadow 0.3s ease, transform 0.3s ease, color 0.3s ease, font-weight 0.3s ease",
          }}
        >          {element.symbol}
        </motion.div>
      </div>
      
      {/* Comparison mode indicator */}
      {comparisonMode && isFiltered && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 border border-white flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      )}
      
      {/* Selected for comparison indicator */}
      {isInComparison && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border border-white flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

ElementCard.propTypes = {
  element: PropTypes.shape({
    number: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    xpos: PropTypes.number.isRequired,
    ypos: PropTypes.number.isRequired,
  }).isRequired,
  isFiltered: PropTypes.bool,
  isInComparison: PropTypes.bool,
  comparisonMode: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default ElementCard;
