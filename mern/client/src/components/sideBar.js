import React, { useEffect, useState } from "react";
import { useTheme } from "./themeContext";
import "./sideBar.css";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Sidebar = ({ user }) => {
  const { darkMode } = useTheme();
  const userId = Cookies.get("userId");
  const themeClass = darkMode ? "sidebar-dark" : "sidebar-light";
  const animationClass = darkMode
    ? "animated-border-sideBar"
    : "animated-border-navbar";

  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const authLevel = Cookies.get("auth_level");
    if (authLevel === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className={`sidebar ${themeClass} ${animationClass}`}>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <NavLink
            to={location.pathname.startsWith("/home") ? "#" : `/home/${userId}`}
            disabled={location.pathname.startsWith("/home")}
            activeClassName="active-link"
          >
            Home
          </NavLink>{" "}
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
