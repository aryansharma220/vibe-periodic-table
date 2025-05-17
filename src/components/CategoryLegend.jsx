function CategoryLegend() {
  const categories = [
    { name: "Noble Gas", color: "purple" },
    { name: "Alkali Metal", color: "red" },
    { name: "Alkaline Earth Metal", color: "orange" },
    { name: "Transition Metal", color: "gold" },
    { name: "Post-Transition Metal", color: "green" },
    { name: "Metalloid", color: "teal" },
    { name: "Nonmetal", color: "blue" },
    { name: "Halogen", color: "indigo" },
    { name: "Lanthanide", color: "pink" },
    { name: "Actinide", color: "fuchsia" },
  ];

  return (
    <div className="mt-8 max-w-[1200px] mx-auto p-4">      <div
        className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-white/10 shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)",
          boxShadow: "0 12px 36px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
          fontWeight: "500",
        }}
      >
        <h3 className="text-center font-bold mb-3 text-gray-800 dark:text-white">
          Element Categories
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (              <div
              key={category.name}
              className="flex items-center bg-white/10 dark:bg-black/10 rounded-full px-3 py-1.5 backdrop-blur-sm"
              style={{
                borderColor: category.color,
                boxShadow: `0 0 6px ${category.color}, 0 3px 8px rgba(0,0,0,0.25)`,
                border: `1.5px solid ${category.color}`,
                transform: "translateY(-1px)",
              }}
            >              <div
                className="w-4 h-4 mr-2 rounded-full"
                style={{
                  boxShadow: `0 0 7px ${category.color}, inset 0 0 4px ${category.color}, 0 2px 4px rgba(0,0,0,0.2)`,
                  border: `1px solid ${category.color}`,
                }}
              ></div>
              <span
                className="text-xs font-medium text-gray-800 dark:text-white"
                style={{ 
                  textShadow: `0 0 2px ${category.color}, 0 1px 2px rgba(0,0,0,0.3)`,
                  fontWeight: "600"
                }}
              >
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryLegend;
