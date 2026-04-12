
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <p>© 2026 Workspace App</p>
    <div className={styles.links}>
      <a href="#!">Privacy Policy</a>
      <a href="#!">Terms of Service</a>
      <a href="#!">Support</a>
    </div>
  </footer>
);

export default Footer;
