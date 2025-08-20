import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import "../../Components/Styles/Table.css";
import { Tab, Nav, Table, Button, Form } from "react-bootstrap";
import SearchBar from "../CommonComponents/SearchBar";
import Buttons from "../CommonComponents/Button";
import { FaSave, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddZone from "./AddZones";
export default function GetAllZoneList() {
    const [showModal, setShowModal] = useState(false); // add popup modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // delete popup modal
  const [showView, setShowView] = useState(false); // View popup modal
  const [query, setQuery] = React.useState(""); // search option
  const tableWrapperRef = useRef(null); // div wrapper
  const [zones, setZones] = useState(null); // add Zone
  const [editZone, seteditZone] = useState(null); // edit Zone
    const [selectedZone, setSelectedZone] = useState({}); // selected Zone
  const [selectedRowId, setSelectedRowId] = useState(null); // Selected Row

  const columns = [
    {
      name: "SL",
      selector: (row) => row.id,
    },
    {
      name: "Zone(s) Name",
      selector: (row) => row.zoneName,
    },
    {
      name: "Address",
      selector: (row) => row.country + ","+ row.city,
    },
  ];
  //---------------------filter the users for search option-----------------------------------------
  const filteredProducts =
    zones != null
      ? zones.filter(
          (zones) =>
            zones.zoneName &&
            zones.zoneName.toLowerCase().includes(query.toLocaleLowerCase())
          // ||
          // ( zones.address &&
          //   zones.address.toLowerCase().includes(query.toLocaleLowerCase()))
        )
      : "";
console.log(filteredProducts)
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
  //-------------------------Stored in local storage-----------------------------------------------------
  const LOCAL_KEY = "zone_data";

  // Load from local storage
  useEffect(() => {
    const getParsedStorageItem = (key) => {
      try {
        const item = localStorage.getItem(key);
        let data = item ? JSON.parse(item) : null;
        console.log(data);
        setZones(data);
      } catch (err) {
        console.error("Invalid JSON in sessionStorage for key:", key);
        return null;
      }
    };
    const storedUser = getParsedStorageItem("zone_data");
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  };

    const handleAddZones = () => {
    // seteditUser(null);
    setShowModal(true);
  };
//----------------------- Handling Add user ----------------------------------------------------------------
  const handleAddOrUpdateZone = (formData) => {
    let updated;
    if (editZone) {
      // Update existing user
      updated = zones.map((ezone) =>
        ezone.id === editZone.id ? { ...ezone, ...formData } : ezone
      );
      setZones(updated);
      seteditZone(null);
    } else {
      // Add new user
      const newZone = { ...formData, id: zones ? zones.length + 1 : 1 };
      
      zones? updated = [...zones, newZone] : updated = [newZone] 
      setZones(updated);
    }

    saveToLocal(updated);
    console.log(updated);
    // setEditIndex(null);
  };
//------------------------------- Edit Zones --------------------------------------------------------------------

  const handleEditClick = () => {
    let Viewzones =
      zones != null
        ? zones.filter((zone) => zone.id === selectedRowId)
        : selectedRowId;
    const [vzone] = Viewzones;
    seteditZone(vzone);
    setShowModal(true);
  };

  return (
    <div className="Usercontainer">
      <div className="tabsec">
        <Tab.Container defaultActiveKey="zones">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="zones">Zone Lists</Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link eventKey="zones">Zone(s)</Nav.Link>
            </Nav.Item> */}
          </Nav>

          <Tab.Content className="bg-white border p-3">
            {/* <Tab.Pane eventKey="zones"></Tab.Pane> */}
            <Tab.Pane eventKey="zones">
              <div className="UserTable_TopSection" ref={tableWrapperRef}>
                {/* <h1>All Users</h1> */}
                <div className="UserTable_Section">
                  <div className="searchandBtSection">
                    <div className="searchbarsec">
                      <SearchBar
                        placeholder="Search Zones..."
                        onSearch={setQuery}
                      />
                    </div>
                    <div className="buttonsSections">
                      <div className="p-4">
                        <Buttons
                          text="View Service Area Entry/Exit"
                          type="button"
                          size="md"
                          variant="primary"
                          //   onClick={handleViewUser}
                          //   icon={<FaPlus />}
                          disabled={!selectedRowId}
                        />{" "}
                        <Buttons
                          text="Edit Zone"
                          type="button"
                          size="md"
                          variant="primary"
                            onClick={handleEditClick}
                          icon={<FaPlus />}
                          disabled={!selectedRowId}
                        />{" "}
                        <Buttons
                          text="Delete Zone"
                          type="button"
                          size="md"
                          variant="primary"
                          //   onClick={handleDeleteUser}
                          icon={<FaPlus />}
                          disabled={!selectedRowId}
                        />{" "}
                        <Buttons
                          text="Add Zone"
                          type="button"
                          size="md"
                          variant="primary"
                          onClick={handleAddZones}
                          icon={<FaPlus />}
                        />{" "}
                         <AddZone
                          show={showModal}
                          handleClose={() => setShowModal(false)}
                          onSave={handleAddOrUpdateZone}
                          editingUser={editZone}
                        />
                        {/* <DeleteUserModal
                          show={showDeleteModal}
                          onClose={() => setShowDeleteModal(false)}
                          user={selectedUser}
                          onDelete={handleDelete}
                        />
                        <ViewUser
                          show={showView}
                          handleClose={() => setShowView(false)}
                          user={selectedUser}
                        />  */}
                      </div>
                    </div>
                  </div>
                  <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                    {/* const FixedHeaderStory = ({ fixedHeader, fixedHeaderScrollHeight }) => ( */}
                    <DataTable
                      columns={columns}
                      data={filteredProducts}
                      // onRowClicked={(row) => setSelectedRowId(row.id)}
                      highlightOnHover
                      pointerOnHover
                      selectableRowsHighlight
                      conditionalRowStyles={conditionalRowStyles}
                      pagination
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 15]}
                      responsive
                      //   fixedHeader={FixedHeader}
                      //   fixedHeaderScrollHeight={
                      //     FixedHeader.fixedHeaderScrollHeight
                      //   }
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
}
