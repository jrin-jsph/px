import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Users, MessageSquare, Star, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import styles from '../styles/admin.module.css';

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markAllAsRead, logout } = useAdmin();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type) => {
    if (type === 'New Inquiry') return <MessageSquare size={16} />;
    if (type === 'New Review') return <Star size={16} />;
    if (type === 'New Client') return <Users size={16} />;
    return <Building2 size={16} />;
  };

  const handleNotifClick = (n) => {
    setShowNotifications(false);
    navigate(n.link);
  };

  return (
    <header className={styles.topNav}>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      
      <div className={styles.navActions}>
        <button className={styles.iconBtn} onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute', top: -5, right: -5,
                    background: '#ed1b24', color: 'white',
                    width: 18, height: 18, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700
                  }}
                >
                  {unreadCount}
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 1rem)', right: 0,
                  width: 360, maxHeight: 420, overflowY: 'auto',
                  background: 'var(--admin-glass-bg)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid var(--admin-glass-border)',
                  borderRadius: 16,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  zIndex: 100, display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-stroke)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Notifications</h3>
                  {unreadCount > 0 && <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--admin-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>Mark all as read</button>}
                </div>
                
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>No notifications</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {notifications.map((n, i) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotifClick(n)}
                        style={{ 
                          padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'flex-start',
                          borderBottom: i < notifications.length - 1 ? '1px solid var(--admin-stroke)' : 'none',
                          background: n.read ? 'transparent' : 'rgba(255,255,255,0.4)',
                          borderLeft: n.read ? '2px solid transparent' : '2px solid #ed1b24',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ padding: '0.5rem', background: 'var(--admin-stroke)', borderRadius: '50%', color: 'var(--admin-text-main)' }}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 400, color: 'var(--admin-text-body)' }}>{n.message}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={logout} style={{ background: 'none', border: 'none' }}>
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
            alt="Admin" 
            className={styles.avatar} 
          />
        </button>

      </div>
    </header>
  );
}
