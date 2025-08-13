// import React, { useEffect, useRef, useState } from "react";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import "../../Components/Styles/LiveChart.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const getColorByValue = (value) => {
//   if (value <= 500) return "#28a745";
//   if (value <= 800) return "#ffc107";
//   return "#dc3545"; // Red
// };

// const getTypeByValue = (value) => {
//   if (value <= 500) return "Low";
//   if (value <= 800) return "Medium";
//   return "High";
// };

// const LiveOccupancyChart2 = ({ data = [] }) => {
//   const [visibleTypes, setVisibleTypes] = useState({
//     Low: true,
//     Medium: true,
//     High: true,
//   });

//   const chartRef = useRef();

//   // Filter data based on checkbox visibility
//   const filteredData = data.filter(
//     (item) => visibleTypes[getTypeByValue(item.Occupancy)]
//   );

//   const chartData = {
//     labels: filteredData.map((item) => item.ZoneName),
//     datasets: [
//       {
//         label: "Occupancy",
//         data: filteredData.map((item) => item.Occupancy),
//         backgroundColor: filteredData.map((item) =>
//           getColorByValue(item.Occupancy)
//         ),
//       },
//     ],
//   };

// const chartOptions = {
//   responsive: true,
//   plugins: {
//     legend: {
//       display: true,
//       position: "bottom", // Below chart
//       align: "center",    // Center align
//       labels: {
//         boxWidth: 20,
//         padding: 15,
//         font: {
//           size: 14,
//         },
//       },
//     },
//     tooltip: {
//       callbacks: {
//         title: (tooltipItems) => {
//           const index = tooltipItems[0].dataIndex;
//           const item = filteredData[index];
//           return `${item.ZoneName}`;
//         },
//         label: (tooltipItem) => {
//           const item = filteredData[tooltipItem.dataIndex];
//           return [
//             `In: ${item.Incount}`,
//             `Out: ${item.Outcount}`,
//             `Occupancy: ${item.Occupancy}`,
//           ];
//         },
//       },
//     },
//   },
//   scales: {
//     y: {
//       title: {
//         display: true,
//         text: "COUNTS",
//       },
//       beginAtZero: true,
//     },
//     x: {
//       title: {
//         display: true,
//         text: "ZONE NAME",
//       },
//       ticks: {
//         autoSkip: false,
//         maxRotation: 30,
//         minRotation: 10,
//       },
//     },
//   },
// };

//   const handleCheckboxChange = (type) => {
//     setVisibleTypes((prev) => ({
//       ...prev,
//       [type]: !prev[type],
//     }));
//   };

//   return (
//     <div>
//       {/* Custom Checkbox Legend */}
//       <div className="legend-container">
//         {["Low", "Medium", "High"].map((type) => (
//           <label key={type} className="legend-item">
//             <input
//               type="checkbox"
//               checked={visibleTypes[type]}
//               onChange={() => handleCheckboxChange(type)}
//             />
//             <span
//               className="legend-label"
//               style={{
//                 color: getColorByValue(
//                   type === "Low" ? 400 : type === "Medium" ? 700 : 900
//                 ),
//               }}
//             >
//               {type}
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Chart */}
//       <Bar ref={chartRef} data={chartData} options={chartOptions} />
//     </div>
//   );
// };

// export default LiveOccupancyChart2;

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import "../../Components/Styles/LiveChart.css";

const getColorByValue = (value) => {
  if (value <= 500) return "#28a745"; // Green
  if (value <= 800) return "#ffc107"; // Yellow
  return "#dc3545"; // Red
};

const getTypeByValue = (value) => {
  if (value <= 500) return "Low";
  if (value <= 800) return "Medium";
  return "High";
};

const LiveOccupancyChart2 = ({ data }) => {
  const categorizedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        type: getTypeByValue(item.Occupancy),
        fill: getColorByValue(item.Occupancy),
      })),
    [data]
  );

  const counts = useMemo(() => {
    return {
      Low: categorizedData.filter((d) => d.type === "Low").length,
      Medium: categorizedData.filter((d) => d.type === "Medium").length,
      High: categorizedData.filter((d) => d.type === "High").length,
    };
  }, [categorizedData]);

  const [visibleTypes, setVisibleTypes] = useState({
    Low: true,
    Medium: true,
    High: true,
  });

  const filteredData = categorizedData.filter(
    (item) => visibleTypes[item.type]
  );

  const handleLegendClick = (type) => {
    setVisibleTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="live-chart-wrapper">
      {/* Top Summary Legend */}
      <div className="chart-summary">
        <span className="legend-item">
          <span className="dot" style={{ background: "#28a745" }}></span>
          0{counts.Low} Low Occupied Zones
        </span>
        <span className="legend-item">
          <span className="dot" style={{ background: "#ffc107" }}></span>
          0{counts.Medium} Medium Occupied Zones
        </span>
        <span className="legend-item">
          <span className="dot" style={{ background: "#dc3545" }}></span>
          0{counts.High} High Occupied Zones
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={filteredData}
          margin={{ top: 30, right: 30, bottom: 50, left: 20 }}
        >
          <XAxis dataKey="ZoneName" />
          <YAxis
            label={{
              value: "COUNTS",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="custom-tooltip">
                    <p>
                      <strong>In :</strong> {d.Incount}
                    </p>
                    <p>
                      <strong>Out :</strong> {d.Outcount}
                    </p>
                    <p>
                      <strong>Occupancy :</strong> {d.Occupancy}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            content={() => (
              <div className="checkbox-legend">
                {["Low", "Medium", "High"].map((type) => (
                  <label key={type} className="legend-checkbox">
                    <input
                      type="checkbox"
                      checked={visibleTypes[type]}
                      onChange={() => handleLegendClick(type)}
                    />
                    <span
                      style={{
                        color:
                          type === "Low"
                            ? "#28a745"
                            : type === "Medium"
                            ? "#ffc107"
                            : "#dc3545",
                      }}
                    >
                      {type} Occupied
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
          <Bar dataKey="Occupancy" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="Occupancy" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveOccupancyChart2;
