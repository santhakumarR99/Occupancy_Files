import React from "react";
import PropTypes from "prop-types";
import LabeledDropdown from "./LabeledDropdown";

const SearchBar = ({
  value,
  onChange,
  users = [],
  events = [],
  selectedUser = [],
  selectedEvent = [],
  onUserChange,
  onEventChange,
  userOptionsHidden,
  eventOptionsHidden
}) => (
  <div className="search-bar-container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div className="search-input-wrapper">
      <input
        className="search-bar"
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
      />
      <div className="search-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
    {users.length > 0 && (
      <div>
        <LabeledDropdown
          label="Users"
          value={selectedUser}
          onChange={onUserChange}
          options={users}
          placeholder="All Users"
        />
        {userOptionsHidden && (
          <div style={{ color: 'gray', fontSize: '0.9em' }}>
            Some options are hidden in this dropdown
          </div>
        )}
      </div>
    )}
    {events.length > 0 && (
      <div>
        <LabeledDropdown
          label="Event"
          value={selectedEvent}
          onChange={onEventChange}
          options={events}
          placeholder="All Events"
        />
        {eventOptionsHidden && (
          <div style={{ color: 'gray', fontSize: '0.9em' }}>
            Some options are hidden in this dropdown
          </div>
        )}
      </div>
    )}
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  users: PropTypes.array,
  events: PropTypes.array,
  selectedUser: PropTypes.array,
  selectedEvent: PropTypes.array,
  onUserChange: PropTypes.func.isRequired,
  onEventChange: PropTypes.func.isRequired,
  userOptionsHidden: PropTypes.bool,
  eventOptionsHidden: PropTypes.bool,
};

export default SearchBar;