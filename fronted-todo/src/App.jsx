import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar'; 
import Home from './pages/home';
import ListDetail from './pages/ListDetail'; // <--- 1. IMPORT THIS
import Login from './pages/login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import LandingPage from './components/Landing'; // <--- 2. IMPORT THIS

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
      
      <main style={{ padding: '20px', minHeight: '80vh' }}>
        
       
           <Routes>
          {/* 2. LOGIC: If no user, show LandingPage. If user, show Home */}
          <Route path="/" element={user ? <Home user={user} /> : <LandingPage />} />
          {/* <Route path="/" element={<Home user={user} />} /> */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} /> 
          
          {/* 2. ADD THIS DYNAMIC ROUTE */}
          <Route path="/list/:id" element={<ListDetail />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

