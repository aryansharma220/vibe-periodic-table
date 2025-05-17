import React from 'react';
import PropTypes from 'prop-types';
import { getNeonColor } from '../utils/elementUtils';

/**
 * ElementDetailsModal component displays detailed information about a selected element
 */
function ElementDetailsModal({ element, onClose }) {
  // Get neon color for this element
  const neonColor = getNeonColor(element.category);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div
        className="bg-white/10 dark:bg-black/20 backdrop-blur-md border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-gray-800 dark:text-white"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: neonColor,
          boxShadow: `0 0 15px ${neonColor}, inset 0 0 10px ${neonColor}`
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 dark:bg-black/20 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {element.symbol}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{element.name}</h2>
              <p className="text-gray-700 dark:text-gray-300">#{element.number} • {element.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 dark:bg-black/20 rounded-full p-2 text-gray-700 dark:text-white hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-bold text-lg mb-2 border-b border-white/20 dark:border-white/10 pb-1">Physical Properties</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Atomic Number:</span> {element.number}</p>
              <p><span className="font-semibold">Atomic Mass:</span> {element.atomic_mass}</p>
              <p><span className="font-semibold">Period:</span> {element.period}</p>
              <p><span className="font-semibold">Group:</span> {element.group}</p>
              <p><span className="font-semibold">Phase:</span> {element.phase}</p>
              <p><span className="font-semibold">Density:</span> {element.density} g/cm³</p>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-bold text-lg mb-2 border-b border-white/20 dark:border-white/10 pb-1">Electronic Properties</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Electron Configuration:</span> {element.electron_configuration}</p>
              <p><span className="font-semibold">Electronegativity:</span> {element.electronegativity_pauling}</p>
              <p><span className="font-semibold">Discovered by:</span> {element.discovered_by || 'Unknown'}</p>
              <p><span className="font-semibold">Named by:</span> {element.named_by || 'Unknown'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white/10 dark:bg-black/10 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-2 border-b border-white/20 dark:border-white/10 pb-1">Summary:</h3>
          <p>{element.summary}</p>
        </div>
      </div>
    </div>
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
