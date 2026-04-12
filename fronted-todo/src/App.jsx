import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar'; 
import Home from './pages/home'; // Ensure this matches your lowercase 'home.jsx' filename
import Login from './pages/login';
import Signup from './pages/Signup';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      {/* FIX: Changed <Header /> to <Navbar /> to match your import above */}
      <Navbar user={user} setUser={setUser} />
      
      <main style={{ padding: '20px', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          {/* FIX: Changed path to /signup to match standard naming, or keep /register if you prefer */}
          <Route path="/signup" element={<Signup />} /> 
        </Routes>
      </main>
    </Router>
  );
}

