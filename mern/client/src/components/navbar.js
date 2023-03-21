import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTheme } from './themeContext';
import "./navbarStyles.css";
import Post from "./post";
import Cookies from 'js-cookie';




// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme(); 
  const themeClass = darkMode ? 'dark' : 'light';
  const userName = Cookies.get('userName');

  const [showPost, setShowPost] = useState(false);

  const handleShowPost = () => {
    setShowPost(true);
  };

  const handleClosePost = () => {
    setShowPost(false);
  };

  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg ${
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
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <button className="custom-submit-btn custom-post-btn" onClick={handleShowPost}>
                Post
              </button>
            </li>
            </ul>
            <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={toggleTheme}>
                Change mode : {darkMode ? "dark" : "light"}
              </button>
            </li>
            <li className="nav-item">
              <span className="nav-link">{userName}</span>
          </li>
          </ul>
        </div>
      </nav>
      <Modal show={showPost} onHide={handleClosePost} centered>
        <Modal.Header closeButton>
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Post />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePost}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
}
