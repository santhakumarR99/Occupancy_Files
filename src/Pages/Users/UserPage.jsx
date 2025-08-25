import React, { useState, useEffect, useRef } from "react";
import { Tab, Nav, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaPlus } from "react-icons/fa";
import SearchBar from "../CommonComponents/SearchBar";
import Buttons from "../CommonComponents/Button";
import UserFormModal from "./AddUser";
import DeleteUserModal from "./DeleteUserModal";
import ViewUser from "./ViewUser";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userprofileimage from "../../Components/Assets/users/profile_image.png";
import Loader from "../CommonComponents/Loader";
import { showError, showInfo, showSuccess } from "../CommonComponents/Toaster";
import EditProfile from "./EditProfile";
const UserPage = () => {
  // State declarations
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [users, setUsers] = useState(null);
  const [editUser, seteditUser] = useState(null);
  const [userZones, setUserSelectedZones] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [zoneOptions, setZoneOptions] = useState([]);
  const [getUserProfile, setUserProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("token");
  const vid = sessionStorage.getItem("vid");
  const MainUsername = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");

  const tableWrapperRef = useRef(null);
  const hasFetchedRef = useRef(false);

  // Detect click outside to reset selection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableWrapperRef.current &&
        !tableWrapperRef.current.contains(event.target)
      ) {
        setSelectedRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Row style for selected row highlight
  const conditionalRowStyles = [
    {
      when: (row) => row.sl === selectedRowId,
      style: {
        backgroundColor: "#f6f7fc",
      },
    },
  ];

  // Fetch users, zones and profile data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const payload = { vid, username: MainUsername };
      const [userRes, zoneRes, profiledata] = await Promise.all([
        axios.post(`${API_URL}/settings/users/subusers`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.post(`${API_URL}/settings/users/allzones`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.post(`${API_URL}/settings/users/userProfile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const formattedZones = zoneRes.data?.allZones.map((zone) => ({
        label: zone.zonename,
        value: zone.sl,
      }));
      setUserProfile(profiledata.data);
      setZoneOptions(formattedZones);
      setUsers(userRes.data?.users);
      console.log(profiledata)
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user profile info
  const GetUserProfile = async (userdata) => {
    try {
      let response = await axios.post(
        `${API_URL}/settings/users/userProfile`,
        userdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      seteditUser(response.data?.user[0]);
      setUserSelectedZones(response.data);
      setSelectedUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchUsers();
    GetUserProfile({ vid, username: MainUsername });
  }, []);

  // User action handlers
  const handleAddUser = () => {
    seteditUser(null);
    setUserSelectedZones(null);
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleViewUser = () => {
    setSelectedUser(null);
    let Viewuser =
      users != null
        ? users.filter((user) => user.sl === selectedRowId)
        : selectedRowId;
    const getpayload = { vid, username: Viewuser[0].username };
    GetUserProfile(getpayload);
    setShowView(true);
  };

  const handleEditClick = () => {
    let Viewuser =
      users != null
        ? users.filter((user) => user.sl === selectedRowId)
        : selectedRowId;
    const getpayload = { vid, username: Viewuser[0].username };
    GetUserProfile(getpayload);
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    let deleteUser =
      users != null
        ? users.filter((user) => user.sl === selectedRowId)
        : selectedRowId;
    const [vuser] = deleteUser;
    setSelectedUser(vuser);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    fetchUsers();
  };

   const EditUserProfile=()=>{
    setShowProfileModal(true)
   }

   // Add and Update data using api call
  const handleAddOrUpdate = async (formData) => {
    setIsSaving(true);
    const payload = {
      username: formData?.username,
      mainusername: MainUsername,
      password: formData?.password,
      useremailid: formData?.useremailid,
      usertype: formData?.usertype,
      useraddress: formData?.useraddress,
      healthmail: formData?.receiveHealthMail,
      userblock: formData?.userblock,
      zonename: formData?.selectedZones.map((zone) => zone.label).join(","),
      selected: editUser ? "Update" : "Insert",
    };
    console.log(payload)
    try {
      const response = await axios.post(
        `${API_URL}/settings/users/createOrUpdateUser`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      fetchUsers();
      showSuccess(
        editUser ? "User Updated Successfully!!!" : "User Added Successfully!!!"
      );
      setShowModal(false);
      seteditUser(null);
    } catch (error) {
      console.log(error);
      showError("Failed to save user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
 const UpdateProfile = async(formData)=>{
  // console.log(formData)
   setIsSaving(true);
    const payload = {
      username: formData?.username,
      mainusername: MainUsername,
      password: formData?.password,
      useremailid: formData?.useremailid,
      usertype: formData?.usertype,
      useraddress: formData?.useraddress,
      healthmail: formData?.receiveHealthMail,
      userblock: false,
      // zonename: formData?.selectedZones.map((zone) => zone.label).join(","),
      selected: "UpdateUser" 
    };

    try {
      const response = await axios.post(
        `${API_URL}/settings/users/createOrUpdateUser`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      fetchUsers();
      showSuccess( "User Profile Updated Successfully!!!");
      setShowModal(false);
      setUserProfile(null);
    } catch (error) {
      console.log(error);
      showError("Failed to save user. Please try again.");
    } finally {
      setIsSaving(false);
    }

 }
  // Table columns
  const columns = [
    { name: "SL", selector: (row) => row.sl, width: "100px" },
    { name: "USER NAME", selector: (row) => row.username },
    { name: "USER TYPE", selector: (row) => row.usertype },
    { name: "EMAIL", selector: (row) => row.useremailid },
  ];

  const Zonecolumns = [
    { name: "SL", selector: (row) => row.sl, width: "100px" },
    { name: "ZONE NAME", selector: (row) => row.zonename },
  ];

  // Filtering for search
  const filteredProducts =
    users != null
      ? users.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const filteredZones = Array.isArray(getUserProfile?.allZones)
    ? getUserProfile.allZones.filter((zone) =>
        zone.zonename?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Custom DataTable styles
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
        minHeight: "48px",
        "&:hover": {
          backgroundColor: "#f0f9ff",
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #ddd",
        padding: "10px",
        fontFamily: "Inter, sans-serif",
      },
    },
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="Usercontainer">
        <ToastContainer />
        <div className="d-flex p-3 pb-2 rounded profilesec">
          <div className="me-3 imageSec">
            {userprofileimage && (
              <img
                src={userprofileimage}
                alt="Profile"
                className="profile_image"
                width={140}
                height={140}
              />
            )}
          </div>
          {getUserProfile?.user && getUserProfile.user.length > 0 ? (
            <div className="flex-grow-1 usersection_profile">
              <h5 className="user_username">
                {getUserProfile.user[0].username}
              </h5>
              <p className="user_usertype mb-2">
                {getUserProfile.user[0].usertype}
              </p>
              <p className="user_useraddress">
                {getUserProfile.user[0].useraddress}
              </p>
              <Button variant="primary" onClick={EditUserProfile}>Edit Profile</Button>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>

        <div className="tabsec">
          <Tab.Container defaultActiveKey="zones">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="zones">All Zone(s)</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">All User(s)</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="bg-white border p-3 pt-2">
              <Tab.Pane eventKey="zones">
                <div className="UserTable_TopSection" ref={tableWrapperRef}>
                  <div className="UserTable_Section">
                    <div className="searchandBtSection">
                      <div className="searchbarsec flex-grow-1">
                        <SearchBar
                          placeholder="Search Zones..."
                          onSearch={setQuery}
                        />
                      </div>
                    </div>
                    <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                      <DataTable
                        columns={Zonecolumns}
                        data={filteredZones}
                        highlightOnHover
                        pointerOnHover
                        selectableRowsHighlight
                        conditionalRowStyles={conditionalRowStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        responsive
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="users">
                <div className="UserTable_TopSection" ref={tableWrapperRef}>
                  <div className="UserTable_Section">
                    <div className="searchandBtSection">
                      <div className="searchbarsec">
                        <SearchBar
                          placeholder="Search Users..."
                          onSearch={setQuery}
                        />
                      </div>
                      <div className="buttonsSections">
                        <div className="p-4 pt-1">
                          {role !== "Viewer" && (
                            <>
                              <Buttons
                                text="View"
                                type="button"
                                size="md"
                                variant="primary"
                                onClick={handleViewUser}
                                icon={<FaPlus />}
                                disabled={!selectedRowId}
                              />
                              <Buttons
                                text="Edit"
                                type="button"
                                size="md"
                                variant="primary"
                                onClick={handleEditClick}
                                icon={<FaPlus />}
                                disabled={!selectedRowId}
                              />
                              <Buttons
                                text="Delete"
                                type="button"
                                size="md"
                                variant="primary"
                                onClick={handleDeleteUser}
                                icon={<FaPlus />}
                                disabled={!selectedRowId}
                              />
                              <Buttons
                                text="Add User"
                                type="button"
                                size="md"
                                variant="primary"
                                onClick={handleAddUser}
                                icon={<FaPlus />}
                              />
                            </>
                          )}
                          <UserFormModal
                            show={showModal}
                            handleClose={() => setShowModal(false)}
                            onSave={handleAddOrUpdate}
                            editingUser={editUser}
                            Zones={zoneOptions}
                            userdata={userZones}
                            isSaving={isSaving}
                          />

                          <DeleteUserModal
                            show={showDeleteModal}
                            handleClose={() => setShowDeleteModal(false)}
                            user={selectedUser}
                            onDelete={handleDelete}
                          />
                          <ViewUser
                            show={showView}
                            handleClose={() => setShowView(false)}
                            user={selectedUser}
                            zones={userZones}
                          />
                          <EditProfile 
                           show={showProfileModal}
                           handleClose={() => setShowProfileModal(false)}
                           onSave={UpdateProfile}
                           selectedMainuser={getUserProfile}
                           isSaving={isSaving}
                            />
                        </div>
                      </div>
                    </div>
                    <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                      <DataTable
                        columns={columns}
                        data={filteredProducts}
                        onRowClicked={(row) => setSelectedRowId(row.sl)}
                        highlightOnHover
                        pointerOnHover
                        selectableRowsHighlight
                        conditionalRowStyles={conditionalRowStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        responsive
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
};

export default UserPage;
