

import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'; // Using your existing CSS module

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the JWT
    setUser(null);                    // Clear user state
    navigate('/login');               // Redirect to login
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">✅ TodoApp</Link>
      </div>

      <div className={styles.links}>
        <Link to="/">Home</Link>


        {user ? (
          <>

          <Link to="/global" className={styles.navLink}>Global View</Link>
          
            <span className={styles.username}>Hi, {user.username}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
           <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
           
          </>
        )}
      </div>
    </nav>
  );
}
