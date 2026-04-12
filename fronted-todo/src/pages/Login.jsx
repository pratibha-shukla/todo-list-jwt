import { useState } from 'react';
import { apiFetch } from '../service/api'; 
import { useNavigate, Link } from 'react-router-dom';
// ONLY USE ONE IMPORT. Change the path to where your file actually is:
import styles from './Login.module.css'; 

export default function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });
      localStorage.setItem('token', data.accessToken);
      setUser(data.user);
      navigate('/');
    } catch (err) { 
      alert("Login failed"); 
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h2>Login</h2>
        <input 
          type="text"
          placeholder="Username" 
          value={form.username}
          onChange={e => setForm({...form, username: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
          required 
        />
        <button type="submit">Sign In</button>
        <p>New? <Link to="/signup">Create account</Link></p>
      </form>
    </div>
  );
}



