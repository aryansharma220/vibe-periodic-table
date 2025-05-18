import { createContext, useContext, useState, useEffect } from "react";

// Create Comparison Context
const ComparisonContext = createContext();

// Hook to use the comparison context
export const useComparison = () => useContext(ComparisonContext);

// Comparison Provider Component
export const ComparisonProvider = ({ children }) => {
  // Store the elements to compare
  const [elementsToCompare, setElementsToCompare] = useState([]);
  // Track if the comparison modal is open
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  // Track if comparison mode is active
  const [comparisonMode, setComparisonMode] = useState(false);
  // Track if user has seen tutorial
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    const stored = localStorage.getItem("comparison-tutorial-seen");
    return stored ? JSON.parse(stored) : false;
  });

  // Save tutorial state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "comparison-tutorial-seen",
      JSON.stringify(hasSeenTutorial)
    );
  }, [hasSeenTutorial]);

  // Add element to comparison (max 2 elements)
  const addToComparison = (element) => {
    setElementsToCompare((prev) => {
      // Check if element is already in comparison
      const isAlreadyAdded = prev.some((e) => e.number === element.number);

      if (isAlreadyAdded) {
        return prev;
      }

      // If there are already 2 elements, replace the oldest one
      if (prev.length >= 2) {
        return [prev[1], element];
      }

      return [...prev, element];
    });
  };

  // Remove element from comparison
  const removeFromComparison = (elementNumber) => {
    setElementsToCompare((prev) =>
      prev.filter((element) => element.number !== elementNumber)
    );
  };

  // Clear all compared elements
  const clearComparison = () => {
    setElementsToCompare([]);
  };

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setComparisonMode((prev) => {
      if (prev) {
        // If turning off comparison mode, clear selected elements
        clearComparison();
      }
      return !prev;
    });
  };

  // Open comparison modal
  const openComparison = () => {
    if (elementsToCompare.length > 0) {
      setIsComparisonOpen(true);
    }
  };

  // Close comparison modal
  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  // Mark tutorial as seen
  const dismissTutorial = () => {
    setHasSeenTutorial(true);
  };

  // Value object provided to context consumers
  const value = {
    elementsToCompare,
    isComparisonOpen,
    comparisonMode,
    hasSeenTutorial,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparisonMode,
    openComparison,
    closeComparison,
    dismissTutorial,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
