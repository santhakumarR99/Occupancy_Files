import React from 'react'
import { Modal, Button, Image } from 'react-bootstrap';
import trashImage from '../../Components/Assets/trash.png'; // adjust path accordingly

const DeleteUserModal = ({ show, onClose, user, onDelete }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      size="sm"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center delete_Modal_body">
        <Image
          src={trashImage}
          alt="Trash Bin"
          style={{ width: '160', height: '160px' }}
          className="mb-3"
        />
        <h5>Do you want to delete this   <strong>{user?.user}</strong> User?</h5>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button variant="outline-primary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
