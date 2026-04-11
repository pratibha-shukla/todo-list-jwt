import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Import here

export const Header = ({ user, onLogout }) => (
  <header className={styles.header}>
    <div>
      <h1 style={{ margin: 0 }}>Workspace</h1>
      <small>{user ? user.username : 'Guest'}</small>
    </div>
    <nav className={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/recipes">Recipes</Link>
      {user ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </>
      )}
    </nav>
  </header>
);
