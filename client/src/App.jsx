

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from "./header";
import Home from './home';
import Login from './login';

import Footer from './footer';


export default function App() {
  const [user, setUser] = useState(null); // Track logged in user

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Optional: clear storage
  };

  return (
    <Router>
      <Header user={user} status={user ? "Online" : "Guest"} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass setUser to Login so it can update the app state */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Login setUser={setUser} isRegister={true} />} />
      </Routes>

      <Footer />
    </Router>
  );
}
