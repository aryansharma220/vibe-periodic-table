import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { getNeonColor } from '../utils/elementUtils';

/**
 * ElementDetailsModal component displays detailed information about a selected element
 */
function ElementDetailsModal({ element, onClose }) {
  // Get neon color for this element
  const neonColor = getNeonColor(element.category);
  
  // Refs for GSAP animations
  const modalRef = useRef(null);
  const symbolRef = useRef(null);
  const headerRef = useRef(null);
  const contentRefs = useRef([]);
  
  // Add to content refs collection
  const addToContentRefs = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };
  
  // GSAP animations when modal opens
  useEffect(() => {
    // Animate the modal entrance
    gsap.fromTo(
      modalRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
    
    // Animate the symbol with a glow effect
    gsap.fromTo(
      symbolRef.current,
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.6,
        ease: "back.out(1.7)" 
      }
    );
    
    // Create a pulsing glow effect
    gsap.to(symbolRef.current, {
      boxShadow: `0 0 20px ${neonColor}, inset 0 0 15px ${neonColor}`,
      repeat: -1,
      yoyo: true,
      duration: 1.5
    });
    
    // Animate header with a slide-in effect
    gsap.fromTo(
      headerRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay: 0.2 }
    );
    
    // Animate content sections one by one with stagger
    gsap.fromTo(
      contentRefs.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.15, 
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out" 
      }
    );
    
    return () => {
      // Cleanup animation timelines
      gsap.killTweensOf([modalRef.current, symbolRef.current, headerRef.current, ...contentRefs.current]);
    };
  }, [neonColor]);

  // Modal animation variants for Framer Motion
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
      initial="hidden"
      animate="visible"
      variants={backdropVariants}
    >
      <div
        ref={modalRef}
        className="bg-white/10 dark:bg-black/20 backdrop-blur-md border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-gray-800 dark:text-white"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: neonColor,
          boxShadow: `0 0 15px ${neonColor}, inset 0 0 10px ${neonColor}`
        }}
      >        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div 
              ref={symbolRef}
              className="bg-white/20 dark:bg-black/20 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold"
              style={{ position: 'relative' }}
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    `0 0 4px ${neonColor}, 0 0 6px ${neonColor}`, 
                    `0 0 8px ${neonColor}, 0 0 12px ${neonColor}, 0 0 16px ${neonColor}`, 
                    `0 0 4px ${neonColor}, 0 0 6px ${neonColor}`
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {element.symbol}
              </motion.span>
              
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: [
                    `0 0 5px ${neonColor}`,
                    `0 0 10px ${neonColor}, 0 0 15px ${neonColor}`,
                    `0 0 5px ${neonColor}`
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
            <div ref={headerRef}>
              <motion.h2 
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {element.name}
              </motion.h2>
              <motion.p 
                className="text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                #{element.number} • {element.category}
              </motion.p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="bg-white/20 dark:bg-black/20 rounded-full p-2 text-gray-700 dark:text-white hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            ref={addToContentRefs}
            className="bg-white/10 dark:bg-black/10 rounded-lg p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ 
              boxShadow: `0 0 15px ${neonColor}`, 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <h3 className="font-bold text-lg mb-2 border-b border-white/20 dark:border-white/10 pb-1">Physical Properties</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Atomic Number:</span> {element.number}</p>
              <p><span className="font-semibold">Atomic Mass:</span> {element.atomic_mass}</p>
              <p><span className="font-semibold">Period:</span> {element.period}</p>
              <p><span className="font-semibold">Group:</span> {element.group}</p>
              <p><span className="font-semibold">Phase:</span> {element.phase}</p>
              <p><span className="font-semibold">Density:</span> {element.density} g/cm³</p>
            </div>
          </motion.div>          <motion.div 
            ref={addToContentRefs}
            className="bg-white/10 dark:bg-black/10 rounded-lg p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ 
              boxShadow: `0 0 15px ${neonColor}`, 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <h3 className="font-bold text-lg mb-2 border-b border-white/20 dark:border-white/10 pb-1">Electronic Properties</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Electron Configuration:</span> {element.electron_configuration}</p>
              <p><span className="font-semibold">Electronegativity:</span> {element.electronegativity_pauling}</p>
              <p><span className="font-semibold">Discovered by:</span> {element.discovered_by || 'Unknown'}</p>
              <p><span className="font-semibold">Named by:</span> {element.named_by || 'Unknown'}</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 bg-white/10 dark:bg-black/10 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-2 border-b border-white/20 dark:border-white/10 pb-1">Summary:</h3>
          <p>{element.summary}</p>        </div>
      </div>
    </motion.div>
  );
}

ElementDetailsModal.propTypes = {
  element: PropTypes.shape({
    number: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    atomic_mass: PropTypes.number.isRequired,
    period: PropTypes.number,
    group: PropTypes.number,
    phase: PropTypes.string,
    density: PropTypes.number,
    electron_configuration: PropTypes.string,
    electronegativity_pauling: PropTypes.number,
    discovered_by: PropTypes.string,
    named_by: PropTypes.string,
    summary: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default ElementDetailsModal;
