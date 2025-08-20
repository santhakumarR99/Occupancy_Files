import React from 'react';
import './DeleteEmailGroup.css';
import DeleteIcon from './DeleteIcon.png';

const DeleteEmailGroup = ({ onCancel, onDelete }) => {
  return (
    <div className="delete-dialog">
      <div className="icon">
        
        <div className="trash-icon">
          <img src={DeleteIcon} alt='Delete' />
        </div>
      </div>
      <h3>Do you want to delete this Email Group?</h3>
      <div className="button-group">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default DeleteEmailGroup;
