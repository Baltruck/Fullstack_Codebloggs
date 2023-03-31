import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal } from "react-bootstrap";
import "./mainComponent.css";
import UserEdit from "./userEdit";
import Skeleton from "react-loading-skeleton";
import "./Skeleton.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchFirstName.toLowerCase()) &&
      user.last_name.toLowerCase().includes(searchLastName.toLowerCase())
  );

  // refresh user data after edit
  const refreshUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-all-users");
      const data = await response.json();
      const sortedData = data.sort((a, b) =>
        a.first_name.localeCompare(b.first_name)
      );
      setUsers(sortedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/get-all-users")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
        setUsers(sortedData);
        setLoading(false);
      });
  }, []);

  const sortByFirstName = () => {
    setUsers(
      [...users].sort((a, b) => {
        if (sortAscending) {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return b.first_name.localeCompare(a.first_name);
        }
      })
    );
    setSortAscending(!sortAscending);
  };

  const sortByLastName = () => {
    setUsers(
      [...users].sort((a, b) => {
        if (sortAscending) {
          return a.last_name.localeCompare(b.last_name);
        } else {
          return b.last_name.localeCompare(a.last_name);
        }
      })
    );
    setSortAscending(!sortAscending);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  // To close the edit modal
  const handleClose = () => {
    setShowEditModal(false);
    setUserToEdit(null);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // To Edit the user
  async function handleUpdate(data, onSuccess) {
    try {
      const response = await fetch("http://localhost:5000/update-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();

      if (onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  const confirmDelete = () => {
    fetch("http://localhost:5000/delete-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userToDelete._id }),
    })
      .then((response) => response.json())
      .then(() => {
        setUsers(users.filter((user) => user._id !== userToDelete._id));
        setShowDeleteModal(false);
        setUserToDelete(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="um-main-container">
      <h1 className="umTitle">Users Management</h1>
      <form onSubmit={handleSearch} className="div-centered">
        <input
          className="search-input"
          type="text"
          placeholder="First Name"
          value={searchFirstName}
          onChange={(e) => setSearchFirstName(e.target.value)}
        />
        <input
          className="search-input"
          type="text"
          placeholder="Last Name"
          value={searchLastName}
          onChange={(e) => setSearchLastName(e.target.value)}
        />
        <Button
          className="um-button custom-submit-btn admin-btn"
          type="submit"
          variant="primary"
        >
          Search
        </Button>
      </form>

      <div className="container-table">
        <div className="table-wrapper animated-border">
          <Table
            striped
            bordered
            hover
            className="table-custom table-centered um-custom-table"
          >
            <thead>
              <tr>
                <th
                  onClick={sortByFirstName}
                  style={{ cursor: "pointer" }}
                  className="no-select"
                >
                  First Name
                </th>
                <th
                  onClick={sortByLastName}
                  style={{ cursor: "pointer" }}
                  className="no-select"
                >
                  Last Name
                </th>
                <th className="no-select">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: usersPerPage }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <Skeleton className="skeleton-text" width={100} />
                      </td>
                      <td>
                        <Skeleton className="skeleton-text" width={100} />
                      </td>
                      <td>
                        <Skeleton className="skeleton-text" width={150} />
                      </td>
                    </tr>
                  ))
                : filteredUsers
                    .slice(
                      (currentPage - 1) * usersPerPage,
                      currentPage * usersPerPage
                    )
                    .map((user) => (
                      <tr key={user._id}>
                        <td className="userListMan">{user.first_name}</td>
                        <td className="userListMan">{user.last_name}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(user)}
                            className="custom-edit-btn um-bot-btn"
                          >
                            Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
                            className="custom-delete-btn um-bot-btn"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="div-centered">
        <Button
          className="um-button custom-submit-btn admin-btn"
          variant="primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>{" "}
        <Button
          className="um-button custom-submit-btn admin-btn"
          variant="primary"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage))
            )
          }
          disabled={
            currentPage === Math.ceil(filteredUsers.length / usersPerPage)
          }
        >
          Next
        </Button>
      </div>
      <Modal
        show={showDeleteModal}
        onHide={closeModal}
        contentClassName="status-card main-card mainFromLogo animated-border"
        centered
      >
        <Modal.Header style={{ border: "0", padding: "1rem 1rem" }}>
          <Modal.Title className="modal-text-title">Confirm delete</Modal.Title>
        </Modal.Header>
        <div className="inside-post-container">
          <Modal.Body
            style={{ border: "0", padding: "1rem 1rem" }}
            className="text-black"
          >
            Are you sure you want to delete :{" "}
            {userToDelete &&
              `${userToDelete.first_name} ${userToDelete.last_name}`}{" "}
            ?
          </Modal.Body>
        </div>
        <Modal.Footer style={{ border: "0", padding: "1rem 1rem" }}>
          <Button
            variant="secondary"
            onClick={closeModal}
            className="custom-close-btn"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            className="custom-submit-btn"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <UserEdit
        user={userToEdit}
        showEditModal={showEditModal}
        handleClose={handleClose}
        handleUpdate={handleUpdate}
        refreshUserData={refreshUserData}
      />
    </div>
  );
};

export default UsersList;
