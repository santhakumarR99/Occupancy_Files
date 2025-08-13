import React from 'react';
import './MainLayout.css';

const MainLayout = ({ children, onAdd, onEdit, onDelete, disableEdit, disableDelete }) => (
  <div className="main-layout">
    <div className="main-header">
      <div className="actions">
        <button className="main-btn" onClick={onEdit} disabled={disableEdit}>Edit Threshold</button>
        <button className="main-btn" onClick={onDelete} disabled={disableDelete}>Delete Threshold</button>
        <button className="main-btn" onClick={onAdd}>+ Add Threshold</button>
      </div>
    </div>
    <div className="main-content">
      {children}
    </div>
  </div>
);

export default MainLayout;
