import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, MessageSquare, Star, Settings, Link } from 'lucide-react';
import styles from '../styles/admin.module.css';

export default function Sidebar() {
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink 
      to={to} 
      end={to === '/admin'}
      className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <div style={{width: 24, height: 24, background: '#18181a', color: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14}}>P</div>
        Property Express
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        <div className={styles.navGroup}>
          <div className={styles.navLabel}>Main</div>
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
        </div>

        <div className={styles.navGroup}>
          <div className={styles.navLabel}>Properties</div>
          <NavItem to="/admin/properties" icon={Building2} label="All Properties" />
          <NavItem to="/admin/properties/flats" icon={Building2} label="Flats" />
          <NavItem to="/admin/properties/plots" icon={Building2} label="Plots" />
          <NavItem to="/admin/properties/warehouses" icon={Building2} label="Warehouses" />
          <NavItem to="/admin/properties/villas" icon={Building2} label="Villas" />
        </div>

        <div className={styles.navGroup}>
          <div className={styles.navLabel}>Management</div>
          <NavItem to="/admin/clients" icon={Users} label="Clients" />
          <NavItem to="/admin/inquiries" icon={MessageSquare} label="Inquiries" />
          <NavItem to="/admin/reviews" icon={Star} label="Reviews" />
        </div>

        <div className={styles.navGroup}>
          <div className={styles.navLabel}>Settings</div>
          <NavItem to="/admin/contact-social" icon={Link} label="Contact & Social" />
          <NavItem to="/admin/settings" icon={Settings} label="Site Settings" />
        </div>
      </nav>
    </aside>
  );
}
