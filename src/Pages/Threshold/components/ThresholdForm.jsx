import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ThresholdForm.css';

const ThresholdForm = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialData || {
    name: '',
    description: '',
    start: '',
    end: '',
    duration: '',
    smsTemplate: ''
  });

  // Keep form in sync when switching between add/edit
  useEffect(() => {
    if (open) {
      setForm(initialData || {
        name: '',
        description: '',
        start: '',
        end: '',
        duration: '',
        smsTemplate: ''
      });
    }
  }, [open, initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;

  // Close on ESC key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const content = (
    <div className="threshold-modal-overlay" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div
        className="threshold-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="threshold-modal-header">
          <h2>{initialData ? 'Edit Threshold' : 'Add Threshold'}</h2>
          <button aria-label="Close" className="icon-btn close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="threshold-form">
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label>Threshold Name <span className="req">*</span></label>
              <input
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Description</label>
              <input
                name="description"
                placeholder="Optional description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label>Threshold Start <span className="req">*</span></label>
              <input
                type="number"
                name="start"
                placeholder="e.g. 50"
                value={form.start}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Threshold End <span className="req">*</span></label>
              <input
                type="number"
                name="end"
                placeholder="e.g. 100"
                value={form.end}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label>Duration (Seconds) <span className="req">*</span></label>
              <input
                type="number"
                name="duration"
                placeholder="e.g. 60"
                value={form.duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label>SMS Template <span className="req">*</span></label>
              <select name="smsTemplate" value={form.smsTemplate} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Occupancy for <ZoneName> has remained above <Limit> ...">
                  Occupancy for &lt;ZoneName&gt; has remained above &lt;Limit&gt; ...
                </option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
      {/* Backdrop click to close */}
      <div className="threshold-backdrop" onClick={onClose} />
    </div>
  );

  return createPortal(content, document.body);
};

export default ThresholdForm;
