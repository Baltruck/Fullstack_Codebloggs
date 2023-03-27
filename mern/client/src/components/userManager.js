import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import "./mainComponent.css";
// import "./userManager.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchFirstName.toLowerCase()) &&
      user.last_name.toLowerCase().includes(searchLastName.toLowerCase())
  );

  useEffect(() => {
    fetch("http://localhost:5000/get-all-users")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
        setUsers(sortedData);
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
    // fonction pour gérer l'édition d'un utilisateur
  };

  const handleDelete = (user) => {
    // fonction pour supprimer un utilisateur
  };

  return (
    <div>
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
          className="um-button custom-submit-btn"
          type="submit"
          variant="primary"
        >
          Search
        </Button>
      </form>

      <div className="container-table">
        <div className="table-wrapper animated-border">
          <Table striped bordered hover className="table-custom table-centered">
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
              {filteredUsers
                .slice(
                  (currentPage - 1) * usersPerPage,
                  currentPage * usersPerPage
                )
                .map((user) => (
                  <tr key={user._id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
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
          className="um-button custom-submit-btn"
          variant="primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>{" "}
        <Button
          className="um-button custom-submit-btn"
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
    </div>
  );
};

export default UsersList;
