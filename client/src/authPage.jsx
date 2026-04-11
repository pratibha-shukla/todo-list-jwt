import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import styles from './Auth.module.css'; // Make sure this file exists

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
    <div className={styles.container}>
      <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onUpdateField}
          required
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onUpdateField}
          required
        />
        <button className={styles.button} disabled={isBusy}>
          {isBusy ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <button className={styles.toggleBtn} onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default AuthPage;

