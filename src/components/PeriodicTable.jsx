import { useState, useEffect, useRef } from "react";
import ElementCard from "./ElementCard";
import ElementDetailsModal from "./ElementDetailsModal";
import CategoryLegend from "./CategoryLegend";
import ElementComparisonTool from "./ElementComparisonTool";
import { getNeonColor } from "../utils/elementUtils";
import { useComparison } from "../contexts/ComparisonContext";

function PeriodicTable() {
  const [elements, setElements] = useState([]);
  const [filteredElements, setFilteredElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterState, setFilterState] = useState("");

  const {
    addToComparison,
    elementsToCompare,
    comparisonMode,
    toggleComparisonMode,
    openComparison,
    clearComparison,
  } = useComparison();

  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);

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

  useEffect(() => {
    if (!elements.length) return;

    let result = [...elements];

    const isFilterActive = searchTerm || filterCategory || filterState;

    if (isFilterActive) {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(
          (element) =>
            element.name.toLowerCase().includes(searchLower) ||
            element.symbol.toLowerCase().includes(searchLower) ||
            String(element.number).includes(searchTerm)
        );
      }

      if (filterCategory) {
        result = result.filter(
          (element) =>
            element.category.toLowerCase() === filterCategory.toLowerCase()
        );
      }

      if (filterState) {
        result = result.filter(
          (element) => element.phase.toLowerCase() === filterState.toLowerCase()
        );
      }
    }

    setFilteredElements(result);
  }, [elements, searchTerm, filterCategory, filterState]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (hoveredElement && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      tooltip.style.left = `${mousePosition.x}px`;
      tooltip.style.top = `${mousePosition.y}px`;

      const rect = tooltip.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        tooltip.style.left = `${window.innerWidth - rect.width - 10}px`;
      }
      if (rect.top < 0) {
        tooltip.style.top = `${10}px`;
      }
    }
  }, [hoveredElement, mousePosition]);

  useEffect(() => {
    const handleMouseLeave = () => setHoveredElement(null);
    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.addEventListener("mouseleave", handleMouseLeave);
      return () => wrapper.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-800 dark:text-gray-200">
        Loading periodic table data...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  const uniqueCategories = [
    ...new Set(elements.map((element) => element.category)),
  ].sort();
  const uniqueStates = [
    ...new Set(elements.map((element) => element.phase)),
  ].sort();
  return (
    <div
      ref={wrapperRef}
      className="p-4 text-gray-800 dark:text-gray-200 pt-16 min-h-screen custom-scrollbar"
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
        </div>{" "}
      </div>
      {/* Comparison controls */}
      <div className="flex justify-between items-center max-w-[1300px] mx-auto px-5 py-4 mb-2">
        <div className="flex items-center gap-3">
          {/* Comparison mode toggle button */}
          <button
            onClick={toggleComparisonMode}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105
              ${
                comparisonMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                  : "bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 text-gray-700 dark:text-gray-200"
              } border ${
              comparisonMode
                ? "border-cyan-400/50"
                : "border-white/30 dark:border-white/10"
            }`}
            aria-label={
              comparisonMode ? "Exit comparison mode" : "Compare elements"
            }
            style={{
              boxShadow: comparisonMode
                ? "0 0 15px rgba(6, 182, 212, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.3)"
                : "0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                comparisonMode
                  ? "text-white"
                  : "text-cyan-400 dark:text-cyan-300"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="font-medium">
              {comparisonMode ? "Exit Comparison" : "Compare Elements"}
            </span>
          </button>

          {comparisonMode && (
            <div className="text-gray-600 dark:text-gray-300 text-sm bg-white/10 dark:bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Select up to 2 elements to compare
              </span>
            </div>
          )}
        </div>

        {/* Selected elements pills */}
        <div className="flex items-center gap-2">
          {elementsToCompare.length > 0 && (
            <div className="flex items-center gap-2">
              {elementsToCompare.map((element) => (
                <div
                  key={element.number}
                  className="bg-white/20 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border"
                  style={{
                    borderColor: getNeonColor(element.category),
                    boxShadow: `0 0 5px ${getNeonColor(element.category)}`,
                  }}
                >
                  <span className="text-gray-800 dark:text-white font-medium">
                    {element.symbol}
                  </span>
                  <button
                    onClick={() => removeFromComparison(element.number)}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    aria-label={`Remove ${element.name} from comparison`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {elementsToCompare.length > 1 && (
                <button
                  onClick={openComparison}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md backdrop-blur-md"
                  style={{
                    boxShadow: "0 0 10px rgba(124, 58, 237, 0.5)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                  }}
                >
                  Compare Now
                </button>
              )}

              {elementsToCompare.length > 0 && (
                <button
                  onClick={clearComparison}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  aria-label="Clear comparison"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Periodic Table Grid */}
      <div className="grid grid-cols-18 gap-4 max-w-[1500px] mx-auto px-4">        {elements.map((element) => {
          const isFiltered =
            searchTerm || filterCategory || filterState
              ? filteredElements.some((e) => e.number === element.number)
              : true;

          const isInComparison = elementsToCompare.some(
            (e) => e.number === element.number
          );

          return (
            <ElementCard
              key={element.number}
              element={element}
              isFiltered={isFiltered}
              isInComparison={isInComparison}
              comparisonMode={comparisonMode}
              onMouseEnter={(e) => {
                setHoveredElement(element);
                setMousePosition({
                  x: e.clientX + 15,
                  y: e.clientY - 10,
                });
              }}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => {
                if (comparisonMode) {
                  addToComparison(element);
                } else {
                  setSelectedElement(element);
                }
              }}
              style={
                isInComparison
                  ? {
                      boxShadow: `0 0 15px ${getNeonColor(
                        element.category
                      )}, 0 0 25px ${getNeonColor(element.category)}`,
                      borderColor: "#ffffff",
                      transform: "scale(1.1)",
                      zIndex: 20,
                    }
                  : {}
              }
            />
          );
        })}
      </div>
      <CategoryLegend />
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
          </div>{" "}
          <p className="text-xs mt-3 text-center font-medium text-gray-800 dark:text-white/80 bg-white/20 dark:bg-white/10 rounded-full py-1 px-3 inline-block">
            {comparisonMode
              ? "Click to add to comparison"
              : "Click on the for more details"}
          </p>
        </div>
      )}
      <ElementComparisonTool />
    </div>
  );
}

export default PeriodicTable;
