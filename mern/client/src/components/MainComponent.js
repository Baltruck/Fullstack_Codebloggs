import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";
import "./mainComponent.css";


const Main = () => {
  const [initials, setInitials] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await axios.patch(
        "/status",
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("userToken")}`,
          },
        }
      );
      setLoading(false);
      setShowModal(false);
      setNewStatus("");
  
      // Relancez le GET /userinfo pour mettre à jour le statut dans la page
      const response = await axios.get("/userinfo", {
        headers: {
          Authorization: `Bearer ${Cookies.get("userToken")}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error updating status:", error);
    }
  };
  

  useEffect(() => {
    const userName = Cookies.get("userName");
    if (userName) {
      const nameParts = userName.split(" ");
      console.log("UserName:", userName);
      console.log("nameParts:", nameParts);
     
      if (nameParts.length === 2) {
        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const secondInitial = nameParts[1].charAt(0).toUpperCase();
        const userInitials = `${firstInitial}${secondInitial}`;
        setInitials(userInitials);
        console.log("User initials:", userInitials);
      }
    }
    const token = Cookies.get("userToken");
    if (token) {
      axios
        .get("/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, []);

  return (
    <div className="main-container">
      <div className="left-column">
        <div className="initials-container animated-border-initials-container">
          {initials}
        </div>
        <Card className="status-card mainFromLogo animated-border">
  <Card.Body>
    <p className="text-black">Your Status: {userInfo.status}</p>
    <Button className="custom-submit-btn" onClick={() => setShowModal(true)}>Update it</Button>
  </Card.Body>
</Card>
<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Update Status</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="status">
        <Form.Label>New Status</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button
      variant="primary"
      onClick={handleUpdateStatus}
      disabled={loading}
    >
      {loading ? "Updating..." : "Update Status"}
    </Button>
  </Modal.Footer>
</Modal>

        <Card className="info-card mainFromLogo animated-border">
          <Card.Body>
          <p className="text-black">First Name: {userInfo.first_name}</p>
          <p className="text-black">Last Name: {userInfo.last_name}</p>
          <p className="text-black">Birthday: {userInfo.birthday}</p>
          <p className="text-black">Email: {userInfo.email}</p>
          <p className="text-black">Location: {userInfo.location}</p>
          <p className="text-black">Occupation: {userInfo.occupation}</p>
          </Card.Body>
        </Card>
      </div>
      <div className="right-column">
      </div>
    </div>
  );
};

export default Main;