import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Moon, Sun } from 'lucide-react';
import styles from '../styles/admin.module.css';

export default function TopNavbar() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/properties')) {
      if (path.includes('flats')) return 'Flats';
      if (path.includes('plots')) return 'Plots';
      if (path.includes('warehouses')) return 'Warehouses';
      if (path.includes('villas')) return 'Villas';
      return 'All Properties';
    }
    if (path.includes('/clients')) return 'Clients';
    if (path.includes('/inquiries')) return 'Inquiries';
    if (path.includes('/reviews')) return 'Reviews';
    if (path.includes('/settings')) return 'Site Settings';
    if (path.includes('/contact-social')) return 'Contact & Social';
    return 'Admin Control';
  };

  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  };

  return (
    <header className={styles.topNav}>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      
      <div className={styles.navActions}>
        <button className={styles.iconBtn} onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>
        <img 
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
          alt="Admin" 
          className={styles.avatar} 
        />
      </div>
    </header>
  );
}
