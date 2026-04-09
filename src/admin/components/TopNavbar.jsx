import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Users, MessageSquare, Star, Building2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import styles from '../styles/admin.module.css';
import logo from '../../assets/logo.png';

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markAllAsRead, deleteNotification, clearAllNotifications, isDark, toggleTheme } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const notifRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (aboutRef.current && !aboutRef.current.contains(event.target)) setShowAbout(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    return 'Admin Panel';
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

  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 1rem)',
    right: 0,
    zIndex: 100,
    background: isDark ? 'rgba(14, 18, 32, 0.97)' : 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.90)',
    borderRadius: 20,
    boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.40)' : '0 20px 60px rgba(0,0,0,0.15)',
  };

  const infoRows = [
    ['Version', 'v1.0.0'],
    ['Build', '2026'],
    ['Framework', 'React + Vite'],
    ['UI', 'Glassmorphism'],
    ['Font', 'Outfit'],
  ];

  return (
    <header className={styles.topNav}>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>

      <div className={styles.navActions}>
        {/* Theme Toggle */}
        <button className={styles.iconBtn} onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => { setShowNotifications(v => !v); setShowAbout(false); }}>
            <Bell size={20} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    background: '#ed1b24', color: 'white',
                    width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 700, pointerEvents: 'none'
                  }}
                >
                  {unreadCount}
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notification Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ ...panelStyle, width: 360, maxHeight: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
              >
                {/* Header */}
                <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>Notifications</h3>
                    {notifications.length > 0 && (
                      <span style={{ background: '#ed1b24', color: 'white', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearAllNotifications} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: '#ed1b24', cursor: 'pointer', fontWeight: 600 }}>
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification Items */}
                {notifications.length === 0 ? (
                  <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <Bell size={36} style={{ color: 'var(--admin-text-muted)', opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 300 }}>You're all caught up</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence initial={false}>
                      {notifications.map((n, i) => (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleNotifClick(n)}
                          style={{
                            padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', gap: '0.875rem', alignItems: 'flex-start', position: 'relative',
                            borderBottom: i < notifications.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none',
                            background: n.read ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'),
                            borderLeft: n.read ? '2px solid transparent' : '2px solid #ed1b24',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div style={{ padding: '0.5rem', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: '50%', color: 'var(--admin-text-muted)', flexShrink: 0 }}>
                            {getNotifIcon(n.type)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 400, color: 'var(--admin-text-body)', lineHeight: 1.4 }}>{n.message}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{n.time}</span>
                          </div>
                          {/* Delete × */}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                            style={{
                              width: 20, height: 20, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
                              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                              color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'background 0.2s, color 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(237,27,36,0.1)'; e.currentTarget.style.color = '#ed1b24'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = 'var(--admin-text-muted)'; }}
                          >
                            <X size={11} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo Avatar + About Panel */}
        <div style={{ position: 'relative' }} ref={aboutRef}>
          <button
            onClick={() => { setShowAbout(v => !v); setShowNotifications(false); }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={logo} alt="Property Express" className={styles.avatar} />
          </button>

          <AnimatePresence>
            {showAbout && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ ...panelStyle, width: 300 }}
              >
                <div style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <img src={logo} alt="Property Express" style={{ height: 64, objectFit: 'contain' }} />
                  <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>Property Express</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 300 }}>Admin Dashboard</p>
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {infoRows.map(([label, value], i) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < infoRows.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : 'none' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 300 }}>{label}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-main)', fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
