import React, { useEffect } from "react";
import { useTheme } from './components/themeContext';
import { Route, Routes, useLocation, Navigate, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Login from "./components/login";
import Register from "./components/register";

const App = () => {
  const { darkMode } = useTheme();
  const themeClass = darkMode ? 'dark' : 'light';
  const location = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    document.body.classList.remove('dark', 'light'); 
    document.body.classList.add(themeClass); 
  }, [themeClass]);

  // ACTIVATE AFTER LOGIN
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    } else if (token && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/');
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;
