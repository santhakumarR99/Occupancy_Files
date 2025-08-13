import React from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
// Align visual design with the existing MultiSelectDropDown component
import "../../Components/Styles/Multiselectdropdown.css";

const LabeledDropdown = ({ label, value, onChange, options, placeholder }) => {
  // Support both string and object options
  const selectOptions = options.map(opt =>
    typeof opt === "string"
      ? { value: opt, label: opt }
      : { value: opt.value ?? opt.label, label: opt.label ?? opt.value }
  );
  const selectedValues = selectOptions.filter(opt => value.includes(opt.value));

  // Custom Option with checkbox styled like dropdown-item
  const Option = (props) => (
    <components.Option {...props}>
      <label className="dropdown-item" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => {}}
          style={{ marginRight: 10 }}
        />
        {props.label}
      </label>
    </components.Option>
  );

  // Hide token chips; show "N Selected" like the custom dropdown
  const MultiValue = () => null;

  const ValueContainer = (props) => {
    const count = props.getValue().length;
    const text = count > 0 ? `${count} Selected` : (props.selectProps.placeholder || "Select");
    return (
      <components.ValueContainer {...props}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</div>
        {/* keep the input so keyboard interactions still work */}
        {Array.isArray(props.children) ? props.children[1] : null}
      </components.ValueContainer>
    );
  };

  // Use an arrow indicator matching the design
  const DropdownIndicator = (props) => {
    const isOpen = props.selectProps.menuIsOpen;
    return (
      <components.DropdownIndicator {...props}>
        <span className={`arrow ${isOpen ? 'up' : 'down'}`} />
      </components.DropdownIndicator>
    );
  };

  const IndicatorSeparator = () => null;

  // Custom MenuList with filter icon and clear selected
  const MenuList = (props) => (
    <>
      <div
        className="dropdown-item"
        style={{ fontWeight: 600, color: '#7b809a', borderBottom: '1px solid #eee' }}
        onClick={() => props.selectProps.onChange([])}
      >
        Clear Selected Items
      </div>
      <components.MenuList {...props} />
    </>
  );

  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <Select
        isMulti
        options={selectOptions}
        value={selectedValues}
        onChange={selected => {
          if (!Array.isArray(selected)) {
            onChange([]);
          } else {
            onChange(selected.filter(opt => opt && typeof opt.value !== 'undefined').map(opt => opt.value));
          }
        }}
        placeholder={placeholder}
        className="custom-dropdown" /* match MultiSelectDropDown width/positioning */
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, MenuList, MultiValue, ValueContainer, DropdownIndicator, IndicatorSeparator }}
        styles={{
          container: (provided) => ({
            ...provided,
            width: 250,
            fontFamily: 'sans-serif',
          }),
          control: (provided, state) => ({
            ...provided,
            padding: '6px 8px',
            borderRadius: 8,
            background: '#fff',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
            border: state.isFocused ? '1px solid #cbd5e1' : '1px solid transparent',
            cursor: 'pointer',
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
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            marginTop: 6,
            overflow: 'hidden',
          }),
          menuList: (provided) => ({
            ...provided,
            paddingTop: 8,
            paddingBottom: 8,
          }),
          option: (provided, state) => ({
            ...provided,
            padding: '0',
            background: state.isFocused ? '#f3f4f6' : '#fff',
            color: '#111827',
          }),
        }}
      />
    </div>
  );
};

LabeledDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired, // Accept array of string or object
  placeholder: PropTypes.string.isRequired,
};

export default LabeledDropdown;

