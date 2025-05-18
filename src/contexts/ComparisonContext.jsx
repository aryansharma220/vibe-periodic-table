import { createContext, useContext, useState, useEffect } from "react";

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
  const [elementsToCompare, setElementsToCompare] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    const stored = localStorage.getItem("comparison-tutorial-seen");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "comparison-tutorial-seen",
      JSON.stringify(hasSeenTutorial)
    );
  }, [hasSeenTutorial]);

  const addToComparison = (element) => {
    setElementsToCompare((prev) => {
      const isAlreadyAdded = prev.some((e) => e.number === element.number);

      if (isAlreadyAdded) {
        return prev;
      }

      if (prev.length >= 2) {
        return [prev[1], element];
      }

      return [...prev, element];
    });
  };

  const removeFromComparison = (elementNumber) => {
    setElementsToCompare((prev) =>
      prev.filter((element) => element.number !== elementNumber)
    );
  };

  const clearComparison = () => {
    setElementsToCompare([]);
  };

  const toggleComparisonMode = () => {
    setComparisonMode((prev) => {
      if (prev) {
        clearComparison();
      }
      return !prev;
    });
  };

  const openComparison = () => {
    if (elementsToCompare.length > 0) {
      setIsComparisonOpen(true);
    }
  };

  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  const dismissTutorial = () => {
    setHasSeenTutorial(true);
  };

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
