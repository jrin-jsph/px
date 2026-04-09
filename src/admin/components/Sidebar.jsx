import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, Star, Settings, Link, ChevronLeft, ChevronRight } from 'lucide-react';
import { FlatIcon, VillaIcon, PlotIcon, WarehouseIcon } from './icons/PropertyIcons';
import { useAdmin } from '../context/AdminContext';
import styles from '../styles/admin.module.css';
import logo from '../../assets/logo.png';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { sections } = useAdmin();

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink 
      to={to} 
      end={to === '/admin'}
      className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
      style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: collapsed ? '0.65rem 0' : '0.65rem 1.5rem', justifyContent: collapsed ? 'center' : 'flex-start' }}
      title={collapsed ? label : ''}
    >
      <Icon size={18} style={{ minWidth: 18 }} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span initial={{opacity:0, width:0}} animate={{opacity:1, width:'auto'}} exit={{opacity:0, width:0}} style={{ marginLeft: '0.75rem' }}>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarBrand} style={{ position: 'relative', overflow: 'hidden', padding: collapsed ? '0 0.5rem 1rem' : '0 1.5rem 2rem', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.img 
              key="full-logo"
              src={logo} 
              alt="Property Express" 
              initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, display: 'none'}}
              style={{ height: 32, objectFit: 'contain', maxWidth: '100%' }} 
            />
          ) : (
            <motion.div 
              key="icon-logo"
              initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, display: 'none'}}
              style={{ width: 32, height: 32, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
            >
              <img src={logo} alt="PX" style={{ height: 32, objectFit: 'cover', objectPosition: 'left' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div className={styles.navGroup}>
          {!collapsed && <div className={styles.navLabel}>Main</div>}
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
        </div>

        <div className={styles.navGroup}>
          {!collapsed && <div className={styles.navLabel}>Properties</div>}
          <NavItem to="/admin/properties" icon={WarehouseIcon} label="All Properties" />
          <AnimatePresence>
            {sections.showFlats && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <NavItem to="/admin/properties/flats" icon={FlatIcon} label="Flats" />
              </motion.div>
            )}
            {sections.showPlots && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <NavItem to="/admin/properties/plots" icon={PlotIcon} label="Plots" />
              </motion.div>
            )}
            {sections.showWarehouses && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                 <NavItem to="/admin/properties/warehouses" icon={WarehouseIcon} label="Warehouses" />
              </motion.div>
            )}
            {sections.showVillas && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                 <NavItem to="/admin/properties/villas" icon={VillaIcon} label="Villas" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.navGroup}>
          {!collapsed && <div className={styles.navLabel}>Management</div>}
          <NavItem to="/admin/clients" icon={Users} label="Clients" />
          <NavItem to="/admin/inquiries" icon={MessageSquare} label="Inquiries" />
          <AnimatePresence>
            {sections.showReviews && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <NavItem to="/admin/reviews" icon={Star} label="Reviews" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.navGroup}>
          {!collapsed && <div className={styles.navLabel}>Settings</div>}
          <AnimatePresence>
            {sections.showContactForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                 <NavItem to="/admin/contact-social" icon={Link} label="Contact & Social" />
              </motion.div>
            )}
          </AnimatePresence>
          <NavItem to="/admin/settings" icon={Settings} label="Site Settings" />
        </div>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--admin-stroke)', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <button onClick={() => setCollapsed(!collapsed)} className={styles.iconBtn} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '0.5rem' }}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
