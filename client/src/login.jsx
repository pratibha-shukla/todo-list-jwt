
import { useState } from 'react';
import { apiFetch } from './api'; // Check your folder path!
import { useNavigate } from 'react-router-dom';

 function Login({ setUser, isRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    try {
      const data = await apiFetch(endpoint, { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });
      setUser(data.user); // Save user data to App state
      navigate('/');
    } catch (err) { 
      alert(err.message); 
    }
  };

  return (
    <div className="auth-card">
      <h2>{isRegister ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Username" 
          onChange={e => setForm({...form, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        <button type="submit">{isRegister ? 'Sign Up' : 'Enter'}</button>
      </form>
    </div>
  );
}
export default Login;

