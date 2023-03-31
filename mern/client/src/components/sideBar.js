import React, { useEffect, useState } from "react";
import { useTheme } from "./themeContext";
import "./sideBar.css";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user }) => {
  const { darkMode } = useTheme();
  const themeClass = darkMode ? "sidebar-dark" : "sidebar-light";
  const animationClass = darkMode
    ? "animated-border-sideBar"
    : "animated-border-navbar";

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
      const authLevel = Cookies.get("auth_level");
      if (authLevel) {
        setIsLoggedIn(true);
        if (authLevel === "admin") {
          setIsAdmin(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    }, []);

    const loggedInClass = isLoggedIn ? "" : "logged-out";

      return (
        <div className={`sidebar ${themeClass} ${animationClass} ${loggedInClass}`}>
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <NavLink to="/" activeclassname="active-link">
                Home
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/blogg" activeclassname="active-link">
                Blogg
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/network" activeclassname="active-link">
                Network
              </NavLink>
            </li>
            {isAdmin && (
              <li className="sidebar-item">
                <NavLink to="/admin" activeclassname="active-link">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      );
    };

export default Sidebar;

