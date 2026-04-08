import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Search, Filter } from 'lucide-react';
import styles from '../styles/admin.module.css';

const dummyProperties = [
  { id: 1, title: 'Skyline Penthouse', location: 'New York, NY', price: 4200, area: 2100, status: 'Active', category: 'Flats', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&q=80' },
  { id: 2, title: 'Luxury Villa Set', location: 'Beverly Hills, CA', price: 1250000, area: 3500, status: 'Active', category: 'Villas', img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=100&q=80' },
  { id: 3, title: 'Oceanfront Plot', location: 'Miami, FL', price: 450000, area: 12000, status: 'Inactive', category: 'Plots', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&q=80' },
  { id: 4, title: 'Downtown Industrial', location: 'Chicago, IL', price: 850000, area: 8500, status: 'Active', category: 'Warehouses', img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c8ec1b?w=100&q=80' },
];

export default function AdminProperties() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [properties, setProperties] = useState(dummyProperties);
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setProperties(props => props.map(p => {
      if (p.id === id) return { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' };
      return p;
    }));
  };

  const deleteProp = (id) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setProperties(props => props.filter(p => p.id !== id));
    }
  };

  const openDrawer = (id = null) => {
    setEditingId(id);
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Bar Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: 300 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input type="text" placeholder="Search properties..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
          <button className="btn btn-outline" style={{ gap: '0.5rem', padding: '0 1.5rem' }}>
            <Filter size={18} /> Filters
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => openDrawer()} style={{ gap: '0.5rem', background: 'transparent', borderColor: '#ed1b24', color: '#ed1b24', fontWeight: 600 }}>
          <Plus size={18} /> Add Property
        </button>
      </div>

      {/* Main Table Card */}
      <motion.div className={styles.glassCard} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.2}}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-stroke)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Image</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Title</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Location</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Price</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p, i) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  style={{ borderBottom: '1px solid var(--admin-stroke)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}
                >
                  <td style={{ padding: '1rem' }}>
                    <img src={p.img} alt={p.title} style={{ width: 60, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--admin-glass-border)' }} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{p.title}</td>
                  <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)' }}>{p.location}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${p.price.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => toggleStatus(p.id)}
                      style={{
                        padding: '0.35rem 0.85rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.08em',
                        border: '1px solid var(--admin-glass-border)',
                        cursor: 'pointer',
                        background: p.status === 'Active' ? 'rgba(24,24,26,0.1)' : 'rgba(85,85,85,0.1)',
                        color: p.status === 'Active' ? 'var(--admin-text-main)' : 'var(--admin-text-muted)'
                      }}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => openDrawer(p.id)} className={styles.iconBtn}><Edit2 size={16} /></button>
                      <button onClick={() => deleteProp(p.id)} className={styles.iconBtn} style={{ color: '#ed1b24' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add / Edit Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 480,
                height: '100%',
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                borderLeft: '1px solid var(--admin-glass-border)',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>{editingId ? 'Edit Property' : 'Add Property'}</h2>
                <button onClick={() => setDrawerOpen(false)} className={styles.iconBtn} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '0.5rem' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Title</label>
                  <input type="text" placeholder="e.g. Modern Villa" style={{ width: '100%' }} defaultValue={editingId ? 'Skyline Penthouse' : ''} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Price ($)</label>
                    <input type="number" placeholder="4200" style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Area (sqft)</label>
                    <input type="number" placeholder="2100" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Location</label>
                  <input type="text" placeholder="e.g. New York, NY" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Description</label>
                  <textarea rows={4} placeholder="Enter property details..." style={{ width: '100%', resize: 'none' }}></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Status</label>
                  <select style={{ width: '100%' }}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn" onClick={() => setDrawerOpen(false)} style={{ flex: 1, background: '#ed1b24', color: 'white', border: 'none', fontWeight: 700 }}>{editingId ? 'Save Changes' : 'Publish Property'}</button>
                  <button className="btn" onClick={() => setDrawerOpen(false)} style={{ flex: 1 }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
