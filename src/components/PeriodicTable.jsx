import { useState, useEffect, useRef } from 'react';

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
  }, []);
  
  // Helper function to determine element background color based on category
  const getCategoryColor = (category) => {
    const categoryColors = {
      'noble gas': 'bg-purple-300',
      'alkali metal': 'bg-red-300',
      'alkaline earth metal': 'bg-orange-300',
      'transition metal': 'bg-yellow-200',
      'post-transition metal': 'bg-green-200',
      'metalloid': 'bg-teal-200',
      'nonmetal': 'bg-blue-200',
      'halogen': 'bg-indigo-200',
      'lanthanoid': 'bg-pink-200',
      'actinoid': 'bg-rose-200',
      'unknown': 'bg-gray-200',
    };
    
    return categoryColors[category?.toLowerCase()] || 'bg-gray-200';
  };

  // Loading and error states
  if (loading) return <div className="flex justify-center items-center h-screen">Loading periodic table data...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  
  // Extract unique categories and phases for filters
  const uniqueCategories = [...new Set(elements.map(element => element.category))].sort();
  const uniqueStates = [...new Set(elements.map(element => element.phase))].sort();

  return (
    <div ref={wrapperRef} className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Interactive Periodic Table</h1>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 max-w-[1200px] mx-auto">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Box */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Elements</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, symbol or atomic number"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* State Filter */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Filter by State</label>
              <select
                id="state"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredElements.length} of {elements.length} elements
            {(searchTerm || filterCategory || filterState) && (
              <button 
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
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
        {filteredElements.map(element => (
          <ElementCard 
            key={element.number} 
            element={element}
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
        ))}
      </div>
      
      {/* Element Category Legend */}
      <CategoryLegend />
      
      {/* Modal for selected element details */}
      {selectedElement && (
        <ElementDetailsModal 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
        />
      )}
      
      {/* Tooltip for hover info */}
      {hoveredElement && (
        <div 
          ref={tooltipRef}
          className="fixed bg-white border border-gray-300 shadow-lg rounded-md p-3 z-50 w-64"
          style={{
            pointerEvents: 'none',
            transform: 'translate(0, -100%)',
            marginTop: '-10px'
          }}
        >
          <div className="font-bold text-lg flex items-center gap-2">
            <span className={`w-4 h-4 inline-block ${getCategoryColor(hoveredElement.category)}`}></span>
            {hoveredElement.name} ({hoveredElement.symbol})
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1 text-sm">
            <p>Atomic #: {hoveredElement.number}</p>
            <p>Mass: {hoveredElement.atomic_mass.toFixed(2)}</p>
            <p>State: {hoveredElement.phase}</p>
            <p>Category: {hoveredElement.category}</p>
          </div>
          <p className="text-xs mt-1 text-gray-600">Click for more details</p>
        </div>
      )}
    </div>
  );
}

// Element Card Component
function ElementCard({ element, onMouseEnter, onMouseLeave, onClick }) {
  // Get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      'noble gas': 'bg-purple-300',
      'alkali metal': 'bg-red-300',
      'alkaline earth metal': 'bg-orange-300',
      'transition metal': 'bg-yellow-200',
      'post-transition metal': 'bg-green-200',
      'metalloid': 'bg-teal-200',
      'nonmetal': 'bg-blue-200',
      'halogen': 'bg-indigo-200',
      'lanthanoid': 'bg-pink-200',
      'actinoid': 'bg-rose-200',
      'unknown': 'bg-gray-200',
    };
    
    return categoryColors[category?.toLowerCase()] || 'bg-gray-200';
  };
  
  return (
    <div 
      className={`${getCategoryColor(element.category)} border border-gray-300 p-2 min-h-16 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ gridColumn: element.xpos, gridRow: element.ypos }}
    >
      <div className="flex justify-between text-xs">
        <span>{element.number}</span>
        <span className="font-semibold">{element.atomic_mass.toFixed(2)}</span>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold">{element.symbol}</div>
        <div className="text-xs truncate">{element.name}</div>
      </div>
    </div>
  );
}

// Element Details Modal Component
function ElementDetailsModal({ element, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{element.name} ({element.symbol})</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <p><span className="font-semibold">Atomic Number:</span> {element.number}</p>
            <p><span className="font-semibold">Atomic Mass:</span> {element.atomic_mass}</p>
            <p><span className="font-semibold">Category:</span> {element.category}</p>
            <p><span className="font-semibold">Period:</span> {element.period}</p>
            <p><span className="font-semibold">Group:</span> {element.group}</p>
            <p><span className="font-semibold">Phase:</span> {element.phase}</p>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <p><span className="font-semibold">Electron Configuration:</span> {element.electron_configuration}</p>
            <p><span className="font-semibold">Electronegativity:</span> {element.electronegativity_pauling}</p>
            <p><span className="font-semibold">Discovered by:</span> {element.discovered_by || 'Unknown'}</p>
            <p><span className="font-semibold">Named by:</span> {element.named_by || 'Unknown'}</p>
            <p><span className="font-semibold">Density:</span> {element.density} g/cm³</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Summary:</h3>
          <p>{element.summary}</p>
        </div>
      </div>
    </div>
  );
}

// Category Legend Component
function CategoryLegend() {
  const categories = [
    { name: 'Noble Gas', color: 'bg-purple-300' },
    { name: 'Alkali Metal', color: 'bg-red-300' },
    { name: 'Alkaline Earth Metal', color: 'bg-orange-300' },
    { name: 'Transition Metal', color: 'bg-yellow-200' },
    { name: 'Post-Transition Metal', color: 'bg-green-200' },
    { name: 'Metalloid', color: 'bg-teal-200' },
    { name: 'Nonmetal', color: 'bg-blue-200' },
    { name: 'Halogen', color: 'bg-indigo-200' },
    { name: 'Lanthanoid', color: 'bg-pink-200' },
    { name: 'Actinoid', color: 'bg-rose-200' },
  ];
  
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {categories.map(category => (
        <div key={category.name} className="flex items-center">
          <div className={`${category.color} w-4 h-4 mr-1 border border-gray-300`}></div>
          <span className="text-xs">{category.name}</span>
        </div>
      ))}
    </div>
  );
}

export default PeriodicTable;