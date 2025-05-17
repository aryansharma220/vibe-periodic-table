import React from 'react';
import PropTypes from 'prop-types';
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
  return (
    <div
      className={`${elementStyle} p-1.5 min-h-14 flex flex-col justify-between cursor-pointer hover:scale-105 transition-all duration-300 ${textStyle}`}
      onClick={onClick}
      onMouseEnter={isFiltered ? onMouseEnter : null}
      onMouseLeave={isFiltered ? onMouseLeave : null}style={{
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
      <div className="text-center mt-auto">
        <div 
          className={`${isFiltered ? "text-2xl font-normal" : "text-xl"}`} 
          style={{
            textShadow: isFiltered ? `0 0 4px ${neonColor}, 0 0 6px ${neonColor}` : 'none',
            letterSpacing: '0.03em',
          }}
        >
          {element.symbol}
        </div>
      </div>
    </div>
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
