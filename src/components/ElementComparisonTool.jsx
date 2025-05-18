import React, { useRef, useEffect, useState } from "react";
import { useComparison } from "../contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { getNeonColor } from "../utils/elementUtils";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Atom3DModel from "./Atom3DModel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ElementComparisonTool() {
  const {
    elementsToCompare,
    isComparisonOpen,
    closeComparison,
    removeFromComparison,
    hasSeenTutorial,
    dismissTutorial,
  } = useComparison();
  const [activeTab, setActiveTab] = useState("properties");
  const [activeVisType, setActiveVisType] = useState("bar");
  const modalRef = useRef(null);
  const compareContentRef = useRef(null);
  const compareTableRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (activeVisType === "radar") {
      setActiveVisType("bar");
    }
  }, [activeVisType]);

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
            ease: "power2.out",
          }
        );
      }
    }
  }, [isComparisonOpen]);
  const propertiesToVisualize = [
    {
      key: "atomic_mass",
      label: "Atomic Mass (u)",
      unit: "u",
      description:
        "Average mass of atoms of an element, measured in atomic mass units",
    },
    {
      key: "density",
      label: "Density",
      unit: "g/cm³",
      description: "Mass per unit volume",
    },
    {
      key: "electronegativity_pauling",
      label: "Electronegativity",
      unit: "",
      description: "Ability to attract electrons in a chemical bond",
    },
    {
      key: "electron_affinity",
      label: "Electron Affinity",
      unit: "eV",
      description: "Energy change when an electron is added to a neutral atom",
    },
    {
      key: "ionization_energy",
      label: "Ionization Energy",
      unit: "eV",
      description: "Energy required to remove an electron from a neutral atom",
    },
    {
      key: "boil",
      label: "Boiling Point",
      unit: "K",
      description: "Temperature at which element boils at standard pressure",
    },
    {
      key: "melt",
      label: "Melting Point",
      unit: "K",
      description: "Temperature at which element melts at standard pressure",
    },
    {
      key: "molar_heat",
      label: "Molar Heat",
      unit: "J/(mol·K)",
      description: "Amount of energy needed to raise 1 mole by 1 kelvin",
    },
  ];
  const getComparisonChartData = () => {
    if (elementsToCompare.length !== 2) return null;

    const element1 = elementsToCompare[0];
    const element2 = elementsToCompare[1];

    const validProperties = propertiesToVisualize.filter(
      (prop) =>
        element1[prop.key] &&
        element2[prop.key] &&
        !isNaN(parseFloat(element1[prop.key])) &&
        !isNaN(parseFloat(element2[prop.key]))
    );

    const sortedProperties = [...validProperties].sort((a, b) => {
      const diff1 = Math.abs(
        parseFloat(element1[a.key]) - parseFloat(element2[a.key])
      );
      const diff2 = Math.abs(
        parseFloat(element1[b.key]) - parseFloat(element2[b.key])
      );
      return diff2 - diff1;
    });

    const topProperties = sortedProperties.slice(0, 6);

    const percentDifferences = topProperties.map((prop) => {
      const val1 = parseFloat(element1[prop.key]);
      const val2 = parseFloat(element2[prop.key]);
      const percentDiff = (
        (Math.abs(val1 - val2) / Math.min(val1, val2)) *
        100
      ).toFixed(1);
      return {
        property: prop,
        percentDiff: percentDiff,
      };
    });

    const color1 = getNeonColor(element1.category);
    const color2 = getNeonColor(element2.category);

    const gradient1 = `linear-gradient(180deg, ${color1}90 0%, ${color1}40 100%)`;
    const gradient2 = `linear-gradient(180deg, ${color2}90 0%, ${color2}40 100%)`;

    return {
      labels: topProperties.map((prop) => prop.label),
      datasets: [
        {
          label: element1.name,
          data: topProperties.map((prop) => parseFloat(element1[prop.key])),
          backgroundColor: color1 + "80",
          borderColor: color1,
          borderWidth: 2,
          hoverBackgroundColor: color1 + "A0",
          hoverBorderColor: color1,
          borderRadius: 6,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: color1 + "40",
        },
        {
          label: element2.name,
          data: topProperties.map((prop) => parseFloat(element2[prop.key])),
          backgroundColor: color2 + "80",
          borderColor: color2,
          borderWidth: 2,
          hoverBackgroundColor: color2 + "A0",
          hoverBorderColor: color2,
          borderRadius: 6,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: color2 + "40",
        },
      ],
      properties: topProperties,
      percentDifferences: percentDifferences,
    };
  };

  const getNormalizedChartData = () => {
    if (elementsToCompare.length !== 2) return null;

    const element1 = elementsToCompare[0];
    const element2 = elementsToCompare[1];

    const validProperties = propertiesToVisualize.filter(
      (prop) =>
        element1[prop.key] &&
        element2[prop.key] &&
        !isNaN(parseFloat(element1[prop.key])) &&
        !isNaN(parseFloat(element2[prop.key]))
    );

    const normalizedData = validProperties.map((prop) => {
      const val1 = parseFloat(element1[prop.key]);
      const val2 = parseFloat(element2[prop.key]);
      const max = Math.max(val1, val2);

      return {
        property: prop,
        values: [
          max > 0 ? (val1 / max) * 100 : 0,
          max > 0 ? (val2 / max) * 100 : 0,
        ],
        rawValues: [val1, val2],
      };
    });

    return {
      labels: normalizedData.map((item) => item.property.label),
      datasets: [
        {
          label: element1.name,
          data: normalizedData.map((item) => item.values[0]),
          backgroundColor: `${getNeonColor(element1.category)}40`,
          borderColor: getNeonColor(element1.category),
          borderWidth: 2,
          pointBackgroundColor: getNeonColor(element1.category),
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: getNeonColor(element1.category),
          pointRadius: 4,
        },
        {
          label: element2.name,
          data: normalizedData.map((item) => item.values[1]),
          backgroundColor: `${getNeonColor(element2.category)}40`,
          borderColor: getNeonColor(element2.category),
          borderWidth: 2,
          pointBackgroundColor: getNeonColor(element2.category),
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: getNeonColor(element2.category),
          pointRadius: 4,
        },
      ],
      properties: validProperties,
      rawValues: normalizedData.map((item) => item.rawValues),
    };
  };

  const getPolarChartData = () => {
    if (elementsToCompare.length !== 2) return null;

    const element = elementsToCompare[0];
    const electronicProperties = [
      { key: "electrons", label: "Electrons", derive: (e) => e.number },
      {
        key: "neutrons",
        label: "Neutrons",
        derive: (e) => Math.round(e.atomic_mass - e.number),
      },
      { key: "protons", label: "Protons", derive: (e) => e.number },
      {
        key: "valence_electrons",
        label: "Valence e⁻",
        derive: getValenceElectrons,
      },
    ];

    const data = electronicProperties
      .map((prop) => ({
        label: prop.label,
        value: prop.derive(element),
        color: adjustColor(
          getNeonColor(element.category),
          electronicProperties.indexOf(prop)
        ),
      }))
      .filter((item) => !isNaN(item.value) && item.value > 0);

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: data.map((item) => `${item.color}90`),
          borderColor: data.map((item) => item.color),
          borderWidth: 1,
          hoverBackgroundColor: data.map((item) => `${item.color}B0`),
          hoverBorderColor: data.map((item) => `${item.color}`),
        },
      ],
    };
  };

  const getValenceElectrons = (element) => {
    if (!element.group) return null;
    if (element.group <= 2) return element.group;
    if (element.group >= 13) return element.group - 10;
    return element.group > 2 && element.group < 13 ? 2 : null;
  };

  const adjustColor = (baseColor, index) => {
    const colorMap = {
      red: ["#FF5252", "#FF8A80", "#FF1744", "#D50000"],
      blue: ["#536DFE", "#8C9EFF", "#3D5AFE", "#304FFE"],
      green: ["#69F0AE", "#B9F6CA", "#00E676", "#00C853"],
      purple: ["#E040FB", "#EA80FC", "#D500F9", "#AA00FF"],
      orange: ["#FFAB40", "#FFD180", "#FF9100", "#FF6D00"],
      teal: ["#64FFDA", "#A7FFEB", "#1DE9B6", "#00BFA5"],
      indigo: ["#7C4DFF", "#B388FF", "#651FFF", "#6200EA"],
      pink: ["#FF80AB", "#FF4081", "#F50057", "#C51162"],
      gold: ["#FFD700", "#FFCC33", "#FFDF00", "#FFC000"],
      fuchsia: ["#F0F", "#FF40FF", "#FF00FF", "#CC00CC"],
      gray: ["#9E9E9E", "#BDBDBD", "#757575", "#616161"],
    };

    const colorName =
      Object.keys(colorMap).find((name) => baseColor.includes(name)) || "blue";
    return colorMap[colorName][index % 4];
  };

  const formatValueWithUnit = (value, unit) => {
    // Format based on unit type
    if (value === undefined || value === null) return "—";

    // Handle large numbers
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M ${unit || ""}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k ${unit || ""}`;
    }

    // Format based on unit type
    switch (unit) {
      case "K": // Temperature
        return `${value.toFixed(1)} K`;
      case "eV": // Energy
        return `${value.toFixed(2)} eV`;
      case "g/cm³": // Density
        return `${value.toFixed(3)} g/cm³`;
      case "u": // Atomic mass
        return `${value.toFixed(3)} u`;
      case "J/(mol·K)": // Molar heat
        return `${value.toFixed(2)} J/(mol·K)`;
      default:
        return value.toLocaleString();
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: {
            family: "system-ui",
            weight: "600",
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(20, 20, 20, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: {
          family: "system-ui",
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          family: "system-ui",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        callbacks: {
          title: function (tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function (context) {
            const datasetLabel = context.dataset.label || "";
            const value = context.parsed.y || context.parsed || 0;
            const propertyIndex = context.dataIndex;
            const chartData = getComparisonChartData();
            const property = chartData?.properties?.[propertyIndex];
            const unit = property?.unit || "";
            const percentDiff =
              chartData?.percentDifferences?.[propertyIndex]?.percentDiff;
            let label = `${datasetLabel}: ${value.toLocaleString()}${
              unit ? " " + unit : ""
            }`;

            if (percentDiff) {
              const otherValue =
                context.datasetIndex === 0
                  ? chartData.datasets[1].data[propertyIndex]
                  : chartData.datasets[0].data[propertyIndex];

              const comparison = value > otherValue ? "higher" : "lower";

              return [label, `${comparison} by ${percentDiff}%`];
            }

            return label;
          },
          labelTextColor: function (context) {
            const colorSet =
              context.datasetIndex === 0
                ? getNeonColor(elementsToCompare[0]?.category)
                : getNeonColor(elementsToCompare[1]?.category);
            return colorSet;
          },
        },
      },
      title: {
        display: true,
        text: "Key Property Comparison",
        color: "rgba(255, 255, 255, 0.8)",
        font: {
          family: "system-ui",
          size: 16,
          weight: "normal",
        },
        padding: {
          top: 0,
          bottom: 15,
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
          lineWidth: 0.5,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "system-ui",
            size: 11,
          },
          padding: 8,
          callback: function (value) {
            // Format large numbers with k, M suffixes
            if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
            if (value >= 1000) return (value / 1000).toFixed(1) + "k";
            return value;
          },
        },
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)",
          font: {
            family: "system-ui",
            weight: "500",
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    layout: {
      padding: {
        top: 5,
        right: 20,
        bottom: 5,
        left: 10,
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
      },
    },
  };

  const getIndividualPropertyChartData = () => {
    if (elementsToCompare.length !== 2) return null;

    const element1 = elementsToCompare[0];
    const element2 = elementsToCompare[1];

    const validProperties = propertiesToVisualize.filter(
      (prop) =>
        element1[prop.key] &&
        element2[prop.key] &&
        !isNaN(parseFloat(element1[prop.key])) &&
        !isNaN(parseFloat(element2[prop.key]))
    );

    return validProperties.map((prop) => {
      const val1 = parseFloat(element1[prop.key]);
      const val2 = parseFloat(element2[prop.key]);

      const percentDiff = (
        (Math.abs(val1 - val2) / Math.min(val1, val2)) *
        100
      ).toFixed(1);

      const color1 = getNeonColor(element1.category);
      const color2 = getNeonColor(element2.category);

      return {
        property: prop,
        data: {
          labels: [element1.name, element2.name],
          datasets: [
            {
              data: [val1, val2],
              backgroundColor: [color1 + "80", color2 + "80"],
              borderColor: [color1, color2],
              borderWidth: 2,
              hoverBackgroundColor: [color1 + "A0", color2 + "A0"],
              hoverBorderColor: [color1, color2],
              borderRadius: 6,
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              shadowBlur: 10,
              shadowColor: [color1 + "40", color2 + "40"],
            },
          ],
        },
        percentDiff: percentDiff,
        rawValues: [val1, val2],
      };
    });
  };

  const getPropertyChartOptions = (property) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
      },
      indexAxis: "y", // Horizontal bar chart
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(20, 20, 20, 0.9)",
          titleColor: "#fff",
          bodyColor: "#fff",
          titleFont: {
            family: "system-ui",
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            family: "system-ui",
            size: 12,
          },
          padding: 12,
          cornerRadius: 8,
          boxPadding: 6,
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].dataset.label || tooltipItems[0].label;
            },
            label: function (context) {
              const value = context.parsed.x;
              return formatValueWithUnit(value, property.unit);
            },
          },
        },
        title: {
          display: true,
          text: property.label,
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            family: "system-ui",
            size: 16,
            weight: "normal",
          },
          padding: {
            top: 0,
            bottom: 10,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.08)",
            lineWidth: 0.5,
            drawBorder: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: {
              family: "system-ui",
              size: 11,
            },
            padding: 8,
            callback: function (value) {
              // Format large numbers with k, M suffixes
              if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
              if (value >= 1000) return (value / 1000).toFixed(1) + "k";
              return value;
            },
          },
          title: {
            display: true,
            text: property.unit
              ? `${property.label} (${property.unit})`
              : property.label,
            color: "rgba(255, 255, 255, 0.6)",
            font: {
              family: "system-ui",
              size: 12,
            },
            padding: {
              top: 10,
            },
          },
          beginAtZero: true,
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.9)",
            font: {
              family: "system-ui",
              weight: "500",
              size: 12,
            },
          },
        },
      },
      layout: {
        padding: {
          top: 5,
          right: 15,
          bottom: 15,
          left: 5,
        },
      },
      elements: {
        bar: {
          borderRadius: 6,
          borderSkipped: false,
        },
      },
    };
  };

  const barChartData = getComparisonChartData();
  const individualChartData = getIndividualPropertyChartData();

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape" && isComparisonOpen) {
        closeComparison();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isComparisonOpen, closeComparison]);

  const propertiesToCompare = [
    {
      key: "number",
      label: "Atomic Number",
      description: "The number of protons in the nucleus of an atom",
    },
    {
      key: "name",
      label: "Element Name",
      description: "The name of the chemical element",
    },
    {
      key: "symbol",
      label: "Symbol",
      description: "Chemical symbol from the periodic table",
    },
    {
      key: "category",
      label: "Category",
      description: "Chemical category/family of the element",
    },
    {
      key: "atomic_mass",
      label: "Atomic Mass (u)",
      description:
        "Average mass of atoms of an element, measured in atomic mass units",
    },
    {
      key: "period",
      label: "Period",
      description: "Row position in the periodic table",
    },
    {
      key: "group",
      label: "Group",
      description: "Column position in the periodic table",
    },
    {
      key: "phase",
      label: "Phase at STP",
      description:
        "Physical state (solid, liquid, gas) at standard temperature and pressure",
    },
    {
      key: "density",
      label: "Density (g/cm³)",
      description: "Mass per unit volume",
    },
    {
      key: "electronegativity_pauling",
      label: "Electronegativity (Pauling)",
      description: "Ability to attract electrons in a chemical bond",
    },
    {
      key: "electron_configuration",
      label: "Electron Configuration",
      description: "Arrangement of electrons in the atomic orbitals",
    },
    {
      key: "discovered_by",
      label: "Discovered By",
      description: "Person or team credited with element discovery",
    },
    {
      key: "named_by",
      label: "Named By",
      description: "Person or entity who named the element",
    },
    {
      key: "appearance",
      label: "Appearance",
      description: "Physical appearance of the element in its standard state",
    },
    {
      key: "molar_heat",
      label: "Molar Heat",
      description: "Amount of energy needed to raise 1 mole by 1 kelvin",
    },
    {
      key: "boil",
      label: "Boiling Point (K)",
      description: "Temperature at which element boils at standard pressure",
    },
    {
      key: "melt",
      label: "Melting Point (K)",
      description: "Temperature at which element melts at standard pressure",
    },
  ];

  if (!isComparisonOpen) {
    return null;
  }

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
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
              boxShadow:
                "0 15px 35px rgba(0,0,0,0.4), 0 3px 10px rgba(0,0,0,0.3), inset 0 0 1px rgba(255,255,255,0.3)",
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
                  <h3 className="font-semibold text-blue-100">
                    How to Compare Elements
                  </h3>
                  <button
                    onClick={dismissTutorial}
                    className="text-blue-200 hover:text-white"
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
                </div>{" "}
                <ul className="list-disc pl-5 text-sm text-blue-100 space-y-1">
                  <li>
                    View detailed property comparison in the "Properties" tab
                  </li>
                  <li>
                    Switch to "Visualize" tab to explore interactive visual
                    comparisons
                  </li>{" "}
                  <li>
                    Try different visualization types: Bar Chart and Atomic
                    Structure
                  </li>
                  <li>You can add up to 2 elements for comparison</li>
                  <li>
                    Click the remove button (X) to remove an element from
                    comparison
                  </li>
                </ul>
              </div>
            )}

            {/* Comparison content */}
            <div ref={compareContentRef}>
              {elementsToCompare.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 dark:text-gray-300">
                    No elements selected for comparison. Select elements from
                    the periodic table.
                  </p>
                </div>
              ) : elementsToCompare.length === 1 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Select one more element to compare with{" "}
                    <span className="font-bold">
                      {elementsToCompare[0].name}
                    </span>
                    .
                  </p>
                  <div className="mt-4">
                    <ComparisonCard
                      element={elementsToCompare[0]}
                      onRemove={removeFromComparison}
                    />
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
                  </div>{" "}
                  {/* Main Tabs */}
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
                              <div
                                className="absolute left-full ml-2 z-10 w-60 p-3 bg-gray-800/90 text-white text-xs rounded shadow-lg 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none"
                              >
                                {property.description}
                              </div>
                            </td>
                            {elementsToCompare.map((element) => {
                              const value1 = String(
                                element[property.key] || "—"
                              );
                              const value2 = String(
                                elementsToCompare.find(
                                  (e) => e.number !== element.number
                                )?.[property.key] || "—"
                              );
                              const isDifferent =
                                value1 !== value2 &&
                                value1 !== "—" &&
                                value2 !== "—";

                              return (
                                <td
                                  key={`${element.number}-${property.key}`}
                                  className={`py-3 px-4 text-gray-800 dark:text-white ${
                                    isDifferent ? "font-medium" : ""
                                  }`}
                                  style={{
                                    textShadow:
                                      property.key === "symbol"
                                        ? `0 0 3px ${getNeonColor(
                                            element.category
                                          )}`
                                        : isDifferent
                                        ? `0 0 1px ${getNeonColor(
                                            element.category
                                          )}`
                                        : "none",
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
                    <div className="mt-6">
                      {/* Visualization tabs */}
                      <div className="flex justify-center gap-2 mb-6">
                        {" "}
                        <button
                          onClick={() => setActiveVisType("bar")}
                          className={`px-4 py-1.5 rounded-full text-sm ${
                            activeVisType === "bar"
                              ? "bg-white/20 text-white shadow-inner font-medium"
                              : "bg-white/10 text-gray-300 hover:bg-white/15"
                          }`}
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Bar Chart
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveVisType("atomic")}
                          className={`px-4 py-1.5 rounded-full text-sm ${
                            activeVisType === "atomic"
                              ? "bg-white/20 text-white shadow-inner font-medium"
                              : "bg-white/10 text-gray-300 hover:bg-white/15"
                          }`}
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
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            Atomic Structure
                          </div>
                        </button>
                      </div>{" "}
                      {/* Visualization content */}
                      <div
                        ref={chartRef}
                        className={`${
                          activeVisType === "atomic" || activeVisType === "bar"
                            ? "h-auto"
                            : "h-80"
                        } relative`}
                      >
                        {elementsToCompare.length !== 2 ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-center text-gray-500 dark:text-gray-400">
                              Please select two elements to compare
                            </p>
                          </div>
                        ) : (
                          <>
                            {" "}
                            {activeVisType === "bar" && individualChartData && (
                              <>
                                <div className="overflow-y-auto max-h-[600px] pr-2">
                                  <div className="mt-5 p-3 bg-white/5 dark:bg-black/20 rounded-lg border border-white/10 mb-5">
                                    <div className="flex items-center gap-2 mb-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-cyan-400"
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
                                      <h3 className="text-sm font-medium text-white">
                                        Property Comparison Insights
                                      </h3>
                                    </div>
                                    <div className="text-xs text-gray-300">
                                      <p className="mb-1">
                                        These charts show individual property
                                        comparisons between
                                        <span className="text-white font-medium mx-1">
                                          {elementsToCompare[0]?.name}
                                        </span>{" "}
                                        and
                                        <span className="text-white font-medium mx-1">
                                          {elementsToCompare[1]?.name}
                                        </span>
                                      </p>
                                      <p>
                                        Each graph has been optimized to display
                                        its specific unit type. Hover over bars
                                        to see exact values.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-6">
                                    {individualChartData.map(
                                      (propertyData, index) => (
                                        <div
                                          key={propertyData.property.key}
                                          className="h-52 glassmorphism p-3 rounded-lg border border-white/20"
                                        >
                                          {" "}
                                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 text-xs text-gray-300">
                                            <span className="mb-1 sm:mb-0">
                                              {
                                                propertyData.property
                                                  .description
                                              }
                                            </span>
                                            {propertyData.percentDiff && (
                                              <span className="bg-white/10 px-2 py-0.5 rounded-full text-cyan-300">
                                                <span className="font-medium">
                                                  {Math.abs(
                                                    propertyData.rawValues[0] -
                                                      propertyData.rawValues[1]
                                                  ) > 0.01
                                                    ? propertyData
                                                        .rawValues[0] >
                                                      propertyData.rawValues[1]
                                                      ? `${elementsToCompare[0].name} higher by `
                                                      : `${elementsToCompare[1].name} higher by `
                                                    : "Difference: "}
                                                </span>
                                                {propertyData.percentDiff}%
                                              </span>
                                            )}
                                          </div>
                                          <Bar
                                            data={propertyData.data}
                                            options={getPropertyChartOptions(
                                              propertyData.property
                                            )}
                                            plugins={[
                                              {
                                                id: `chartGlow-${index}`,
                                                beforeDraw: function (chart) {
                                                  // Add glow effect to the chart
                                                  const ctx = chart.ctx;
                                                  ctx.shadowColor =
                                                    "rgba(120, 255, 255, 0.2)";
                                                  ctx.shadowBlur = 15;
                                                },
                                              },
                                            ]}
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                            {activeVisType === "atomic" && (
                              <>
                                <div className="mb-4 p-3 bg-white/5 dark:bg-black/20 rounded-lg border border-white/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-cyan-400"
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
                                    <h3 className="text-sm font-medium text-white">
                                      Interactive 3D Atomic Models
                                    </h3>
                                  </div>
                                  <p className="text-xs text-gray-300">
                                    These 3D models represent the atomic
                                    structure of each element. Drag to rotate
                                    the view, scroll to zoom in/out. Electrons
                                    (white) orbit around the nucleus, which
                                    contains protons and neutrons.
                                  </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                  {elementsToCompare.map((element, index) => (
                                    <div
                                      key={element.number}
                                      className="flex-1"
                                    >
                                      <div className="text-center mb-2 font-medium text-white flex items-center justify-center gap-2">
                                        <span
                                          style={{
                                            color: getNeonColor(
                                              element.category
                                            ),
                                            textShadow: `0 0 5px ${getNeonColor(
                                              element.category
                                            )}`,
                                          }}
                                        >
                                          {element.symbol}
                                        </span>
                                        <span>
                                          {element.name} Atomic Structure
                                        </span>
                                      </div>
                                      <div
                                        className="h-[400px] glassmorphism rounded-lg p-3 border shiny-border"
                                        style={{
                                          borderColor: `${getNeonColor(
                                            element.category
                                          )}40`,
                                        }}
                                      >
                                        <Atom3DModel
                                          element={element}
                                          elementColor={getNeonColor(
                                            element.category
                                          )}
                                          size={350}
                                        />
                                      </div>
                                      <div className="text-center mt-4 bg-white/5 dark:bg-black/20 p-2 rounded-lg border border-white/10">
                                        <p className="text-sm text-gray-300 font-mono">
                                          {element.electron_configuration}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                          <div className="bg-white/5 dark:bg-black/10 p-2 rounded">
                                            <span className="text-gray-400">
                                              Protons:
                                            </span>{" "}
                                            <span className="text-white font-medium">
                                              {element.number}
                                            </span>
                                          </div>
                                          <div className="bg-white/5 dark:bg-black/10 p-2 rounded">
                                            <span className="text-gray-400">
                                              Neutrons:
                                            </span>{" "}
                                            <span className="text-white font-medium">
                                              {Math.round(
                                                element.atomic_mass -
                                                  element.number
                                              )}
                                            </span>
                                          </div>
                                          <div className="bg-white/5 dark:bg-black/10 p-2 rounded">
                                            <span className="text-gray-400">
                                              Electrons:
                                            </span>{" "}
                                            <span className="text-white font-medium">
                                              {element.number}
                                            </span>
                                          </div>
                                          <div className="bg-white/5 dark:bg-black/10 p-2 rounded">
                                            <span className="text-gray-400">
                                              Atomic Mass:
                                            </span>{" "}
                                            <span className="text-white font-medium">
                                              {element.atomic_mass.toFixed(3)} u
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}{" "}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
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

function ComparisonCard({ element, onRemove }) {
  const neonColor = getNeonColor(element.category);
  const cardRef = useRef(null);
  const symbolRef = useRef(null);

  useEffect(() => {
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
              <span className="text-gray-800 dark:text-white">
                {element.period}
              </span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Group:</span>{" "}
              <span className="text-gray-800 dark:text-white">
                {element.group || "—"}
              </span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Phase:</span>{" "}
              <span className="text-gray-800 dark:text-white">
                {element.phase}
              </span>
            </div>
            <div className="bg-white/10 dark:bg-black/20 px-2 py-1 rounded">
              <span className="text-gray-500 dark:text-gray-400">Mass:</span>{" "}
              <span className="text-gray-800 dark:text-white">
                {element.atomic_mass.toFixed(2)}
              </span>
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
