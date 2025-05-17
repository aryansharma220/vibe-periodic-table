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
    <div className="mt-8 max-w-[1200px] mx-auto p-4">
      <div
        className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-white/10 shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-center font-bold mb-3 text-gray-800 dark:text-white">
          Element Categories
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center bg-white/10 dark:bg-black/10 rounded-full px-3 py-1.5 backdrop-blur-sm"
              style={{
                borderColor: category.color,
                boxShadow: `0 0 5px ${category.color}`,
                border: `1px solid ${category.color}`,
              }}
            >
              <div
                className="w-4 h-4 mr-2 rounded-full"
                style={{
                  boxShadow: `0 0 5px ${category.color}, inset 0 0 3px ${category.color}`,
                  border: `1px solid ${category.color}`,
                }}
              ></div>
              <span
                className="text-xs font-medium text-gray-800 dark:text-white"
                style={{ textShadow: `0 0 2px ${category.color}` }}
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
