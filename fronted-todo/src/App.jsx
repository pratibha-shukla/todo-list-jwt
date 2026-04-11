import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './main.module.css';
import AuthPage from './authPage';

export default function App() {
  return (
    <Router> {/* <--- THIS IS THE MISSING PIECE */}
      <div className={styles.appShell}>
        <div className={styles.mainLayout}>
          
          {/* Left Side (Hero) */}
          <aside className={styles.heroPanel}>
            <h1>Workspace</h1>
          </aside>

          {/* Right Side (Workspace) */}
          <main className={styles.workspacePanel}>
            <Routes>
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="signup" />} />
              {/* Add your other routes here */}
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}

