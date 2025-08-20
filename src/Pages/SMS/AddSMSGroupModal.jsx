import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import "./EmailTab.css";
import "../../Components/Styles/Multiselectdropdown.css";

const API_BASE = "http://delbi2dev.deloptanalytics.com:3000";

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder = "Select" }) => {
  // Normalize options to react-select format
  const selectOptions = (options || []).map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : { value: opt.value ?? opt.label, label: opt.label ?? opt.value }
  );
  const selected = selectOptions.filter((opt) => (selectedValues || []).includes(opt.value));
  const wrapperRef = React.useRef(null);
  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setMenuWidth(rect.width);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Custom Option with checkbox styled like dropdown-item
  const Option = (props) => (
    <components.Option {...props}>
      <label className="dropdown-item" style={{ display: "flex", alignItems: "center" }}>
        <input type="checkbox" checked={props.isSelected} onChange={() => {}} style={{ marginRight: 10 }} />
        {props.label}
      </label>
    </components.Option>
  );

  // Hide chips; show count in value container
  const MultiValue = () => null;

  const ValueContainer = (props) => {
    const count = props.getValue().length;
    const text = count > 0 ? `${count} Selected` : props.selectProps.placeholder || "Select";
    return (
      <components.ValueContainer {...props}>
        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</div>
        {Array.isArray(props.children) ? props.children[1] : null}
      </components.ValueContainer>
    );
  };

  const DropdownIndicator = (props) => {
    const isOpen = props.selectProps.menuIsOpen;
    return (
      <components.DropdownIndicator {...props}>
        <span className={`arrow ${isOpen ? "up" : "down"}`} />
      </components.DropdownIndicator>
    );
  };

  const IndicatorSeparator = () => null;

  const MenuList = (props) => (
    <>
      <div
        className="dropdown-item"
        style={{ fontWeight: 600, color: "#7b809a", borderBottom: "1px solid #eee" }}
        onClick={() => props.selectProps.onChange([])}
      >
        Clear Selected Items
      </div>
      <components.MenuList {...props} />
    </>
  );

  return (
    <div className="custom-dropdown" ref={wrapperRef} style={{ width: "100%" }}>
      <Select
        isMulti
        options={selectOptions}
        value={selected}
        onChange={(selectedList) => {
          if (!Array.isArray(selectedList)) {
            onChange([]);
          } else {
            const vals = selectedList
              .filter((opt) => opt && typeof opt.value !== "undefined")
              .map((opt) => String(opt.value));
            onChange(vals);
          }
        }}
        placeholder={placeholder}
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
    menuPosition="fixed"
    menuPlacement="auto"
  menuShouldScrollIntoView={false}
  maxMenuHeight={240}
        components={{ Option, MenuList, MultiValue, ValueContainer, DropdownIndicator, IndicatorSeparator }}
        styles={{
          container: (provided) => ({
            ...provided,
      width: "100%",
            fontFamily: "sans-serif",
          }),
          control: (provided, state) => ({
            ...provided,
            padding: "6px 8px",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            border: state.isFocused ? "1px solid #cbd5e1" : "1px solid transparent",
            cursor: "pointer",
            minHeight: 40,
          }),
          indicatorsContainer: (provided) => ({ ...provided, paddingRight: 8 }),
          placeholder: (provided) => ({ ...provided, marginLeft: 0 }),
          valueContainer: (provided) => ({
            ...provided,
            paddingLeft: 8,
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            borderRadius: 8,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            marginTop: 6,
            overflow: "hidden",
            width: menuWidth || provided.width,
            minWidth: menuWidth || provided.minWidth,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menuList: (provided) => ({
            ...provided,
            paddingTop: 8,
            paddingBottom: 8,
          }),
          option: (provided, state) => ({
            ...provided,
            padding: 0,
            background: state.isFocused ? "#f3f4f6" : "#fff",
            color: "#111827",
          }),
        }}
      />
    </div>
  );
};

const AddSMSGroupModal = ({ show, onClose, onSubmit }) => {
  const [groupName, setGroupName] = useState("");
  const [contactInput, setContactInput] = useState("");
  const [contactNumbers, setContactNumbers] = useState([]);
  const [contactName, setContactName] = useState("");
  const [threshold, setThreshold] = useState("");
  const [zones, setZones] = useState([]);
  const [selectedContactIndex, setSelectedContactIndex] = useState(null);

  const [thresholdOptions, setThresholdOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  const phoneRegex = /^[\d\-+()\s]+$/;

  // Always call hooks regardless of show
  useEffect(() => {
    if (!show) return; // Only run fetch logic when open

    const fetchOptions = async () => {
      setOptionsError("");
      setOptionsLoading(true);
      try {
        const tokenVal = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username") || "TestUser";
        if (!tokenVal) throw new Error("Missing auth token in session");

        const res = await fetch(`${API_BASE}/settings/sms/thresholdZone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
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
        setZoneOptions(zOpts);
      } catch (err) {
        console.error("Failed to load threshold/zone options:", err);
        setOptionsError(err?.message || "Failed to load options");
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [show]);

  const handleAddContact = () => {
    const contact = contactInput.trim();
    if (contact && phoneRegex.test(contact) && !contactNumbers.includes(contact)) {
      setContactNumbers([...contactNumbers, contact]);
      setContactInput("");
    }
  };

  const handleRemoveContact = () => {
    if (selectedContactIndex !== null) {
      setContactNumbers(contactNumbers.filter((_, i) => i !== selectedContactIndex));
      setSelectedContactIndex(null);
    }
  };

  const handleContactClick = (index) => {
    setSelectedContactIndex(selectedContactIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName || contactNumbers.length === 0 || !threshold || zones.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    const groupData = {
      groupName: groupName.trim(),
      contactNumbers,
      contactName: contactName.trim(),
      threshold,
      zones,
    };
    onSubmit(groupData);
    handleClose();
  };

  const handleClose = () => {
    setGroupName("");
    setContactInput("");
    setContactNumbers([]);
    setContactName("");
    setThreshold("");
    setZones([]);
    setSelectedContactIndex(null);
    onClose();
  };

  if (!show) return null; // Safe to return after hooks

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add SMS Group</h2>
          <button type="button" className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {optionsError && (
            <div style={{ marginBottom: 8, color: "#b00020" }}>{optionsError}</div>
          )}



          <div className="modal-row">
            <label>
              Group Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="modal-row" style={{ marginTop: 8 }}>
            <label>Contact Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter contact name"
            />
          </div>

          <div className="modal-row">
            <label>
              Contact No <span className="required">*</span>
            </label>
            <div className="email-input-section">
              <input
                type="tel"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                className="email-input"
                placeholder="Enter contact number"
              />
              <div className="email-buttons">
                <button
                  type="button"
                  className="email-add"
                  onClick={handleAddContact}
                  disabled={
                    !contactInput.trim() ||
                    contactNumbers.includes(contactInput.trim()) ||
                    !phoneRegex.test(contactInput.trim())
                  }
                >
                  +
                </button>
                <button
                  type="button"
                  className="email-remove"
                  onClick={handleRemoveContact}
                  disabled={selectedContactIndex === null}
                >
                  −
                </button>
              </div>
            </div>

            {contactNumbers.length > 0 && (
              <div className="email-list">
                {contactNumbers.map((contact, idx) => (
                  <div
                    key={idx}
                    className={`email-item ${selectedContactIndex === idx ? "selected" : ""}`}
                    onClick={() => handleContactClick(idx)}
                  >
                    {contact}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-row">
            <label>
              Threshold <span className="required">*</span>
            </label>
            <select
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
              className="custom-select"
              disabled={optionsLoading || thresholdOptions.length === 0}
            >
              <option value="">{optionsLoading ? "Loading..." : "Select"}</option>
              {thresholdOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-row">
            <label>
              Zones <span className="required">*</span>
            </label>
            <MultiSelectDropdown
              options={zoneOptions}
              selectedValues={zones}
              onChange={setZones}
              placeholder={optionsLoading ? "Loading..." : "Select zones"}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSMSGroupModal;


