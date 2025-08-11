import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../../Components/Styles/Logout.css";
import logoutIcon from "../../Components/Assets/logout_icon.png";

const Logout = ({ show, handleClose, handleLogout }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal"  closeButton>
      {/* <Modal.Header >
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header> */}
      <Modal.Body className="text-center">
        <img src={logoutIcon} alt="Logout" className="logout-icon mb-3" />
        <h5 className="mb-4">Do you want to Logout</h5>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Logout;
