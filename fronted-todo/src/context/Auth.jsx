import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure this points to your centralized service
import apiFetch from '../service/api'; 
import styles from './authPage.module.css';

const AuthPage = ({ mode, setMode, setUser }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const navigate = useNavigate();

  const onUpdateField = (e) => {
    // This looks for the "name" attribute on the input tags
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsBusy(true);
    setError('');

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';

    try {
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h1>
      
      <div className={styles.authTabs}>
        <button 
          type="button"
          className={`${styles.tabButton} ${mode === 'login' ? styles.activeTab : ''}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button 
          type="button"
          className={`${styles.tabButton} ${mode === 'signup' ? styles.activeTab : ''}`}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.inputField}
          name="username" // MUST match state key
          placeholder="Username"
          value={form.username}
          onChange={onUpdateField}
          required
        />
        <input
          className={styles.inputField}
          name="password" // MUST match state key
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onUpdateField}
          required
        />
        <button className={styles.primaryBtn} disabled={isBusy}>
          {isBusy ? 'Processing...' : mode === 'login' ? 'Login' : 'Join Now'}
        </button>
      </form>
      
      {error && <p className={styles.error} style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default AuthPage;


