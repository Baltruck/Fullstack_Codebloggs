import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./mainComponent.css";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authLevel = Cookies.get("auth_level");
    if (authLevel !== "admin") {
      setIsAdmin(false);
    }
  }, []);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const handleUserManagementClick = () => {
    navigate("/userManagement");
  };

  const handleContentManagementClick = () => {
    navigate("/postManagement");
  };

  return (
    <div className="admin-page-container page-container">
      <div className="admin-card-container">
        <Card className="admin-card status-card mainFromLogo animated-border"
        onClick={handleUserManagementClick}
        >
          <Card.Header>
            <Card.Text className="text-black">User Management</Card.Text>
          </Card.Header>
          <Card.Body
            style={{
              width: "100%",
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            {/* here we add */}
          </Card.Body>
        </Card>
      </div>

      <div className="admin-card-container">
        <Card className="admin-card status-card mainFromLogo animated-border"
        onClick={handleContentManagementClick}
        >
          <Card.Header>
            <Card.Text className="text-black">Content Management</Card.Text>
          </Card.Header>
          <Card.Body
            style={{
              width: "100%",
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            {/* here we add */}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
