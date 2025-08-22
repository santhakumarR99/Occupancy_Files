import React from 'react';
import { createPortal } from 'react-dom';
import '../../Email/PopupModal.css';
import './DeleteThresholdModal.css';
import trashIcon from '../../../Components/Assets/trash.png';

const DeleteThresholdModal = ({ open, onClose, onDelete }) => {
  if (!open) return null;
  const content = (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box delete-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Delete Threshold</h3>
          <button aria-label="Close" className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-body">
          <div className="delete-icon">
            <img src={trashIcon} alt="Delete icon" />
          </div>
          <p className="delete-text">Do you want to delete this Threshold?</p>
        </div>
        <div className="popup-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="submit-btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
  return createPortal(content, document.body);
};

export default DeleteThresholdModal;
