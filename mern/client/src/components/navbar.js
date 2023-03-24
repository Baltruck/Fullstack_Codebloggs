import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Modal, Button, Dropdown, Nav } from "react-bootstrap";
import { useTheme } from "./themeContext";
import "./navbarStyles.css";
import "./mainComponent.css";
import Post from "./post";
import Cookies from "js-cookie";
import NewPost from "./newPost";
import "bootstrap/dist/css/bootstrap.css";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const themeClass = darkMode ? "dark" : "light";
  const userName = Cookies.get("userName");
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const location = useLocation();
  const shouldDisablePostButton =
    location.pathname === "/login" || location.pathname === "/register";

  // Here, we handle the post modal
  const handlePostSubmit = async () => {
    const userEmail = Cookies.get("userEmail");

    try {
      const response = await fetch("/new-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          content: postContent,
        }),
      });

      if (response.ok) {
        console.log("Post submitted successfully");
        setPostContent("");
        handleClosePost();
      } else {
        console.log("Error submitting post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleShowLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleAccountSettingClick = () => {
    alert("GG you clicked it!");
  };

  const handleCloseLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    Cookies.remove("userName");
    Cookies.remove("userToken");
    navigate("/login");
    handleCloseLogoutConfirm();
  };

  const [showPost, setShowPost] = useState(false);

  const handleShowPost = () => {
    setShowPost(true);
  };

  const handleClosePost = () => {
    setShowPost(false);
  };

  return (
    <div>
      <div className="nav-items-container">
        <nav
          className={`navbar navbar-expand-lg navbar-custom navbar-fixed-top ${
            darkMode ? "navbar-custom-dark" : "navbar-custom-light"
          } animated-border-navbar`}
        >
          <div className="logo-container">
            <NavLink className="navbar-brand" to="/">
              <img
                style={{ width: 10 + "%" }}
                src={process.env.PUBLIC_URL + "/CodeBloggs graphic.png"}
              ></img>
            </NavLink>
            <img
              className={`text-image ${themeClass}`}
              src={process.env.PUBLIC_URL + "/CodeBloggsV2.png"}
              alt="Text Image"
            />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Nav className="mr-auto">
  <Nav.Item>
    {!shouldDisablePostButton && (
      <Button
        className="custom-submit-btn custom-post-btn post-button"
        onClick={handleShowPost}
      >
        Post
      </Button>
    )}
  </Nav.Item>
</Nav>
<Nav className="mr-auto">
  <Nav.Item>
    <Button className="custom-submit-btn theme-toggle-button" onClick={toggleTheme}>
      Change mode : {darkMode ? "dark" : "light"}
    </Button>
  </Nav.Item>
</Nav>
<div className="user-info-container">
  <Nav.Item>
    <span className="nav-link">{userName}</span>
  </Nav.Item>
  <Nav.Item>
    {userName ? (
      <Dropdown>
        <Dropdown.Toggle as={Nav.Link}></Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShowLogoutConfirm}>
            Disconnect
          </Dropdown.Item>
          <Dropdown.Item onClick={handleAccountSettingClick}>
            Account Setting
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <NavLink className="nav-link" to="/login">
        Please Login
      </NavLink>
    )}
  </Nav.Item>
</div>
            <NewPost
              show={showPost}
              handleClose={handleClosePost}
              handleSubmit={handlePostSubmit}
            />
          </div>
        </nav>
      </div>
      <Modal
        show={showLogoutConfirm}
        onHide={handleCloseLogoutConfirm}
        contentClassName="status-card main-card mainFromLogo animated-border"
        centered
      >
        <Modal.Header style={{ border: "0", padding: "1rem 1rem" }}>
          <Modal.Title className="modal-text-title">Confirm Logout</Modal.Title>
        </Modal.Header>
        <div className="inside-post-container">
          <Modal.Body
            className="text-black"
            style={{ border: "0", padding: "1rem 1rem" }}
          >
            Are you sure you want to disconnect?
          </Modal.Body>
        </div>
        <Modal.Footer style={{ border: "0", padding: "1rem 1rem" }}>
          <Button
            variant="secondary"
            onClick={handleCloseLogoutConfirm}
            className="custom-close-btn"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="custom-submit-btn"
          >
            Disconnect
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
