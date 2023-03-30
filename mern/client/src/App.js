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

import CustomNavbar from "./components/navbar";
import Sidebar from "./components/sideBar";
import Login from "./components/login";
import Register from "./components/register";
import Main from "./components/MainComponent";
import Blogg from "./components/blogg";
import Network from "./components/network";
import AdminPage from "./components/admin";
import NewPost from "./components/newPost";
import UsersList from "./components/userManager";

import ContentManager from "./components/contentManager";
import "./App.css";
import { da, el } from "date-fns/locale";

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
    const userId = Cookies.get("userId");
    const userAuthLevel = Cookies.get("auth_level");
    // console.log("userId");
    // console.log(userId);
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
      navigate(`/home/${userId}`);
    } else if (
      userAuthLevel == "admin" &&
      token &&
      location.pathname.startsWith("/home") &&
      location.pathname.split("/")[2] !== userId
    ) {
      const pathSegments = location.pathname.split("/");
      const userIdQuery = pathSegments[2].toString();
      fetch(`http://localhost:5000/findUserId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userIdQuery }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("MY FETCH DATA");
          // console.log(data);
          if (!data.UserInfo || data.message == "Invalid userId") {
            //no userinfo object found
            window.alert("User not found");
            navigate(`/home/${userId}`);
            window.location.reload();
          } else {
            // console.log("YOU HIT THE ELSE STATEMENT") //set the cookies

            navigate(`/home/${data.UserInfo._id}`);
            // window.location.reload();
          }
        });
    } else if (
      userAuthLevel == "user" &&
      token &&
      location.pathname.startsWith("/home") &&
      location.pathname.split("/")[2] !== userId
    ) {
      window.alert("Not autorise");
      navigate(`/home/${userId}`);
      window.location.reload();
      
    }
  }, [location]);

  return (
    <div>
      <CustomNavbar />
      <Sidebar />
      <div className="main-content" style={{ margin: 20 }}>
        <Routes>
          <Route exact path="/home/:id" element={<Main />} />
          <Route exact path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogg" element={<Blogg />} />
          <Route path="/network" element={<Network />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/userManagement" element={<UsersList />} />
          <Route path="/contentManagement" element={<ContentManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
