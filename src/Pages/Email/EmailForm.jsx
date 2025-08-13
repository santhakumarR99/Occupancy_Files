import React, { useState } from "react";
import PopupModal from "./PopupModal";

const EmailForm = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handlePopupClose = () => setShowPopup(false);

  const handlePopupSubmit = () => {
    alert("Test mail sent!");
    setShowPopup(false);
  };

  return (
    <div>
      <div className="email-form-bg">
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-row">
            <div>
              <label>SMTP Server *</label>
              <input type="text" required />
            </div>
            <div>
              <label>SMTP Port *</label>
              <input type="text" required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Email *</label>
              <input type="email" required />
            </div>
            <div>
              <label>User Name *</label>
              <input type="text" required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Password *</label>
              <input type="password" required />
            </div>
            <div className="ssl-checkbox">
              <input type="checkbox" id="ssl" />
              <label htmlFor="ssl">Enable SSL *</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>


      <PopupModal
        show={showPopup}
        onClose={handlePopupClose}
        onSubmit={handlePopupSubmit}
      />
    </div>
  );
};

export default EmailForm;
