import React, { useState, useEffect } from 'react';
import './EditEmailGroup.css';
import './EmailTab.css';

const THRESHOLDS = ["Threshold-1", "Threshold-2", "Threshold-3"];
const ZONES = ["Zone 1", "Zone 2", "Zone 3", "Zone 4"];
const emailRegex = /^\S+@\S+\.\S+$/;

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder = "Select" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOptionToggle = (option) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const clearSelection = () => {
    onChange([]);
    setFilter("");
  };

  return (
    <div className="multiselect-container" ref={dropdownRef}>
      <div className="multiselect-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="multiselect-label">
          {selectedValues.length === 0 ? placeholder :
           selectedValues.length === options.length ? "All Selected" :
           `${selectedValues.length} selected`}
        </span>
        <span className={`multiselect-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <div className="multiselect-dropdown">
          <div className="multiselect-header">
            <div className="multiselect-filter">
              <span className="filter-icon">🔍</span>
              <input
                type="text"
                placeholder="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <button 
              type="button"
              className="clear-selection"
              onClick={clearSelection}
            >
              Clear Selected Items
            </button>
          </div>
          
          <div className="multiselect-options">
            {filteredOptions.map(option => (
              <div key={option} className="multiselect-option">
                <label className="multiselect-option-label">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleOptionToggle(option)}
                  />
                  <span className="checkmark"></span>
                  <span className="option-text">{option}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EditEmailGroup = ({ groupId, onClose, onSave }) => {
  const [groupName, setGroupName] = useState('');
  const [emails, setEmails] = useState([]);
  const [threshold, setThreshold] = useState('');
  const [zones, setZones] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/emailGroup/${groupId}`)
      .then(res => res.json())
      .then(data => {
        setGroupName(data.groupName || '');
        setEmails(data.emails || []);
        setThreshold(data.threshold || '');
        setZones(Array.isArray(data.zones) ? data.zones : []);
        setLoading(false);
      });
  }, [groupId]);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && emailRegex.test(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmailInput('');
    }
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!groupName || emails.length === 0 || !threshold || zones.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    const payload = {
      id: groupId,
      groupName,
      emails,
      threshold,
      zones
    };
    try {
      const response = await fetch(`http://localhost:3001/emailGroup/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to update group");
      onSave();
      onClose();
    } catch (err) {
      alert("Error updating group");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="modal-form" onSubmit={handleSubmit}>
          <h2>Edit Email Group</h2>
          <div className="modal-row">
            <label>Group Name *</label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
              placeholder="Enter group name"
            />
          </div>
          <div className="modal-row">
            <label>Email ID *</label>
            <div className="email-input-section">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="email-input"
                placeholder="Enter email"
              />
              <div className="email-buttons">
                <button 
                  type="button" 
                  className="email-add" 
                  onClick={handleAddEmail} 
                  disabled={!emailInput.trim() || emails.includes(emailInput.trim()) || !emailRegex.test(emailInput.trim())}
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
            <label>Threshold *</label>
            <select value={threshold} onChange={e => setThreshold(e.target.value)} required>
              <option value="">Select</option>
              {THRESHOLDS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="modal-row">
            <label>Zones *</label>
            <MultiSelectDropdown
              options={ZONES}
              selectedValues={zones}
              onChange={setZones}
              placeholder="Select zones"
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

export default EditEmailGroup;