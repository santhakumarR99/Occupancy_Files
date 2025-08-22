import React, { useState, useEffect } from "react";
import "./ResetCountModal.css";
import "../../Components/Styles/CustomButtons.css";

const ResetCountModal = ({ show, zoneName = "", zone = null, onCancel, onSubmit }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (show) setValue("");
  }, [show]);

  if (!show) return null;

  const handleSubmit = () => {
    // Pass number or null if invalid. Also provide the zone so parent can use modal's zone even if selection cleared.
    const num = value === "" ? null : Number(value);
    // Wrap zone in an object if present to avoid colliding with numeric-only callers
    if (zone) {
      onSubmit?.(num, zone);
    } else {
      onSubmit?.(num);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="reset-modal">
        <div className="reset-header">
          <h3>
            <strong>Reset Count:</strong>&nbsp;{zoneName}
          </h3>
          <button className="close-btn" onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>
        <div className="reset-body">
          <label htmlFor="resetCountInput">Enter the In Count before reset Count?</label>
          <input
            id="resetCountInput"
            type="number"
            className="reset-input"
            placeholder="Enter count"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="reset-footer">
          <button className="btn-soft-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-primary-gradient" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ResetCountModal;
