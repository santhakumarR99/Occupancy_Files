import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./EmailTab.css";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropDown";

const API_BASE = import.meta.env.VITE_API_URL || "http://delbi2dev.deloptanalytics.com:3000";
const emailRegex = /^\S+@\S+\.\S+$/;

// Using shared MultiSelectDropdown from CommonComponents

const AddEmailGroupModal = ({ show, onClose, onSave }) => {
  const [groupName, setGroupName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [threshold, setThreshold] = useState("");
  const [zones, setZones] = useState([]); // array of {label, value}
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
  const [thresholdOptions, setThresholdOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  if (!show) return null;

  // Load threshold and zone options when modal opens
  useEffect(() => {
    if (!show) return;
    const fetchOptions = async () => {
      setOptionsError("");
      setOptionsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username") || "TestUser";
        if (!token) throw new Error("Missing auth token in session");

        const res = await fetch(`${API_BASE}/settings/sms/thresholdZone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed with ${res.status}`);
        }
        const data = await res.json();
        const tOpts = Array.isArray(data?.threshold)
          ? data.threshold.map((t) => t?.ThresholdName).filter(Boolean)
          : [];
        const zOpts = Array.isArray(data?.zone)
          ? data.zone.map((z) => z?.ZoneName).filter(Boolean)
          : [];
        setThresholdOptions(tOpts);
        // normalize to {label, value}
        setZoneOptions(zOpts.map((z) => ({ label: z, value: z })));
      } catch (err) {
        console.error("Failed to load threshold/zone options:", err);
        setOptionsError(err?.message || "Failed to load options");
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, [show]);

  const handleAddEmail = () => {
    const raw = emailInput || "";
    const parts = raw
      .split(";")
      .map((e) => e.trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    const validNew = parts.filter(
      (e) => emailRegex.test(e) && !emails.includes(e)
    );
    if (validNew.length > 0) {
      setEmails([...emails, ...validNew]);
    }
    setEmailInput("");
  };

  const handleRemoveEmail = () => {
    if (selectedEmailIndex !== null) {
      setEmails(emails.filter((_, i) => i !== selectedEmailIndex));
      setSelectedEmailIndex(null);
    }
  };

  const handleEmailClick = (index) => {
    setSelectedEmailIndex(selectedEmailIndex === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || emails.length === 0 || !threshold || zones.length === 0) {
      toast.error("Please fill all required fields.", { position: "top-center" });
      return;
    }
    const username = sessionStorage.getItem("username") || "TestUser";
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Missing auth token. Please log in again.", { position: "top-center" });
      return;
    }
    const payload = {
      username: username,
      groupname: groupName.trim(),
  email: Array.from(new Set(emails.map((e) => e.trim()))).filter(Boolean).join(";"),
      // build comma-separated string from selected objects
      zone: Array.isArray(zones)
        ? Array.from(new Set(zones.map((z) => (z?.value ?? "").toString().trim()))).filter(Boolean).join(",")
        : "",
      threshold: String(threshold || "").trim(),
    };
    try {
      let response = await fetch(`${API_BASE}/settings/email/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        const fresh = sessionStorage.getItem("token");
        if (fresh && fresh !== token) {
          response = await fetch(`${API_BASE}/settings/email/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${fresh}`,
            },
            body: JSON.stringify(payload),
          });
        }
      }
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Failed to add group");
      }
      onSave();
      // Reset form
      setGroupName("");
      setEmailInput("");
      setEmails([]);
      setThreshold("");
      setZones([]);
      setSelectedEmailIndex(null);
    } catch (err) {
      toast.error(err?.message || "Error adding group", { position: "top-center" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add Email Group</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {optionsError && (
            <div style={{ marginBottom: 8, color: "#b00020" }}>{optionsError}</div>
          )}
          <div className="modal-row">
            <label>Group Name <span className="required">*</span></label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="modal-row">
            <label>Email ID <span className="required">*</span></label>
            <div className="email-input-section">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="email-input"
              />
              <div className="email-buttons">
                <button 
                  type="button" 
                  className="email-add" 
                  onClick={handleAddEmail} 
                  disabled={(function(){
                    const raw = (emailInput || "").trim();
                    if (!raw) return true;
                    const parts = raw.split(";").map((s)=>s.trim()).filter(Boolean);
                    if (parts.length === 0) return true;
                    return !parts.some((p)=> emailRegex.test(p) && !emails.includes(p));
                  })()}
                >
                  +
                </button>
                <button 
                  type="button" 
                  className="email-remove" 
                  onClick={handleRemoveEmail}
                  disabled={selectedEmailIndex === null}
                >
                  −
                </button>
              </div>
            </div>
            {emails.length > 0 && (
              <div className="email-list">
                {emails.map((email, idx) => (
                  <div 
                    key={idx} 
                    className={`email-item ${selectedEmailIndex === idx ? 'selected' : ''}`}
                    onClick={() => handleEmailClick(idx)}
                  >
                    {email}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-row">
            <label>Threshold <span className="required">*</span></label>
            <select
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              required
              className="custom-select"
              disabled={optionsLoading || thresholdOptions.length === 0}
            >
              <option value="">{optionsLoading ? "Loading..." : "Select"}</option>
              {thresholdOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="modal-row">
            <label>Zones <span className="required">*</span></label>
            <MultiSelectDropdown
              options={zoneOptions}
              value={zones}
              onChange={setZones}
              placeholder={optionsLoading ? "Loading..." : "Select zones"}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmailGroupModal;