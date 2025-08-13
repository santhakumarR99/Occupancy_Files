import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import "./EmailTab.css";
import "../../Components/Styles/Multiselectdropdown.css";

const API_BASE = "http://delbi2dev.deloptanalytics.com:3000";

// Reuse the same react-select based MultiSelectDropdown as in AddSMSGroup
const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder = "Select" }) => {
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

  const Option = (props) => (
    <components.Option {...props}>
      <label className="dropdown-item" style={{ display: "flex", alignItems: "center" }}>
        <input type="checkbox" checked={props.isSelected} onChange={() => {}} style={{ marginRight: 10 }} />
        {props.label}
      </label>
    </components.Option>
  );

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

const EditSMSGroup = ({ show, group, onClose, onSubmit }) => {
  const [groupName, setGroupName] = useState("");
  const [oldGroupName, setOldGroupName] = useState("");
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
  const [saving, setSaving] = useState(false);

  const phoneRegex = /^[\d\-+()\s]+$/;

  // Determine the target group name from prop (accepts object or string)
  const targetGroupName = React.useMemo(() => {
    if (!group) return "";
    if (typeof group === "string") return group;
    return group?.name || group?.groupName || group?.GroupName || "";
  }, [group]);

  // Fetch existing data and options when modal opens
  useEffect(() => {
    if (!show || !targetGroupName) return;
    const fetchView = async () => {
      setOptionsError("");
      setOptionsLoading(true);
      try {
        const tokenVal = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username") || "TestUser";
        if (!tokenVal) throw new Error("Missing auth token in session");

        const res = await fetch(`${API_BASE}/settings/sms/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
          },
          body: JSON.stringify({ username, groupName: targetGroupName }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed with ${res.status}`);
        }

  const data = await res.json();
  // Prefill fields
  const smsArr = Array.isArray(data?.smsGroup) ? data.smsGroup : [];
  const sms = smsArr[0] || null;
        const mappedThreshold = Array.isArray(data?.mappedthreshold) && data.mappedthreshold[0]?.ThresholdName;
        const mappedZones = Array.isArray(data?.mappedzone)
          ? data.mappedzone.map((z) => z?.zonename).filter(Boolean)
          : [];
        const tOpts = Array.isArray(data?.threshold)
          ? data.threshold.map((t) => t?.ThresholdName).filter(Boolean)
          : [];
        const zOpts = Array.isArray(data?.zone)
          ? data.zone.map((z) => z?.ZoneName).filter(Boolean)
          : [];

        setThresholdOptions(tOpts);
        setZoneOptions(zOpts);

        if (sms) {
          setGroupName(sms.GroupName || "");
          setOldGroupName(sms.GroupName || targetGroupName);
          setContactName(sms.ContactName || "");
          // Collect multiple contact numbers if provided as multiple rows or comma-separated
          const collected = smsArr
            .map((it) => (it?.ContactNo ?? "").toString())
            .filter(Boolean);
          let contacts = collected.length > 0 ? collected : [];
          if (contacts.length === 1 && contacts[0].includes(",")) {
            contacts = contacts[0].split(",");
          }
          contacts = Array.from(new Set(contacts.map((c) => c.trim()))).filter(Boolean);
          setContactNumbers(contacts);
        } else {
          setOldGroupName(targetGroupName);
        }
        if (mappedThreshold) setThreshold(mappedThreshold);
        if (mappedZones?.length) setZones(mappedZones);
      } catch (err) {
        console.error("Failed to load SMS group view:", err);
        setOptionsError(err?.message || "Failed to load group details");
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchView();
  }, [show, targetGroupName]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || !contactName.trim() || contactNumbers.length === 0 || !threshold || (zones?.length || 0) === 0) {
      alert("Please fill all required fields.");
      return;
    }

    const username = sessionStorage.getItem("username") || "TestUser";
    const tokenVal = sessionStorage.getItem("token");
    if (!tokenVal) {
      alert("Missing auth token. Please log in again.");
      return;
    }

    const zoneStr = Array.isArray(zones)
      ? Array.from(new Set(zones.map((z) => (z ?? "").toString().trim()))).filter(Boolean).join(",")
      : (zones ?? "").toString().trim();

    const contactStr = Array.isArray(contactNumbers)
      ? Array.from(new Set(contactNumbers.map((n) => (n ?? "").toString().trim()))).filter(Boolean).join(",")
      : (contactNumbers ?? "").toString().trim();

    const payload = {
      username,
      oldgroupname: oldGroupName || groupName,
      groupname: groupName.trim(),
      // Send multiple numbers as comma-separated string
      contactno: contactStr,
      contactname: contactName.trim(),
      // Send multiple zones as comma-separated string
      zone: zoneStr,
      threshold,
    };

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/settings/sms/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenVal}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Edit failed with ${res.status}`);
      }
      const data = await res.json();
      // Optional success flag check
      if (data?.success === false) {
        throw new Error(data?.message || "Edit failed");
      }

  // Notify parent (include arrays to keep UI in sync) and close
  onSubmit && onSubmit({ ...payload, zones: Array.isArray(zones) ? [...zones] : [], contactNumbers: [...contactNumbers] });
      handleClose();
    } catch (err) {
      console.error("Edit SMS group failed:", err);
      alert(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setOldGroupName("");
    setContactInput("");
    setContactNumbers([]);
    setContactName("");
    setThreshold("");
    setZones([]);
    setSelectedContactIndex(null);
    setOptionsError("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit SMS Group</h2>
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
            <label>
              Contact Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter contact name"
              required
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
                  disabled={!contactInput.trim() || contactNumbers.includes(contactInput.trim()) || !phoneRegex.test(contactInput.trim())}
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
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving || optionsLoading}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSMSGroup;
