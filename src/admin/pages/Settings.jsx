import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/admin.module.css';

export default function Settings() {
  const ToggleRow = ({ label, defaultChecked }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--admin-stroke)' }}>
      <span style={{ fontWeight: 500 }}>{label}</span>
      <label style={{ position: 'relative', display: 'inline-block', width: 50, height: 28 }}>
        <input type="checkbox" defaultChecked={defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{ 
          position: 'absolute', cursor: 'pointer', inset: 0, 
          background: defaultChecked ? '#18181a' : 'rgba(0,0,0,0.1)', 
          borderRadius: 34, transition: '0.4s' 
        }}>
          <span style={{ 
            position: 'absolute', height: 20, width: 20, left: 4, bottom: 4, 
            background: 'white', borderRadius: '50%', transition: '0.4s',
            transform: defaultChecked ? 'translateX(22px)' : 'translateX(0)'
          }}></span>
        </span>
      </label>
    </div>
  );

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.1}} style={{ maxWidth: 800 }}>
      <div className={styles.glassCard} style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>General Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Site Name</label>
            <input type="text" defaultValue="Property Express" style={{ width: '100%', maxWidth: 400 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tagline</label>
            <input type="text" defaultValue="Premium Real Estate Properties" style={{ width: '100%', maxWidth: 400 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>SEO Meta Description</label>
            <textarea rows={3} defaultValue="Discover the most premium luxury villas, apartments, and plots available." style={{ width: '100%', maxWidth: 600, resize: 'none' }}></textarea>
          </div>
        </div>
      </div>

      <div className={styles.glassCard} style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Section Visibility</h3>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Toggle which property categories and sections appear on the public website.</p>
        
        <div>
          <ToggleRow label="Show Flats Category" defaultChecked={true} />
          <ToggleRow label="Show Plots Category" defaultChecked={true} />
          <ToggleRow label="Show Warehouses Category" defaultChecked={true} />
          <ToggleRow label="Show Villas Category" defaultChecked={true} />
          <ToggleRow label="Show Customer Reviews" defaultChecked={true} />
          <ToggleRow label="Show Contact Form" defaultChecked={true} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button className="btn" style={{ background: '#ed1b24', color: 'white', border: 'none', fontWeight: 700, padding: '1rem 3rem' }}>Save Settings</button>
      </div>

    </motion.div>
  );
}
