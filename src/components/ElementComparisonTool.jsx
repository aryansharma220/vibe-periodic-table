import React, { useRef, useEffect, useState } from "react";
import { useComparison } from "../contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { getNeonColor } from "../utils/elementUtils";
import PropTypes from "prop-types";

function ElementComparisonTool() {
  const { 
    elementsToCompare, 
    isComparisonOpen, 
    closeComparison, 
    removeFromComparison,
    hasSeenTutorial,
    dismissTutorial
  } = useComparison();
  
  const [activeTab, setActiveTab] = useState("properties");
  const modalRef = useRef(null);
  const compareContentRef = useRef(null);
  const compareTableRef = useRef(null);
  const chartRef = useRef(null);

  // GSAP animations when modal opens
  useEffect(() => {
    if (isComparisonOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        compareContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );

      // Animate table rows appearing
      if (compareTableRef.current) {
        const rows = compareTableRef.current.querySelectorAll("tr");
        gsap.fromTo(
          rows,
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.3, 
            stagger: 0.05,
            delay: 0.3,
            ease: "power2.out" 
          }
        );
      }
    }
  }, [isComparisonOpen]);

  // Create chart visualization when tab changes to visualization
  useEffect(() => {
    if (activeTab === "visualization" && chartRef.current && elementsToCompare.length === 2) {
      // Clear previous chart
      chartRef.current.innerHTML = '';
      
      // Properties to visualize
      const properties = [
        { key: "atomic_mass", label: "Atomic Mass" },
        { key: "density", label: "Density" },
        { key: "electronegativity_pauling", label: "Electronegativity" },
        { key: "electron_affinity", label: "Electron Affinity" },
        { key: "ionization_energy", label: "Ionization Energy" }
      ];
      
      // Create chart for each property
      properties.forEach(prop => {
        if (elementsToCompare[0][prop.key] && elementsToCompare[1][prop.key]) {
          createComparisonBar(
            prop.key, 
            prop.label, 
            elementsToCompare[0], 
            elementsToCompare[1]
          );
        }
      });
    }
  }, [activeTab, elementsToCompare]);

  // Function to create comparison bar
  const createComparisonBar = (propKey, propLabel, element1, element2) => {
    if (!chartRef.current) return;
    
    const val1 = parseFloat(element1[propKey]);
    const val2 = parseFloat(element2[propKey]);
    
    if (isNaN(val1) || isNaN(val2)) return;
    
    // Normalize values (using simple ratio for visualization)
    const max = Math.max(val1, val2);
    const width1 = (val1 / max) * 100;
    const width2 = (val2 / max) * 100;
    
    const chartItem = document.createElement('div');
    chartItem.className = 'mb-6';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'mb-2 text-gray-600 dark:text-gray-300 font-medium';
    labelEl.textContent = propLabel;
    
    const barContainer = document.createElement('div');
    barContainer.className = 'flex items-center space-x-2';
    
    // Create bar 1
    const bar1Container = document.createElement('div');
    bar1Container.className = 'flex-1';
    
    const bar1Label = document.createElement('div');
    bar1Label.className = 'flex justify-between text-sm mb-1';
    bar1Label.innerHTML = `
      <span class="font-medium">${element1.symbol}</span>
      <span>${val1}</span>
    `;
    
    const bar1 = document.createElement('div');
    bar1.className = 'h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden';
    
    const bar1Fill = document.createElement('div');
    bar1Fill.className = 'h-full rounded-full';
    bar1Fill.style.width = `${width1}%`;
    bar1Fill.style.backgroundColor = getNeonColor(element1.category);
    bar1Fill.style.boxShadow = `0 0 8px ${getNeonColor(element1.category)}`;
    
    bar1.appendChild(bar1Fill);
    bar1Container.appendChild(bar1Label);
    bar1Container.appendChild(bar1);
    
    // Create bar 2
    const bar2Container = document.createElement('div');
    bar2Container.className = 'flex-1';
    
    const bar2Label = document.createElement('div');
    bar2Label.className = 'flex justify-between text-sm mb-1';
    bar2Label.innerHTML = `
      <span class="font-medium">${element2.symbol}</span>
      <span>${val2}</span>
    `;
    
    const bar2 = document.createElement('div');
    bar2.className = 'h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden';
    
    const bar2Fill = document.createElement('div');
    bar2Fill.className = 'h-full rounded-full';
    bar2Fill.style.width = `${width2}%`;
    bar2Fill.style.backgroundColor = getNeonColor(element2.category);
    bar2Fill.style.boxShadow = `0 0 8px ${getNeonColor(element2.category)}`;
    
    bar2.appendChild(bar2Fill);
    bar2Container.appendChild(bar2Label);
    bar2Container.appendChild(bar2);
    
    // Combine elements
    barContainer.appendChild(bar1Container);
    barContainer.appendChild(bar2Container);
    
    chartItem.appendChild(labelEl);
    chartItem.appendChild(barContainer);
    
    chartRef.current.appendChild(chartItem);
  };

  // Handle escape key press
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape" && isComparisonOpen) {
        closeComparison();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isComparisonOpen, closeComparison]);

  // Properties to compare with clear descriptions
  const propertiesToCompare = [
    { key: "number", label: "Atomic Number", description: "The number of protons in the nucleus of an atom" },
    { key: "name", label: "Element Name", description: "The name of the chemical element" },
    { key: "symbol", label: "Symbol", description: "Chemical symbol from the periodic table" },
    { key: "category", label: "Category", description: "Chemical category/family of the element" },
    { key: "atomic_mass", label: "Atomic Mass (u)", description: "Average mass of atoms of an element, measured in atomic mass units" },
    { key: "period", label: "Period", description: "Row position in the periodic table" },
    { key: "group", label: "Group", description: "Column position in the periodic table" },
    { key: "phase", label: "Phase at STP", description: "Physical state (solid, liquid, gas) at standard temperature and pressure" },
    { key: "density", label: "Density (g/cm³)", description: "Mass per unit volume" },
    { key: "electronegativity_pauling", label: "Electronegativity (Pauling)", description: "Ability to attract electrons in a chemical bond" },
    { key: "electron_configuration", label: "Electron Configuration", description: "Arrangement of electrons in the atomic orbitals" },
    { key: "discovered_by", label: "Discovered By", description: "Person or team credited with element discovery" },
    { key: "named_by", label: "Named By", description: "Person or entity who named the element" },
    { key: "appearance", label: "Appearance", description: "Physical appearance of the element in its standard state" },
    { key: "molar_heat", label: "Molar Heat", description: "Amount of energy needed to raise 1 mole by 1 kelvin" },
    { key: "boil", label: "Boiling Point (K)", description: "Temperature at which element boils at standard pressure" },
    { key: "melt", label: "Melting Point (K)", description: "Temperature at which element melts at standard pressure" },
  ];

  if (!isComparisonOpen) {
    return null;
  }

  // Modal animation variants for Framer Motion
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isComparisonOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={() => closeComparison()}
        >
          {/* Modal content */}
          <motion.div
            ref={modalRef}
            className="relative max-w-5xl w-full bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-white/10 shadow-xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 3px 10px rgba(0,0,0,0.3), inset 0 0 1px rgba(255,255,255,0.3)",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeComparison}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 dark:hover:bg-black/30 transition-all"
              aria-label="Close comparison"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Element Comparison
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Compare properties of chemical elements side by side
              </p>
            </div>

            {/* First-time user tutorial */}
            {!hasSeenTutorial && elementsToCompare.length > 0 && (
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-300/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-blue-100">How to Compare Elements</h3>
                  <button 
                    onClick={dismissTutorial}
                    className="text-blue-200 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <ul className="list-disc pl-5 text-sm text-blue-100 space-y-1">
                  <li>View detailed property comparison in the "Properties" tab</li>
                  <li>Switch to "Visualize" tab to see graphical comparison of properties</li>
                  <li>You can add up to 2 elements for comparison</li>
                  <li>Click the remove button (X) to remove an element from comparison</li>
                </ul>
              </div>
            )}

            {/* Comparison content */}
            <div ref={compareContentRef}>
              {elementsToCompare.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 dark:text-gray-300">
                    No elements selected for comparison. Select elements from the periodic table.
                  </p>
                </div>
              ) : elementsToCompare.length === 1 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Select one more element to compare with{" "}
                    <span className="font-bold">{elementsToCompare[0].name}</span>.
                  </p>
                  <div className="mt-4">
                    <ComparisonCard element={elementsToCompare[0]} onRemove={removeFromComparison} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {elementsToCompare.map((element) => (
                      <ComparisonCard 
                        key={element.number} 
                        element={element} 
                        onRemove={removeFromComparison}
                      />
                    ))}
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-white/20 dark:border-white/10">
                    <nav className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab("properties")}
                        className={`py-2 px-4 ${
                          activeTab === "properties"
                            ? "border-b-2 border-cyan-500 text-gray-800 dark:text-white font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                      >
                        Properties
                      </button>
                      <button
                        onClick={() => setActiveTab("visualization")}
                        className={`py-2 px-4 ${
                          activeTab === "visualization"
                            ? "border-b-2 border-cyan-500 text-gray-800 dark:text-white font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                      >
                        Visualize
                      </button>
                    </nav>
                  </div>

                  {/* Tab content */}
                  {activeTab === "properties" ? (
                    <table ref={compareTableRef} className="w-full mt-4">
                      <thead className="border-b border-white/20 dark:border-white/10">
                        <tr>
                          <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Property
                          </th>
                          {elementsToCompare.map((element) => (
                            <th 
                              key={element.number}
                              className="text-left py-3 px-4 text-gray-800 dark:text-white font-semibold"
                            >
                              {element.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {propertiesToCompare.map((property) => (
                          <tr 
                            key={property.key}
                            className="border-b border-white/10 dark:border-white/5 hover:bg-white/5 dark:hover:bg-white/5 group"
                          >
                            <td className="relative py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                              {property.label}
                              {/* Property description tooltip */}
                              <div className="absolute left-full ml-2 z-10 w-60 p-3 bg-gray-800/90 text-white text-xs rounded shadow-lg 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none">
                                {property.description}
                              </div>
                            </td>
                            {elementsToCompare.map((element) => {
                              // Highlight differences between elements
                              const value1 = String(element[property.key] || "—");
                              const value2 = String(elementsToCompare.find(e => e.number !== element.number)?.[property.key] || "—");
                              const isDifferent = value1 !== value2 && value1 !== "—" && value2 !== "—";
                              
                              return (
                                <td 
                                  key={`${element.number}-${property.key}`}
                                  className={`py-3 px-4 text-gray-800 dark:text-white ${
                                    isDifferent ? "font-medium" : ""
                                  }`}
                                  style={{
                                    textShadow: property.key === "symbol" ? 
                                      `0 0 3px ${getNeonColor(element.category)}` : (
                                        isDifferent ? `0 0 1px ${getNeonColor(element.category)}` : "none"
                                      )
                                  }}
                                >
                                  {element[property.key] || "—"}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="mt-6" ref={chartRef}>
                      {/* Visualization content will be added here by useEffect */}
                      <p className="text-center text-gray-500 dark:text-gray-400 italic">
                        Comparing key properties visually...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Card component to display element in comparison tool
function ComparisonCard({ element, onRemove }) {
  const neonColor = getNeonColor(element.category);
  const cardRef = useRef(null);
  const symbolRef = useRef(null);

  useEffect(() => {
    // Animate card
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        scale: 0.9,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    // Animate symbol with glow effect
    gsap.to(symbolRef.current, {
      textShadow: `0 0 6px ${neonColor}, 0 0 8px ${neonColor}`,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf(symbolRef.current);
    };
  }, [neonColor]);

  return (
    <div 
      ref={cardRef}
      className="bg-white/20 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm relative border"
      style={{
        borderColor: neonColor,
        boxShadow: `0 0 10px ${neonColor}, 0 5px 15px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(element.number)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/30 transition-all text-gray-700 dark:text-gray-300"
        aria-label={`Remove ${element.name} from comparison`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Element info */}
      <div className="flex items-start gap-4">
        <div 
          className="flex items-center justify-center min-w-16 h-16 rounded-lg"
          style={{
            background: `radial-gradient(circle at center, ${neonColor}20 0%, transparent 70%)`,
            boxShadow: `0 0 8px ${neonColor}, inset 0 0 5px ${neonColor}`,
            border: `1px solid ${neonColor}`,
          }}
        >
          <div 
            ref={symbolRef}
            className="text-3xl font-bold text-gray-800 dark:text-white"
            style={{
              textShadow: `0 0 4px ${neonColor}, 0 0 8px ${neonColor}, 0 2px 4px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {element.symbol}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
            {element.name}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium mr-2">#{element.number}</span>
            <span>{element.category}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-xs">
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Period:</span>{" "}
              <span className="text-gray-800 dark:text-white">{element.period}</span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Group:</span>{" "}
              <span className="text-gray-800 dark:text-white">{element.group || "—"}</span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Phase:</span>{" "}
              <span className="text-gray-800 dark:text-white">{element.phase}</span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Mass:</span>{" "}
              <span className="text-gray-800 dark:text-white">{element.atomic_mass.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ComparisonCard.propTypes = {
  element: PropTypes.shape({
    number: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    atomic_mass: PropTypes.number.isRequired,
    period: PropTypes.number,
    group: PropTypes.number,
    phase: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ElementComparisonTool;
