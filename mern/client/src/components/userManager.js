import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import "./mainComponent.css";
// import "./userManager.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/get-all-users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
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

  const handleEdit = (user) => {
    // fonction pour gérer l'édition d'un utilisateur
  };

  const handleDelete = (user) => {
    // fonction pour supprimer un utilisateur
  };

  return (
    <div>
      <h1 className="umTitle">Users Management</h1>
      <div className="container-table">
        <div className="table-wrapper animated-border">
          <Table striped bordered hover className="table-custom table-centered">
            <thead>
              <tr>
                <th onClick={sortByFirstName} style={{ cursor: "pointer" }}>
                  First Name
                </th>
                <th onClick={sortByLastName} style={{ cursor: "pointer" }}>
                  Last Name
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => handleDelete(user)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
