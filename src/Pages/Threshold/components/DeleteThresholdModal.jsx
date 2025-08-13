import React from 'react';
import { createPortal } from 'react-dom';
import './DeleteThresholdModal.css';
import trashIcon from '../../../Components/Assets/trash.png';

const DeleteThresholdModal = ({ open, onClose, onDelete }) => {
  if (!open) return null;
  const content = (
    <div className="threshold-modal-overlay">
      <div className="threshold-modal delete-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="threshold-modal-header">
          <h2>Delete Threshold</h2>
          <button aria-label="Close" className="icon-btn close-btn" onClick={onClose}>×</button>
        </div>
        <div className="delete-icon">
          <img src={trashIcon} alt="Delete icon" />
        </div>
        <p className="delete-text">Do you want to delete this Threshold?</p>
        <div className="form-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          {/* <button className="btn-btn Danger" onClick={onDelete}>Delete</button> */}
          <button type="button" className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
      <div className="threshold-backdrop" onClick={onClose} />
    </div>
  );
  return createPortal(content, document.body);
};

export default DeleteThresholdModal;
