
// components/LandingPage.jsx
import styles from './Landing.module.css';
import { useNavigate } from 'react-router-dom';





export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.hero}>
      <h1 className={styles.heroTitle}>Stay Organized, Stick to It.</h1>
      <p className={styles.heroSubtitle}>
        Join millions of people to capture ideas, organize life, and do something creative.
      </p>
      <div className={styles.ctaGroup}>
        <button onClick={() => navigate('/signup')} className={styles.primaryBtn}>Get Started</button>
        <button className={styles.secondaryBtn}>Download</button>
      </div>

   
    </div>
  );
}
