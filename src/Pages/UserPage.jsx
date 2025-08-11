// UserPage.js
import React, { useState, useEffect, useRef } from "react";
import { Tab, Nav, Table, Button, Form } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../Components/Styles/UsersPage.css";
import DataTable from "react-data-table-component";
import SearchBar from "./CommonComponents/SearchBar";
import Buttons from "./CommonComponents/Button";
import { FaSave, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddUserModal from "../Pages/Users/AddUserModel";
import UserFormModal from "../Pages/Users/AddUser";
import DeleteUserModal from "./Users/DeleteUserModal";
import ViewUser from "./Users/ViewUser";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaPlus } from 'react-icons/fa';  // Font Awesome icon

const UserPage = () => {
  const [showModal, setShowModal] = useState(false); // add popup modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // delete popup modal
  const [showView, setShowView] = useState(false); // View popup modal
  const [query, setQuery] = React.useState(""); // search option
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null); // Selected Row
  const [users, setUsers] = useState(null); // add user
  const [editUser, seteditUser] = useState(null); // edit user
  const [selectedUser, setSelectedUser] = useState({}); // selected user
  const [zoneOptions, setZoneOptions] = useState([]); // selected for mainuser
  const API_URL = import.meta.env.VITE_API_URL; // API main url
  const tableWrapperRef = useRef(null); // div wrapper
  const hasFetchedRef = useRef(false); // API  cals only once
  const token = sessionStorage.getItem("token"); // token
  const vid = sessionStorage.getItem("vid"); // vendor id
  const MainUsername = sessionStorage.getItem("username"); // username
  const columns = [
    {
      name: "SL",
      selector: (row) => row.SL,
    },
    {
      name: "UserName",
      selector: (row) => row.UserName,
    },
    {
      name: "Role",
      selector: (row) => row.UserType,
    },
    {
      name: "Email",
      selector: (row) => row.UserEmailID,
    },
  ];
  //---------------------filter the users for search option-----------------------------------------
  const filteredProducts =
    users != null
      ? users.filter(
          (users) =>
            users.UserName &&
            users.UserName.toLowerCase().includes(query.toLocaleLowerCase())
          // ||
          // (data.year && data.year.toLowerCase().includes(filterText.toLocaleLowerCase()))
        )
      : "";

  // ----------------- Detect click outside table and reset selected row-----------------------------
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // -----------------Highlight selected row background color-------------------------------------------
  const conditionalRowStyles = [
    {
      when: (row) => row.id === selectedRowId,
      style: {
        backgroundColor: "#f6f7fc",
      },
    },
  ];
  //-------------------------Get the All sub users based on main user-----------------------------------------------------
  const fetchUsers = async () => {
    try {
      const payload = {
        vid,
        username: MainUsername,
      };
      const [userRes, zoneRes] = await Promise.all([
        axios.post(`${API_URL}/settings/users/subusers`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.post(`${API_URL}/settings/users/allzones`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      const formatted = zoneRes.data?.allZones.map((zone) => ({
        label: zone.Zonename, // or whatever the API returns
        value: zone.Sl,
      }));
      setZoneOptions(formatted);
      setUsers(userRes.data?.users); // or response.data.users depending on API structure
      // setLoading(false);
    } catch (err) {
      // setError("Failed to load users");
      // setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchUsers();
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  };

  //-------------------Handling user methods -------------------------------------------------------------

  const handleAddUser = () => {
    seteditUser(null);
    setShowModal(true);
  };
  // const handleRowClick = (row) => {
  //   setSelectedRowId(row);
  //   // console.log(row)
  // };
  const handleViewUser = () => {
    let Viewuser =
      users != null
        ? users.filter((user) => user.SL === selectedRowId)
        : selectedRowId;
    console.log(Viewuser);
    const [vuser] = Viewuser;
    setSelectedUser(vuser);
    setShowView(true);
  };

  const handleEditClick = () => {
    let Viewuser =
      users != null
        ? users.filter((user) => user.SL === selectedRowId)
        : selectedRowId;
    const [vuser] = Viewuser;
    seteditUser(vuser);
    setShowModal(true);
  };

  const PostData = async (payload1) => {
    try {
      let response = await axios.post(
        `${API_URL}/settings/users/createOrUpdateUser`,
        payload1,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };
  //----------------------- Handling Add user ----------------------------------------------------------------
  const handleAddOrUpdate = async (formData) => {
    const payload = {
      username: formData?.username,
      mainusername: username,
      password: formData?.password,
      useremailid: formData?.useremailid,
      usertype: formData?.usertype,
      useraddress: formData?.useraddress,
      healthmail: formData?.receiveHealthMail,
      userblock: formData?.userblock,
      zonename: formData?.selectedZones.map((zone) => zone.label).join(";"),
      selected: editUser ? "Update" : "Insert",
    };
    if (editUser) {
      PostData(payload);
      seteditUser(null);
      setShowModal(false);
    } else {
      PostData(payload);
      setShowModal(false);
      toast("User Added Successfully!!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  //-------------------------Handling Delete user --------------------------------------------------------------
  const handleDeleteUser = async () => {
    let deleteUser =
      users != null
        ? users.filter((user) => user.SL === selectedRowId)
        : selectedRowId;
    const [vuser] = deleteUser;
    console.log(vuser);
    setSelectedUser(vuser);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      let delteuser = selectedUser?.UserName;
      let deletePayload = {
        username: delteuser,
        mainusername: MainUsername,
      };
      let response = await axios.post(
        `${API_URL}/settings/users/deleteUser`,
        deletePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
    console.log(selectedUser);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };
  //---------------- Table Header fixed --------------------------------------------------------------------------
  const Template = (args) => <FixedHeaderStory {...args} />;

  const FixedHeader = Template.bind({});

  FixedHeader.args = {
    fixedHeader: true,
    fixedHeaderScrollHeight: "300px",
  };

  return (
    <div className="Usercontainer">
      <ToastContainer />
      {/* <div className="userHeaderSec">
        <h4>User</h4>
      </div> */}
      <div className="d-flex p-3 rounded mb-3 profilesec">
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
          <h5>Demo_Admin</h5>
          <p className="text-muted mb-1">Admin</p>
          <p>Zuna Bazar, Office 24, Lloyar Colony, Delhi</p>
          <Button variant="primary" size="sm">
            Edit Profile
          </Button>
        </div>
      </div>
      <div className="tabsec">
        <Tab.Container defaultActiveKey="users">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="users">All User(s)</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="zones">Zone(s)</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="bg-white border p-3">
            <Tab.Pane eventKey="zones"></Tab.Pane>

            <Tab.Pane eventKey="users">
              <div className="UserTable_TopSection" ref={tableWrapperRef}>
                {/* <h1>All Users</h1> */}
                <div className="UserTable_Section">
                  <div className="searchandBtSection">
                    <div className="searchbarsec">
                      <SearchBar
                        placeholder="Search Users..."
                        onSearch={setQuery}
                      />
                    </div>
                    <div className="buttonsSections">
                      <div className="p-4">
                        <Buttons
                          text="View"
                          type="button"
                          size="md"
                          variant="primary"
                          onClick={handleViewUser}
                          icon={<FaPlus />}
                          disabled={!selectedRowId}
                        />{" "}
                        <Buttons
                          text="Edit"
                          type="button"
                          size="md"
                          variant="primary"
                          onClick={handleEditClick}
                          icon={<FaPlus />}
                          disabled={!selectedRowId}
                        />{" "}
                        <Buttons
                          text="Delete"
                          type="button"
                          size="md"
                          variant="primary"
                          onClick={handleDeleteUser}
                          icon={<FaPlus />}
                          disabled={!selectedRowId}
                        />{" "}
                        <Buttons
                          text="Add User"
                          type="button"
                          size="md"
                          variant="primary"
                          onClick={handleAddUser}
                          icon={<FaPlus />}
                        />{" "}
                        <UserFormModal
                          show={showModal}
                          handleClose={() => setShowModal(false)}
                          onSave={handleAddOrUpdate}
                          editingUser={editUser}
                          Zones={zoneOptions}
                        />
                        <DeleteUserModal
                          show={showDeleteModal}
                          onClose={() => setShowDeleteModal(false)}
                          user={selectedUser}
                          onDelete={handleDelete}
                        />
                        <ViewUser
                          show={showView}
                          handleClose={() => setShowView(false)}
                          user={selectedUser}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                    {/* const FixedHeaderStory = ({ fixedHeader, fixedHeaderScrollHeight }) => ( */}
                    <DataTable
                      columns={columns}
                      data={filteredProducts}
                      onRowClicked={(row) => setSelectedRowId(row.SL)}
                      highlightOnHover
                      pointerOnHover
                      selectableRowsHighlight
                      conditionalRowStyles={conditionalRowStyles}
                      pagination
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 15]}
                      responsive
                      fixedHeader={FixedHeader}
                      fixedHeaderScrollHeight={
                        FixedHeader.fixedHeaderScrollHeight
                      }
                    />
                  </div>
                </div>
              </div>
              {/* <p>Camera data section (you can customize this).</p> */}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};
export default UserPage;
