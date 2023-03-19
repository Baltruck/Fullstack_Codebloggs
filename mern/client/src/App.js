import React, { useEffect } from "react";
import { useTheme } from './components/themeContext';

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

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
 
  useEffect(() => {
    document.body.classList.remove('dark', 'light'); // Retirez les classes précédentes
    document.body.classList.add(themeClass); // Ajoutez la nouvelle classe de thème
  }, [themeClass]);

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
