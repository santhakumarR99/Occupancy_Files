import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import './EditEmailGroup.css';
import './EmailTab.css';
import '../../Components/Styles/Multiselectdropdown.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://delbi2dev.deloptanalytics.com:3000';
const emailRegex = /^\S+@\S+\.\S+$/;

// React-select based MultiSelectDropdown to match SMS Add Group UI
const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder = 'Select' }) => {
  const selectOptions = (options || []).map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : { value: opt.value ?? opt.label, label: opt.label ?? opt.value }
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
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const Option = (props) => (
    <components.Option {...props}>
      <label className="dropdown-item" style={{ display: 'flex', alignItems: 'center' }}>
        <input type="checkbox" checked={props.isSelected} onChange={() => {}} style={{ marginRight: 10 }} />
        {props.label}
      </label>
    </components.Option>
  );

  const MultiValue = () => null;

  const ValueContainer = (props) => {
    const count = props.getValue().length;
    const text = count > 0 ? `${count} Selected` : props.selectProps.placeholder || 'Select';
    return (
      <components.ValueContainer {...props}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</div>
        {Array.isArray(props.children) ? props.children[1] : null}
      </components.ValueContainer>
    );
  };

  const DropdownIndicator = (props) => {
    const isOpen = props.selectProps.menuIsOpen;
    return (
      <components.DropdownIndicator {...props}>
        <span className={`arrow ${isOpen ? 'up' : 'down'}`} />
      </components.DropdownIndicator>
    );
  };

  const IndicatorSeparator = () => null;

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
    <div className="custom-dropdown" ref={wrapperRef} style={{ width: '100%' }}>
      <Select
        isMulti
        options={selectOptions}
        value={selected}
        onChange={(selectedList) => {
          if (!Array.isArray(selectedList)) {
            onChange([]);
          } else {
            const vals = selectedList
              .filter((opt) => opt && typeof opt.value !== 'undefined')
              .map((opt) => String(opt.value));
            onChange(vals);
          }
        }}
        placeholder={placeholder}
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
        maxMenuHeight={240}
        components={{ Option, MenuList, MultiValue, ValueContainer, DropdownIndicator, IndicatorSeparator }}
        styles={{
          container: (provided) => ({
            ...provided,
            width: '100%',
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
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            marginTop: 6,
            overflow: 'hidden',
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
            background: state.isFocused ? '#f3f4f6' : '#fff',
            color: '#111827',
          }),
        }}
      />
    </div>
  );
};

const EditEmailGroup = ({ groupId, groupName: initialGroupName, onClose, onSave }) => {
  const [groupName, setGroupName] = useState(initialGroupName || '');
  const [oldGroupName, setOldGroupName] = useState(initialGroupName || '');
  const [emails, setEmails] = useState([]);
  const [threshold, setThreshold] = useState('');
  const [zones, setZones] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);

  const [thresholdOptions, setThresholdOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing group details and options
  useEffect(() => {
    const getSafeUsername = () => {
      const raw = (sessionStorage.getItem('username') ?? '').toString().trim();
      return raw.length > 0 ? raw : 'TestUser';
    };
    const fetchView = async () => {
      setOptionsError('');
      setOptionsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const username = getSafeUsername();
        if (!token) throw new Error('Missing auth token in session');

        // Fetch current group details + all options
        const viewRes = await fetch(`${API_BASE}/settings/email/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            groupName: (initialGroupName || groupName || '').toString().trim(),
            groupname: (initialGroupName || groupName || '').toString().trim(),
          }),
        });
        if (!viewRes.ok) {
          const text = await viewRes.text();
          throw new Error(text || `Request failed with ${viewRes.status}`);
        }
        const data = await viewRes.json();

        // Prefill form fields
        const meta = Array.isArray(data?.metaData) && data.metaData.length > 0 ? data.metaData[0] : null;
        if (meta) {
          const gname = meta.GroupName || initialGroupName || '';
          setGroupName(gname);
          setOldGroupName(gname);
          const emailsStr = (meta.EmailId || '').toString();
          const parsed = emailsStr
            .split(';')
            .map((e) => e.trim())
            .filter(Boolean);
          const uniq = Array.from(new Set(parsed));
          setEmails(uniq);
        }

        const mappedThreshold = Array.isArray(data?.mappedThreshold) && data.mappedThreshold[0]?.ThresholdName;
        const mappedZones = Array.isArray(data?.mappedZone)
          ? data.mappedZone.map((z) => z?.ZoneName).filter(Boolean)
          : [];
        if (mappedThreshold) setThreshold(mappedThreshold);
        if (mappedZones?.length) setZones(mappedZones);

        // Set options from allThreshold/allZone if available
        let tOpts = Array.isArray(data?.allThreshold)
          ? data.allThreshold.map((t) => t?.ThresholdName).filter(Boolean)
          : [];
        let zOpts = Array.isArray(data?.allZone)
          ? data.allZone.map((z) => z?.ZoneName).filter(Boolean)
          : [];

        // Fallback to thresholdZone if not provided
        if (tOpts.length === 0 || zOpts.length === 0) {
          try {
            const tzRes = await fetch(`${API_BASE}/settings/sms/thresholdZone`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ username }),
            });
            if (tzRes.ok) {
              const tzData = await tzRes.json();
              if (tOpts.length === 0) {
                tOpts = Array.isArray(tzData?.threshold)
                  ? tzData.threshold.map((t) => t?.ThresholdName).filter(Boolean)
                  : [];
              }
              if (zOpts.length === 0) {
                zOpts = Array.isArray(tzData?.zone)
                  ? tzData.zone.map((z) => z?.ZoneName).filter(Boolean)
                  : [];
              }
            }
          } catch (e) {
            // ignore fallback errors; options may remain empty
          }
        }

        setThresholdOptions(tOpts);
        setZoneOptions(zOpts);
      } catch (err) {
        console.error('Failed to load Email group view/options:', err);
        setOptionsError(err?.message || 'Failed to load group details');
      } finally {
        setOptionsLoading(false);
      }
    };

    if (initialGroupName || groupName) {
      fetchView();
    }
  }, [initialGroupName]);

  // Email handlers (support multiple with semicolon)
  const handleAddEmail = () => {
    const raw = emailInput || '';
    const parts = raw
      .split(';')
      .map((e) => e.trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    const validNew = parts.filter((e) => emailRegex.test(e) && !emails.includes(e));
    if (validNew.length > 0) {
      setEmails([...emails, ...validNew]);
    }
    setEmailInput('');
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
    if (!groupName || emails.length === 0 || !threshold || (zones?.length || 0) === 0) {
      toast.error('Please fill all required fields.', { position: 'top-center' });
      return;
    }

    const username = sessionStorage.getItem('username') || 'TestUser';
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Missing auth token. Please log in again.', { position: 'top-center' });
      return;
    }

    const payload = {
      username,
      oldgroupname: oldGroupName || groupName,
      groupname: groupName.trim(),
      email: Array.from(new Set(emails.map((e) => e.trim()))).filter(Boolean).join(';'),
      zone: Array.isArray(zones)
        ? Array.from(new Set(zones.map((z) => (z ?? '').toString().trim()))).filter(Boolean).join(',')
        : (zones ?? '').toString().trim(),
      threshold: String(threshold || '').trim(),
    };

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/settings/email/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Edit failed with ${res.status}`);
      }
  const data = await res.json().catch(() => ({}));
      if (data?.success === false) {
        throw new Error(data?.message || 'Edit failed');
      }

  onSave && onSave();
  onClose && onClose();
    } catch (err) {
      console.error('Edit Email group failed:', err);
  toast.error(err?.message || 'Failed to save changes', { position: 'top-center' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Email Group</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {optionsError && (
            <div style={{ marginBottom: 8, color: '#b00020' }}>{optionsError}</div>
          )}

          <div className="modal-row">
            <label>Group Name <span className="required">*</span></label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              placeholder="Enter group name"
            />
          </div>
          <div className="modal-row">
            <label>Email ID <span className="required">*</span></label>
            <div className="email-input-section">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="email-input"
                placeholder="Enter email (use ; to add multiple)"
              />
              <div className="email-buttons">
                <button
                  type="button"
                  className="email-add"
                  onClick={handleAddEmail}
                  disabled={(function(){
                    const raw = (emailInput || '').trim();
                    if (!raw) return true;
                    const parts = raw.split(';').map((s)=>s.trim()).filter(Boolean);
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
              onChange={(e) => setThreshold(e.target.value)}
              required
              className="custom-select"
              disabled={optionsLoading || thresholdOptions.length === 0}
            >
              <option value="">{optionsLoading ? 'Loading...' : 'Select'}</option>
              {thresholdOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="modal-row">
            <label>Zones <span className="required">*</span></label>
            <MultiSelectDropdown
              options={zoneOptions}
              selectedValues={zones}
              onChange={setZones}
              placeholder={optionsLoading ? 'Loading...' : 'Select zones'}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="save-btn" disabled={saving || optionsLoading}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmailGroup;