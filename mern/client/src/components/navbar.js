import React from "react";
import { useTheme } from './themeContext';

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme(); 
  const themeClass = darkMode ? 'dark' : 'light';
  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-custom-dark' : 'navbar-custom-light'} animated-border-navbar`}>
        <NavLink className="navbar-brand" to="/">
        <img style={{"width" : 10 + '%'}} src={process.env.PUBLIC_URL + "/CodeBloggs graphic.png"}></img>
        </NavLink>
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
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              {/* <NavLink className="nav-link" to="/create">
                Create Record
              </NavLink> */}
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={toggleTheme}>
                Change mode : {darkMode ? 'dark' : 'light'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
