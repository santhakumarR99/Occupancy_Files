import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
  CartesianGrid,
} from "recharts";
import "../../Components/Styles/LiveChart.css";
import Icon from "../CommonComponents/icon";
import lowIcon from "../../Components/Assets/dashboard/LowZone_icon.png";
import medIcon from "../../Components/Assets/dashboard/MediumZone_icon.png";
import highIcon from "../../Components/Assets/dashboard/HighZone_icon.png";
import enlargeIcon from "../../Components/Assets/dashboard/EnlargeIcon.png";
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
  const [showModal, setShowModal] = useState(false);

  // Close on ESC + lock body scroll while modal is open
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowModal(false);
    if (showModal) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const categorizedData = useMemo(
    () =>
      (data || []).map((item) => ({
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

  const filteredData = useMemo(
    () => categorizedData.filter((item) => visibleTypes[item.type]),
    [categorizedData, visibleTypes]
  );

  const handleLegendClick = (type) => {
    setVisibleTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Unique zone types for legend
  const availableTypes = useMemo(
    () => [...new Set(categorizedData.map((item) => item.type))],
    [categorizedData]
  );

  // Reusable chart markup (used in card + modal)
  const ChartMarkup = ({ height }) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        className="custom-bar-chart"
        data={filteredData}
        margin={{ top: 30, right: 30, bottom: 50, left: 20 }}
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis  label={{
            value: "ZONES",
            angle: 0,
            position: "insidebottom",
            margin: "50px"
          }}dataKey="ZoneName" />
        <YAxis
          label={{
            value: "COUNTS",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            // Only show tooltip if we're directly on a bar
            if (
              active &&
              payload &&
              payload.length &&
              payload[0].value !== undefined &&
              payload[0].value !== null
            ) {
              const d = payload[0].payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    fontSize: "14px",
                  }}
                >
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
            return null; // no tooltip on empty space
          }}
        />

        <Legend
          verticalAlign="bottom"
          content={() => (
            <div className="checkbox-legend">
              {availableTypes.map((type) => (
                <label key={type} className="legend-checkbox">
                  <input
                    type="checkbox"
                    checked={!!visibleTypes[type]}
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

        <Bar dataKey="Occupancy" radius={[4, 4, 0, 0]} barSize={70}>
          <LabelList
            dataKey="Occupancy"
            position="top"
            fill="black"
            fontSize={14}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="live-chart-wrapper">
      <div className="topSections">
        <div className="chart-summary">
          {counts.Low > 0 && (
            <span className="legend-item">
              <span className="dash_zone_icon">
                <Icon img={lowIcon} Img_width="20px" Img_height="20px" />
              </span>
              {counts.Low} Low Occupied Zones
            </span>
          )}
          {counts.Medium > 0 && (
            <span className="legend-item">
              <span className="dash_zone_icon">
                <Icon img={medIcon} Img_width="20px" Img_height="20px" />
              </span>
              {counts.Medium} Medium Occupied Zones
            </span>
          )}
          {counts.High > 0 && (
            <span className="legend-item">
              <span className="dash_zone_icon">
                <Icon img={highIcon} Img_width="20px" Img_height="20px" />
              </span>
              {counts.High} High Occupied Zones
            </span>
          )}
        </div>

        <div className="enlargeicon">
          <button
            onClick={() => setShowModal(true)}
            className="enlarge_icon"
            aria-label="Enlarge chart"
            title="Enlarge"
          >
       <Icon img={enlargeIcon} Img_width="20px" Img_height="20px" />
          </button>
        </div>
      </div>
      {/* Regular (card) chart */}
      <ChartMarkup height={520} />

      {/* Enlarged Modal */}
      {showModal && (
        <div
          className="chart-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("chart-modal-overlay")) {
              setShowModal(false);
            }
          }}
        >
          <div className="chart-modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h3 className="modal-title">Live Occupancy</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <ChartMarkup height="100%" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveOccupancyChart2;
