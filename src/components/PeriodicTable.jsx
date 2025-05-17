import { useState, useEffect, useRef } from 'react';

// Utility function moved outside of components to be accessible globally
const getNeonColor = (category) => {
  const colors = {
    'noble gas': 'purple',
    'alkali metal': 'red',
    'alkaline earth metal': 'orange',
    'transition metal': 'yellow',
    'post-transition metal': 'green',
    'metalloid': 'teal',
    'nonmetal': 'blue',
    'halogen': 'indigo',
    'lanthanoid': 'pink',
    'actinoid': 'rose',
    'unknown': 'gray',
  };
  
  return colors[category?.toLowerCase()] || 'gray';
};

function PeriodicTable() {
  // State hooks
  const [elements, setElements] = useState([]);
  const [filteredElements, setFilteredElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterState, setFilterState] = useState('');
  
  // Refs
  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        setElements(data.elements);
        setFilteredElements(data.elements);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching periodic table data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Filter elements when search term or filters change
  useEffect(() => {
    if (!elements.length) return;
    
    let result = [...elements];
    
    // Check if any filter is active
    const isFilterActive = searchTerm || filterCategory || filterState;
    
    if (isFilterActive) {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(element => 
          element.name.toLowerCase().includes(searchLower) ||
          element.symbol.toLowerCase().includes(searchLower) ||
          String(element.number).includes(searchTerm)
        );
      }
      
      // Apply category filter
      if (filterCategory) {
        result = result.filter(element => 
          element.category.toLowerCase() === filterCategory.toLowerCase()
        );
      }
      
      // Apply state filter (solid, liquid, gas)
      if (filterState) {
        result = result.filter(element => 
          element.phase.toLowerCase() === filterState.toLowerCase()
        );
      }
    }
    
    setFilteredElements(result);
  }, [elements, searchTerm, filterCategory, filterState]);
  
  // Track mouse position for tooltip
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle tooltip positioning
  useEffect(() => {
    if (hoveredElement && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      tooltip.style.left = `${mousePosition.x}px`;
      tooltip.style.top = `${mousePosition.y}px`;
      
      // Keep tooltip in viewport
      const rect = tooltip.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        tooltip.style.left = `${window.innerWidth - rect.width - 10}px`;
      }
      if (rect.top < 0) {
        tooltip.style.top = `${10}px`;
      }
    }
  }, [hoveredElement, mousePosition]);
  
  // Clear hoveredElement when mouse leaves the component
  useEffect(() => {
    const handleMouseLeave = () => setHoveredElement(null);
    const wrapper = wrapperRef.current;
    
    if (wrapper) {
      wrapper.addEventListener('mouseleave', handleMouseLeave);
      return () => wrapper.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, []);  // Loading error state checks
  // Loading and error states
  if (loading) return <div className="flex justify-center items-center h-screen text-gray-800 dark:text-gray-200">Loading periodic table data...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  
  // Extract unique categories and phases for filters
  const uniqueCategories = [...new Set(elements.map(element => element.category))].sort();
  const uniqueStates = [...new Set(elements.map(element => element.phase))].sort();
  return (    <div ref={wrapperRef} className="p-4 text-gray-800 dark:text-gray-200 pt-16 min-h-screen">      <div 
        className="bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-2xl py-6 px-4 mb-8 max-w-[1200px] mx-auto border border-cyan-500/20 shadow-lg"
        style={{
          boxShadow: '0 0 3px rgba(0, 255, 255, 0.15)',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)'
        }}
      >
        <h1 
          className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white" 
          style={{
            textShadow: '0 0 1px rgba(0, 255, 255, 0.2)'
          }}
        >
          Interactive Periodic Table
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore the chemical elements with this interactive periodic table featuring a glass design
        </p>
      </div>
        {/* Search and Filter Controls */}      <div className="mb-8 max-w-[1200px] mx-auto">
        <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/30 dark:border-white/10"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)',
               boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
             }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Box */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">Search Elements</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, symbol or atomic number"
                  className="w-full p-3 pl-10 border border-white/30 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/10 dark:bg-black/20 backdrop-blur-md text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">Filter by Category</label>
              <div className="relative">
                <select
                  id="category"
                  className="w-full p-3 border border-white/30 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/10 dark:bg-black/20 backdrop-blur-md text-gray-800 dark:text-white appearance-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* State Filter */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">Filter by State</label>
              <div className="relative">
                <select
                  id="state"
                  className="w-full p-3 border border-white/30 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/10 dark:bg-black/20 backdrop-blur-md text-gray-800 dark:text-white appearance-none"
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                >
                  <option value="">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-800 dark:text-gray-200">
              Showing <span className="font-bold">{filteredElements.length}</span> of <span className="font-bold">{elements.length}</span> elements
            </div>
            {(searchTerm || filterCategory || filterState) && (
              <button 
                className="bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-colors px-4 py-2 rounded-full text-gray-800 dark:text-white font-medium border border-white/30 dark:border-white/10"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterState('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
        {/* Periodic Table Grid */}
      <div className="grid grid-cols-18 gap-1 max-w-[1200px] mx-auto">
        {elements.map(element => {
          const isFiltered = searchTerm || filterCategory || filterState 
            ? filteredElements.some(e => e.number === element.number)
            : true;
            
          return (
            <ElementCard 
              key={element.number} 
              element={element}
              isFiltered={isFiltered}
              onMouseEnter={(e) => {
                setHoveredElement(element);
                setMousePosition({ 
                  x: e.clientX + 15, 
                  y: e.clientY - 10 
                });
              }}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setSelectedElement(element)}
            />
          );
        })}
      </div>
      
      {/* Element Category Legend */}
      <CategoryLegend />
      
      {/* Modal for selected element details */}
      {selectedElement && (
        <ElementDetailsModal 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
        />
      )}      {/* Tooltip for hover info */}
      {hoveredElement && (
        <div 
          ref={tooltipRef}
          className={`fixed bg-white/10 dark:bg-black/20 backdrop-blur-md border rounded-lg p-4 z-50 w-72`}
          style={{
            pointerEvents: 'none',
            transform: 'translate(0, -100%)',
            marginTop: '-10px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: getNeonColor(hoveredElement.category),
            boxShadow: `0 0 10px ${getNeonColor(hoveredElement.category)}, inset 0 0 5px ${getNeonColor(hoveredElement.category)}`
          }}
        >
          <div className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-white mb-2">
            <div className="rounded-full bg-white/30 dark:bg-black/30 w-8 h-8 flex items-center justify-center">
              {hoveredElement.symbol}
            </div>
            <span>{hoveredElement.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-800 dark:text-white">
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">Atomic #: {hoveredElement.number}</p>
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">Mass: {hoveredElement.atomic_mass.toFixed(2)}</p>
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">State: {hoveredElement.phase}</p>
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">Category: {hoveredElement.category}</p>
          </div>
          <p className="text-xs mt-3 text-center font-medium text-gray-800 dark:text-white/80 bg-white/20 dark:bg-white/10 rounded-full py-1 px-3 inline-block">Click for more details</p>
        </div>
      )}
    </div>
  );
}

// Element Card Component
function ElementCard({ element, onMouseEnter, onMouseLeave, onClick, isFiltered = true }) {  // Get neon border color for each category
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
      className={`${elementStyle} p-2 min-h-16 flex flex-col justify-between cursor-pointer hover:scale-105 transition-all duration-300 ${textStyle}`}
      onClick={onClick}
      onMouseEnter={isFiltered ? onMouseEnter : null}
      onMouseLeave={isFiltered ? onMouseLeave : null}
      style={{ 
        gridColumn: element.xpos, 
        gridRow: element.ypos,
        backdropFilter: isFiltered ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isFiltered ? 'blur(8px)' : 'none',
        borderColor: isFiltered ? `${neonColor}` : 'rgba(255,255,255,0.1)',
        boxShadow: isFiltered ? `0 0 5px ${neonColor}, inset 0 0 5px ${neonColor}` : 'none',
        textShadow: isFiltered ? `0 0 2px ${neonColor}` : 'none'
      }}
    >      <div className="text-xs text-left">
        <span>{element.number}</span>
      </div>
      <div className="text-center mt-auto">
        <div className={`${isFiltered ? "text-2xl font-bold" : "text-xl"}`}>{element.symbol}</div>
      </div>
    </div>
  );
}

// Element Details Modal Component
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

// Category Legend Component
function CategoryLegend() {
  const categories = [
    { name: 'Noble Gas', color: 'purple' },
    { name: 'Alkali Metal', color: 'red' },
    { name: 'Alkaline Earth Metal', color: 'orange' },
    { name: 'Transition Metal', color: 'yellow' },
    { name: 'Post-Transition Metal', color: 'green' },
    { name: 'Metalloid', color: 'teal' },
    { name: 'Nonmetal', color: 'blue' },
    { name: 'Halogen', color: 'indigo' },
    { name: 'Lanthanoid', color: 'pink' },
    { name: 'Actinoid', color: 'rose' },
  ];
    return (
    <div className="mt-8 max-w-[1200px] mx-auto p-4">
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-white/10 shadow-lg"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
           }}>
        <h3 className="text-center font-bold mb-3 text-gray-800 dark:text-white">Element Categories</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <div 
              key={category.name} 
              className="flex items-center bg-white/10 dark:bg-black/10 rounded-full px-3 py-1.5 backdrop-blur-sm"
              style={{
                borderColor: category.color,
                boxShadow: `0 0 5px ${category.color}`,
                border: `1px solid ${category.color}`
              }}
            >
              <div 
                className="w-4 h-4 mr-2 rounded-full" 
                style={{ 
                  boxShadow: `0 0 5px ${category.color}, inset 0 0 3px ${category.color}`,
                  border: `1px solid ${category.color}`
                }}
              ></div>
              <span className="text-xs font-medium text-gray-800 dark:text-white" style={{ textShadow: `0 0 2px ${category.color}` }}>
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PeriodicTable;