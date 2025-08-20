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
import Icon from "../CommonComponents/icon";
import lowIcon from "../../Components/Assets/dashboard/LowZone_icon.png";
import medIcon from "../../Components/Assets/dashboard/MediumZone_icon.png";
import highIcon from "../../Components/Assets/dashboard/HighZone_icon.png";
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
          <span className="dash_zone_icon"><Icon  img={lowIcon} Img_width="20px" Img_height= "20px"/></span>
          {counts.Low} Low Occupied Zones
        </span>
        <span className="legend-item">
          <span className="dash_zone_icon"><Icon  img={medIcon} Img_width="20px" Img_height= "20px"/></span>
          {counts.Medium} Medium Occupied Zones
        </span>
        <span className="legend-item">
          <span className="dash_zone_icon" ><Icon  img={highIcon} Img_width="20px" Img_height= "20px"/></span>
          {counts.High} High Occupied Zones
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={500} style={{ border: "none", boxShadow: "none" }}>
        <BarChart
          className="custom-bar-chart"
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
                            ? "#25B27A"
                            : type === "Medium"
                            ? "#FFB700"
                            : "#F35F5F",
                      }}
                    >
                      {type} Occupied
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
          <Bar dataKey="Occupancy" radius={[8, 8, 0, 0]}  tabIndex="-1">
            <LabelList dataKey="Occupancy" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveOccupancyChart2;
