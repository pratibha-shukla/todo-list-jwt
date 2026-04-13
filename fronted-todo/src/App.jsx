import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/home';
import ListDetail from './pages/ListDetail';
import Login from './pages/login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import LandingPage from './components/Landing';

// FIX 1: Fixed the typo 'GlobalVeiw' to 'GlobalView' 
// Ensure the actual file in your folder is named GlobalView.jsx
import GlobalView from "./pages/GlobalVeiw.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <>
        <Toaster position="top-right" reverseOrder={false} />

        <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />

        <main style={{ padding: '20px', minHeight: '80vh' }}>
          <Routes>
            {/* Landing logic */}
            <Route path="/" element={user ? <Home user={user} /> : <LandingPage />} />

            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dynamic route for lists */}
            <Route path="/list/:id" element={<ListDetail />} />

            {/* Global system view */}
            <Route path="/global" element={<GlobalView />} />
          </Routes>
        </main>

        <Footer />
      </>
    </Router>
  );
}


