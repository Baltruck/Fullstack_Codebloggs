import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const UserEdit = ({ user, showEditModal, handleClose, handleUpdate }) => {
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      birthday: "",
      status: "",
      email: "",
      password: "",
      location: "",
      occupation: "",
      auth_level: "",
    });
  
    useEffect(() => {
        if (user) {
          const birthday = new Date(user.birthday).toISOString().split("T")[0];
      
          setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: birthday,
            email: user.email,
            password: user.password,
            location: user.location,
            occupation: user.occupation,
          });
        }
      }, [user]);
      
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(user._id, formData);
      };
      

    return (
        <Modal show={showEditModal} onHide={handleClose} contentClassName="status-card main-card mainFromLogo animated-border" centered>
          <Modal.Header style={{ border: "0", padding: "1rem 1rem" }}>
            <Modal.Title className="modal-text-title">Edit user</Modal.Title>
          </Modal.Header>
          <div className="inside-post-container">
          <Modal.Body className="text-black" style={{ border: "0", padding: "1rem 1rem" }}>
          <Form id="editUserForm" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </Form.Group>
                <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control

                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Occupation</Form.Label>
                <Form.Control
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Authorization level</Form.Label>
                <Form.Control
                    type="text"
                    name="auth_level"
                    value={formData.auth_level}
                    onChange={handleChange}
                />
                </Form.Group>
                <Button variant="primary" type="submit" className="custom-submit-btn">
                Edit
                </Button>
            </Form>
            </Modal.Body>
            </div>
              <Modal.Footer style={{ border: "0", padding: "1rem 1rem" }}>
                <Button variant="secondary" onClick={handleClose} className="custom-close-btn">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} className="custom-submit-btn">
  Save
</Button>

              </Modal.Footer>
            </Modal>
    );
    };



  export default UserEdit;