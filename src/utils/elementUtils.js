/**
 * Gets the neon color for a specific element category
 * @param {string} category - The element category
 * @returns {string} - The color code for the category
 */
export const getNeonColor = (category) => {
  const colors = {
    "noble gas": "purple",
    "alkali metal": "red",
    "alkaline earth metal": "orange",
    "transition metal": "gold",
    "post-transition metal": "green",
    "metalloid": "teal",
    "nonmetal": "blue",
    "halogen": "indigo",
    "lanthanide": "pink",
    "actinide": "fuchsia",
    unknown: "gray",
  };

  return colors[category?.toLowerCase()] || "gray";
};
