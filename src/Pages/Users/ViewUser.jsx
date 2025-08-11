import React, { useState, useEffect, useRef } from "react";
import { Tab, Nav, Table, Button, Form, Modal } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import DataTable from "react-data-table-component";
import SearchBar from "../CommonComponents/SearchBar";
import "../../Components/Styles/UsersPage.css";
const ViewUser = ({ show, handleClose, user }) => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = React.useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(user);
  const columns = [
    {
      name: "UserName",
      selector: (row) => row.user,
    },
    {
      name: "Role",
      selector: (row) => row.userType,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
  ];
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>View User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-start">
          <div className="d-flex  profilesec">
            <div className="me-3 imageSec">
              {selectedFile ? (
                <img
                  src={selectedFile}
                  alt="Profile"
                  className="rounded-circle"
                  width={120}
                  height={120}
                />
              ) : (
                <FaUserCircle size={120} color="#ccc" />
              )}
              {/* <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="form-control mt-2"
          /> */}
            </div>

            <div className="flex-grow-1">
              <h5>{user ? user.UserName : ""}</h5>
              <p className="text-muted mb-1">{user ? user.UserType : ""}</p>
              <p>
                {user
                  ? user.UserAddress
                  : "Zuna Bazar, Office 24, Lloyar Colony, Delhi"}
              </p>
              <Button variant="primary" size="sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        {/* 
        <Form.Control
          type="text"
          placeholder="Search"
          className="my-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        <div className="tabsec_Viewuser">
          <SearchBar placeholder="Search Users..." onSearch={setQuery} />
          <div
            className="tab_div_Container"
            style={{ maxHeight: "400px", overflowY: "scroll" }}
          >
            <DataTable
              columns={columns}
              highlightOnHover
              pointerOnHover
              selectableRowsHighlight
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              responsive
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewUser;
