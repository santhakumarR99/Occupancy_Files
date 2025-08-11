import React from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";

const LabeledDropdown = ({ label, value, onChange, options, placeholder }) => {
  // Support both string and object options
  const selectOptions = options.map(opt =>
    typeof opt === "string"
      ? { value: opt, label: opt }
      : { value: opt.value ?? opt.label, label: opt.label ?? opt.value }
  );
  const selectedValues = selectOptions.filter(opt => value.includes(opt.value));

  // Custom Option with checkbox
  const Option = (props) => (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => {}}
        style={{ marginRight: 8 }}
      />
      <label>{props.label}</label>
    </components.Option>
  );

  // Custom MenuList with filter icon and clear selected
  const MenuList = (props) => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #eee', background: '#fafbfc' }}>
        <svg width="18" height="18" fill="none" stroke="#7b809a" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 8 }}><path d="M3 4h18M6 8v8a2 2 0 002 2h8a2 2 0 002-2V8"/><rect x="9" y="12" width="6" height="6" rx="1"/></svg>
        <span style={{ fontWeight: 600, color: '#7b809a', fontSize: 14 }}>Filter</span>
      </div>
      <div style={{ padding: '4px 12px', borderBottom: '1px solid #eee', background: '#fafbfc', cursor: 'pointer', color: '#bfc7d1', fontWeight: 600, fontSize: 14 }}
        onClick={() => props.selectProps.onChange([])}>
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
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, MenuList }}
        styles={{
          menu: provided => ({ ...provided, zIndex: 9999 }),
          container: provided => ({ ...provided, minWidth: 260, maxWidth: 260, width: 260 }),
          control: provided => ({ ...provided, minWidth: 260, maxWidth: 260, width: 260 }),
          valueContainer: provided => ({
            ...provided,
            minWidth: 0,
            maxWidth: 220,
            maxHeight: 38,
            overflowX: 'auto',
            overflowY: 'auto',
            flexWrap: 'nowrap',
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

