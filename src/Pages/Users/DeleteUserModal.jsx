import React from 'react'
import { Modal, Button, Image } from 'react-bootstrap';
import trashImage from '../../Components/Assets/trash.png'; // adjust path accordingly
import Loader from '../CommonComponents/Loader';
import axios from 'axios';
const DeleteUserModal = ({ show, onClose, user, onDelete }) => {
  const API_URL = import.meta.env.VITE_API_URL; // API main url
  const token = sessionStorage.getItem("token"); // token
  const MainUsername = sessionStorage.getItem("username"); // username

  const handleDelete = async () => {
    try {
      let delteuser = user?.username;
      let deletePayload = {
        username: delteuser,
        mainusername: MainUsername,
      };
      console.log(token);
      console.log(deletePayload);
      let response = await axios.post(
        `${API_URL}/settings/users/deleteUser`,
        deletePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(token);
      console.log(response);
      onClose();
      onDelete(response);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(user)
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center delete_Modal_body">
        <Image
          src={trashImage}
          alt="Trash Bin"
          style={{ width: '800', height: '200px' }}
          className="mb-3"
        />
        <h5>Do you want to delete <strong>"{user?.username}"</strong> User?</h5>
        <div className='loaderSection'>
          {/* <Loader /> */}
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button variant="outline-primary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
