import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, MessageSquare, Star, Menu, X, Users, Settings, Link as LinkIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import styles from '../styles/admin.module.css';
import logo from '../../assets/logo.png';

export default function MobileBottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  const mainItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/properties', icon: Building2, label: 'Properties' },
    { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  ];

  const drawerItems = [
    { to: '/admin/clients', icon: Users, label: 'Clients' },
    { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
    { to: '/admin/contact-social', icon: LinkIcon, label: 'Contact & Social' },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className={styles.bottomNav}>
        {mainItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.active : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Menu Button */}
        <button className={styles.bottomNavItem} onClick={() => setDrawerOpen(true)}>
          <Menu size={22} />
          <span>Menu</span>
        </button>
      </nav>

      {/* Full-screen drawer from bottom */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className={styles.mobileDrawerOverlay}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className={styles.mobileDrawer}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <img src={logo} alt="Property Express" style={{ height: 28, objectFit: 'contain' }} />
                <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                  <X size={22} />
                </button>
              </div>

              {/* Nav Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {drawerItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    style={{ borderRadius: 12, padding: '0.875rem 1rem' }}
                  >
                    <Icon size={20} />
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Logout */}
              <div style={{ borderTop: `1px solid var(--admin-stroke)`, marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)',
                    fontSize: '1rem', fontWeight: 600, fontFamily: 'Outfit', padding: '0.875rem 1rem', borderRadius: 12,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ed1b24'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-text-muted)'}
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
