import React, { useState, useEffect, useRef } from "react";
import { Tab, Nav, Table, Button, Form, Modal } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import DataTable from "react-data-table-component";
import SearchBar from "../CommonComponents/SearchBar";
import "../../Components/Styles/UsersPage.css";
import axios from "axios";
import viewprofileimg from "../../Components/Assets/users/userprofile_1.png"
const ViewUser = ({ show, handleClose, user }) => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = React.useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userdata, setUserdata] = useState({});
  const [allZones, setAllZones] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // API main url
  const token = sessionStorage.getItem("token"); // token
  const vid = sessionStorage.getItem("vid"); // vendor id
  const MainUsername = sessionStorage.getItem("username"); // username
  useEffect(() => {
    if (Array.isArray(user?.user) && user.user.length > 0) {
      setUserdata(user.user[0]);
    }
    if (Array.isArray(user?.mappedZones)) {
      setAllZones(user.mappedZones);
    }
  }, [user]);
   console.log(user)
  const columns = [
    {
      name: "SL",
      selector: (row) => row.SL,
       width: "100px"
    },
    {
      name: "ZONE NAME",
      selector: (row) => row.zonename,
    },
  ];
  //---------------------filter the users for search option-----------------------------------------
  const filteredZones =
    allZones != null
      ? allZones.filter(
          (zones) =>
            zones.zonename &&
            zones.zonename.toLowerCase().includes(query.toLocaleLowerCase())
        )
      : "";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#ffffff", 
      color: "black", 
      fontWeight: "300",
      fontSize: "14px",
      textTransform: "uppercase",
      borderBottom: "2px solid #ddd",
      fontFamily: "Inter, sans-serif",
    },
  },
  cells: {
    style: {
      fontSize: "16px",
       fontWeight: "400",
      padding: "10px 15px",
      fontFamily: "Inter, sans-serif",
    },
  },
  rows: {
    style: {
      minHeight: "48px", // row height
      '&:hover': {
        backgroundColor: "#f0f9ff", // hover background
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
      },
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #ddd",
      padding: "10px",
      fontFamily: "Inter, sans-serif"
    },
  },
};

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton className="pb-1">
        <Modal.Title>View User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-start">
          <div className="d-flex  profilesec">
            <div className=" ">
              {viewprofileimg ? (
                <img
                  src={viewprofileimg}
                  alt="Profile"
                  className="profile_image"
                  width={100}
                  height={100}
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

            <div className="flex-grow-1 viewerSection">
              <h5 className="view_username">
                {userdata ? userdata.username : ""}
              </h5>
              <p className="View_usertype">
                {userdata ? userdata.usertype : ""}
              </p>
              <p className="View_userdata">
                {userdata ? userdata.address : ""}
              </p>
              {/* <Button variant="primary" size="sm">
                Edit Profile
              </Button> */}
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

        <div className="tabsec_Viewuser pt-2">
          <SearchBar placeholder="Search Zones..." onSearch={setQuery} />
          <div
            className="tab_div_Container"
            style={{ maxHeight: "400px", overflowY: "scroll" }}
          >
            <DataTable
              columns={columns}
              data={filteredZones}
              highlightOnHover
              pointerOnHover
              selectableRowsHighlight
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              responsive
              customStyles={customStyles}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewUser;
