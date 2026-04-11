import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from './api'; // Fixed path: now looks in the same folder
import styles from './authPage.module.css'; // Matches your filename exactly

const AuthPage = ({ mode, setMode, setUser }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const navigate = useNavigate();

  const onUpdateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsBusy(true);
    setError('');

    // Matches your backend route: '/auth/signup'
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';

    try {
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(form),
      });

      // Backend returns { token: "...", user: {...} }
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
      
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
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onUpdateField}
          required
        />
        <input
          className={styles.inputField}
          name="password"
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
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default AuthPage;


