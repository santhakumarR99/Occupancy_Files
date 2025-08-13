import React, { useState, useEffect } from "react";
import AddEmailGroupModal from "./AddEmailGroupModal";
import EditEmailGroup from "./EditEmailGroup";
import GroupSavedModal from "./GroupSavedModal";
import DeleteEmailGroup from "./DeleteEmailGroup";
import "./EmailTab.css";

const API_URL = "http://localhost:3001/emailGroup";

const EmailGroupTable = () => {
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch groups from API
  const fetchGroups = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setGroups(Array.isArray(data) ? data : data.emailGroup))
      .catch(err => console.error("Failed to fetch groups", err));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => setShowAddModal(true);

  const handleEdit = () => {
    if (selectedGroup) setShowEditModal(true);
  };

  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    if (selectedGroup) {
      await fetch(`${API_URL}/${selectedGroup.id}`, { method: "DELETE" });
      setShowDeleteModal(false);
      setSelectedGroup(null);
      fetchGroups();
    }
  };

  const cancelDelete = () => setShowDeleteModal(false);

  return (
    <div className="group-table-container">
      <div className="group-table-header">
        <input
          className="search-input"
          placeholder="Search"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setSelectedGroup(null);
          }}
        />
        <div>
          <button className="edit-btn" disabled={!selectedGroup} onClick={handleEdit}>
            Edit Group
          </button>
          <button className="delete-btn" disabled={!selectedGroup} onClick={handleDelete}>
            Delete Group
          </button>
          <button className="add-btn" onClick={handleAdd}>
            + Add Group
          </button>
        </div>
      </div>

      <table className="group-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>GROUP(S) NAME</th>
            <th>Emails</th>
            <th>Threshold</th>
            <th>Zones</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.length === 0 ? (
            <tr><td colSpan="5">No groups found</td></tr>
          ) : (
            filteredGroups.map((group, idx) => (
              <tr
                key={group.id}
                className={selectedGroup && selectedGroup.id === group.id ? "selected-row" : ""}
                onClick={() => setSelectedGroup(group)}
                style={{ cursor: "pointer" }}
              >
                <td>{idx + 1}</td>
                <td>{group.groupName}</td>
                <td>{group.emails.join(", ")}</td>
                <td>{group.threshold}</td>
                <td>{group.zones.join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showAddModal && (
        <AddEmailGroupModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchGroups();
            setShowSavedModal(true);
          }}
        />
      )}

      {showEditModal && selectedGroup && (
        <EditEmailGroup
          groupId={selectedGroup.id}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            fetchGroups();
            setShowSavedModal(true);
          }}
        />
      )}

      <GroupSavedModal
        show={showSavedModal}
        onClose={() => setShowSavedModal(false)}
      />

      {showDeleteModal && selectedGroup && (
        <DeleteEmailGroup
          onCancel={cancelDelete}
          onDelete={confirmDelete}
        />
      )}
    </div>
  );
};

export default EmailGroupTable;