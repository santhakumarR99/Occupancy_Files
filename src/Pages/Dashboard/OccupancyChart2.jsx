import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../../Components/Styles/LiveChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getColorByValue = (value) => {
  if (value <= 500) return "#28a745";
  if (value <= 800) return "#ffc107";
  return "#dc3545"; // Red
};

const getTypeByValue = (value) => {
  if (value <= 500) return "Low";
  if (value <= 800) return "Medium";
  return "High";
};

const LiveOccupancyChart2 = ({ data = [] }) => {
  const [visibleTypes, setVisibleTypes] = useState({
    Low: true,
    Medium: true,
    High: true,
  });

  const chartRef = useRef();

  // Filter data based on checkbox visibility
  const filteredData = data.filter(
    (item) => visibleTypes[getTypeByValue(item.Occupancy)]
  );

  const chartData = {
    labels: filteredData.map((item) => item.ZoneName),
    datasets: [
      {
        label: "Occupancy",
        data: filteredData.map((item) => item.Occupancy),
        backgroundColor: filteredData.map((item) =>
          getColorByValue(item.Occupancy)
        ),
      },
    ],
  };

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom", // Below chart
      align: "center",    // Center align
      labels: {
        boxWidth: 20,
        padding: 15,
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          const index = tooltipItems[0].dataIndex;
          const item = filteredData[index];
          return `${item.ZoneName}`;
        },
        label: (tooltipItem) => {
          const item = filteredData[tooltipItem.dataIndex];
          return [
            `In: ${item.Incount}`,
            `Out: ${item.Outcount}`,
            `Occupancy: ${item.Occupancy}`,
          ];
        },
      },
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: "COUNTS",
      },
      beginAtZero: true,
    },
    x: {
      title: {
        display: true,
        text: "ZONE NAME",
      },
      ticks: {
        autoSkip: false,
        maxRotation: 30,
        minRotation: 10,
      },
    },
  },
};

  const handleCheckboxChange = (type) => {
    setVisibleTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div>
      {/* Custom Checkbox Legend */}
      <div className="legend-container">
        {["Low", "Medium", "High"].map((type) => (
          <label key={type} className="legend-item">
            <input
              type="checkbox"
              checked={visibleTypes[type]}
              onChange={() => handleCheckboxChange(type)}
            />
            <span
              className="legend-label"
              style={{
                color: getColorByValue(
                  type === "Low" ? 400 : type === "Medium" ? 700 : 900
                ),
              }}
            >
              {type}
            </span>
          </label>
        ))}
      </div>

      {/* Chart */}
      <Bar ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default LiveOccupancyChart2;
