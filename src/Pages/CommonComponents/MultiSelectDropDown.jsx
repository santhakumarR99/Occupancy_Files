import React, { useState, useEffect, useRef } from "react";
import "../../Components/Styles/Multiselectdropdown.css"; // custom styles

const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange,
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select Options"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (option) => {
    const isSelected = value.some((v) => v[valueKey] === option[valueKey]);

    let newValue = isSelected
      ? value.filter((v) => v[valueKey] !== option[valueKey])
      : [...value, option];

    // If selecting all
    if (option[valueKey] === "__all__") {
      newValue = value.length === options.length
        ? []
        : [...options];
    }

    onChange(newValue);
  };
// console.log(option)
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isAllSelected = value.length === options.length;
  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div
        className="dropdown-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value.length > 0 ? `${value.length} Selected` : placeholder}
        <span className={`arrow ${isOpen ? "up" : "down"}`} />
      </div>

      {isOpen && (
        <div className="dropdown-list">
          <label className="dropdown-item">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() =>
                toggleOption({ [labelKey]: "Select All", [valueKey]: "__all__" })
              }
            />
            Select All
          </label>
          {options.map((option, idx) => (
            <label key={idx} className="dropdown-item">
              <input
                type="checkbox"
                checked={value.some((v) => v[valueKey] === option[valueKey])}
                onChange={() => toggleOption(option)}
              />
              {option[labelKey]}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
