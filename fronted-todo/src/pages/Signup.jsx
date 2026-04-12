import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../service/api'; 
import styles from './Signup.module.css'; // Import the CSS

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      alert("Registration successful! Please login.");
      navigate('/login'); 
    } catch (err) {
      alert("Signup Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Join Workspace</h2>
        <form className={styles.form} onSubmit={handleSignup}>
          <input 
            className={styles.inputField}
            name="username"
            value={form.username}
            placeholder="Choose Username" 
            onChange={handleChange} 
            required 
          />
          <input 
            className={styles.inputField}
            name="password"
            value={form.password}
            type="password" 
            placeholder="Create Password" 
            onChange={handleChange} 
            required 
          />
          <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
