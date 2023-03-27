import React, { useEffect } from "react";
import { useTheme } from "./components/themeContext";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";

import Navbar from "./components/navbar";
import Sidebar from "./components/sideBar";
import Login from "./components/login";
import Register from "./components/register";
import Main from "./components/MainComponent";
import Blogg from "./components/blogg";
import Network from "./components/network";
import AdminPage from "./components/admin";
import NewPost from "./components/newPost";
import UsersList from "./components/userManager";
import PostList from "./components/postList";
import "./App.css";

const App = () => {
  const { darkMode } = useTheme();
  const themeClass = darkMode ? "dark" : "light";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(themeClass);
  }, [themeClass]);

  // ACTIVATE AFTER LOGIN
  useEffect(() => {
    const token = Cookies.get("userToken");
    if (
      !token &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    } else if (
      token &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/");
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="main-content" style={{ margin: 20 }}>
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogg" element={<Blogg />} />
          <Route path="/network" element={<Network />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/userManagement" element={<UsersList />} />
          <Route path="/postManagement" element={<PostList />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
