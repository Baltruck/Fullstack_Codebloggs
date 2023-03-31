import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Modal,
  Button,
  Dropdown,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useTheme } from "./themeContext";
import "./mainComponent.css";
import Post from "./post";
import Cookies from "js-cookie";
import NewPost from "./newPost";
import "bootstrap/dist/css/bootstrap.css";
import "./navbarStyles.css";

export default function CustomNavbar() {
  const userId = Cookies.get("userId");
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
    Cookies.remove("auth_level");
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
        <Navbar
          expand="lg"
          className={`navbar navbar-custom navbar-fixed-top ${
            darkMode ? "navbar-custom-dark" : "navbar-custom-light"
          } animated-border-navbar`}
        >
          <div className="logo-container">
            <NavLink
              className="navbar-brand"
              to={
                location.pathname.startsWith("/home") ? "#" : `/home/${userId}`
              }
            >
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
          <Navbar.Collapse id="responsive-navbar-nav" className="always-show">
            <Nav className="mx-auto">
              <Nav.Item className="ml-auto">
                {!shouldDisablePostButton && (
                  <Button
                    className="custom-submit-btn custom-post-btn post-button"
                    onClick={handleShowPost}
                  >
                    Post
                  </Button>
                )}
              </Nav.Item>
              <div className="user-info-container">
                <Nav.Item>
                  <span className="nav-link user-name">{userName}</span>
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
                        <Dropdown.Item onClick={toggleTheme}>
                          Change mode: {darkMode ? "dark" : "light"}
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
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <NewPost
        show={showPost}
        handleClose={handleClosePost}
        handleSubmit={handlePostSubmit}
      />
      <Modal
        show={showLogoutConfirm}
        onHide={handleCloseLogoutConfirm}
        contentClassName="status-card main-card mainFromLogo animated-border confirm-logout-modal"
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
