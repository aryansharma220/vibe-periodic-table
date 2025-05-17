import { useState, useEffect, useRef } from "react";
import ElementCard from "./ElementCard";
import ElementDetailsModal from "./ElementDetailsModal";
import CategoryLegend from "./CategoryLegend";
import { getNeonColor } from "../utils/elementUtils";

function PeriodicTable() {
  // State hooks
  const [elements, setElements] = useState([]);
  const [filteredElements, setFilteredElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterState, setFilterState] = useState("");

  // Refs
  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setElements(data.elements);
        setFilteredElements(data.elements);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching periodic table data:", err);
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
        result = result.filter(
          (element) =>
            element.name.toLowerCase().includes(searchLower) ||
            element.symbol.toLowerCase().includes(searchLower) ||
            String(element.number).includes(searchTerm)
        );
      }

      // Apply category filter
      if (filterCategory) {
        result = result.filter(
          (element) =>
            element.category.toLowerCase() === filterCategory.toLowerCase()
        );
      }

      // Apply state filter (solid, liquid, gas)
      if (filterState) {
        result = result.filter(
          (element) => element.phase.toLowerCase() === filterState.toLowerCase()
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
      wrapper.addEventListener("mouseleave", handleMouseLeave);
      return () => wrapper.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, []); // Loading error state checks
  // Loading and error states
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-800 dark:text-gray-200">
        Loading periodic table data...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  // Extract unique categories and phases for filters
  const uniqueCategories = [
    ...new Set(elements.map((element) => element.category)),
  ].sort();
  const uniqueStates = [
    ...new Set(elements.map((element) => element.phase)),
  ].sort();
  return (
    <div
      ref={wrapperRef}
      className="p-4 text-gray-800 dark:text-gray-200 pt-16 min-h-screen"
    >
      {" "}
      <div
        className="bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-2xl py-6 px-4 mb-8 max-w-[1200px] mx-auto border border-cyan-500/20 shadow-lg"
        style={{
          boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(24,24,27,0.05) 100%)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {" "}
        <h1
          className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white"
          style={{
            textShadow:
              "0 1px 2px rgba(0, 0, 0, 0.1), 0 0 4px rgba(0, 255, 255, 0.2)",
            letterSpacing: "0.5px",
          }}
        >
          Interactive Periodic Table
        </h1>
        <p
          className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          style={{
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
          }}
        >
          Explore the chemical elements with this interactive periodic table
          featuring a glass design
        </p>
      </div>
      {/* Search and Filter Controls */}{" "}
      <div className="mb-8 max-w-[1200px] mx-auto">
        {" "}
        <div
          className="backdrop-blur-md p-5 rounded-xl shadow-lg"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(24,24,27,0.06) 100%)",
            boxShadow:
              "0 6px 20px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            {/* Search Box */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-800 dark:text-white mb-2"
              >
                Search Elements
              </label>
              <div className="relative">
                {" "}
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, symbol or atomic number"
                  className="w-full p-3 pl-10 rounded-lg focus:ring-1 focus:ring-cyan-300/50 focus:border-transparent focus:outline-none backdrop-blur-md text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
                <div className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-800 dark:text-white mb-2"
              >
                Filter by Category
              </label>
              <div className="relative">
                {" "}
                <select
                  id="category"
                  className="w-full p-3 rounded-lg focus:ring-1 focus:ring-cyan-300/50 focus:border-transparent focus:outline-none backdrop-blur-md text-gray-800 dark:text-white appearance-none cursor-pointer"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <option value="" className="bg-white dark:bg-gray-800">
                    All Categories
                  </option>
                  {uniqueCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-white dark:bg-gray-800"
                    >
                      {category}
                    </option>
                  ))}
                </select>
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.05))",
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            {/* State Filter */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-800 dark:text-white mb-2"
              >
                Filter by State
              </label>
              <div className="relative">
                {" "}
                <select
                  id="state"
                  className="w-full p-3 rounded-lg focus:ring-1 focus:ring-cyan-300/50 focus:border-transparent focus:outline-none backdrop-blur-md text-gray-800 dark:text-white appearance-none cursor-pointer"
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <option value="" className="bg-white dark:bg-gray-800">
                    All States
                  </option>
                  {uniqueStates.map((state) => (
                    <option
                      key={state}
                      value={state}
                      className="bg-white dark:bg-gray-800"
                    >
                      {state}
                    </option>
                  ))}
                </select>
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.05))",
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Results count */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-800 dark:text-gray-200">
              Showing{" "}
              <span className="font-bold">{filteredElements.length}</span> of{" "}
              <span className="font-bold">{elements.length}</span> elements
            </div>
            {(searchTerm || filterCategory || filterState) && (
              <button
                className="bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all px-4 py-2 rounded-full text-gray-800 dark:text-white font-medium border border-white/30 dark:border-white/10"
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                }}
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                  setFilterState("");
                }}
              >
                <div className="flex items-center gap-1">
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
                  Clear Filters
                </div>
              </button>
            )}
          </div>
        </div>
      </div>{" "}
      {/* Periodic Table Grid */}{" "}
      <div className="grid grid-cols-18 gap-2.5 max-w-[1300px] mx-auto px-4">
        {elements.map((element) => {
          const isFiltered =
            searchTerm || filterCategory || filterState
              ? filteredElements.some((e) => e.number === element.number)
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
                  y: e.clientY - 10,
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
      )}{" "}
      {/* Tooltip for hover info */}
      {hoveredElement && (
        <div
          ref={tooltipRef}
          className={`fixed bg-white/10 dark:bg-black/20 backdrop-blur-md border rounded-lg p-4 z-50 w-72`}
          style={{
            pointerEvents: "none",
            transform: "translate(0, -100%)",
            marginTop: "-10px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: getNeonColor(hoveredElement.category),
            boxShadow: `0 0 10px ${getNeonColor(
              hoveredElement.category
            )}, inset 0 0 5px ${getNeonColor(hoveredElement.category)}`,
          }}
        >
          <div className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-white mb-2">
            <div className="rounded-full bg-white/30 dark:bg-black/30 w-8 h-8 flex items-center justify-center">
              {hoveredElement.symbol}
            </div>
            <span>{hoveredElement.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-800 dark:text-white">
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">
              Atomic #: {hoveredElement.number}
            </p>
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">
              Mass: {hoveredElement.atomic_mass.toFixed(2)}
            </p>
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">
              State: {hoveredElement.phase}
            </p>
            <p className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1.5 rounded">
              Category: {hoveredElement.category}
            </p>
          </div>
          <p className="text-xs mt-3 text-center font-medium text-gray-800 dark:text-white/80 bg-white/20 dark:bg-white/10 rounded-full py-1 px-3 inline-block">
            Click for more details
          </p>
        </div>
      )}
    </div>
  );
}

export default PeriodicTable;
