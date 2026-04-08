import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../styles/admin.module.css';

const dummyInquiries = [
  { id: 1, name: 'Alice Smith', phone: '+1 555-0100', property: 'Skyline Penthouse', category: 'Flats', date: '2026-04-09', status: 'New', message: 'Hi, I am very interested in this property. Can we schedule a viewing for Saturday afternoon?' },
  { id: 2, name: 'Michael Chen', phone: '+1 555-0199', property: 'Oceanfront Plot', category: 'Plots', date: '2026-04-08', status: 'Responded', message: 'What are the zoning regulations for this plot? I am planning to build a 3-story residential complex.' },
  { id: 3, name: 'Sarah Jones', phone: '+1 555-0144', property: 'Downtown Loft', category: 'Flats', date: '2026-04-07', status: 'Closed', message: 'Thanks for the tour. Unfortunately, it is a bit out of my budget.' },
];

export default function Inquiries() {
  const [inquiries, setInquiries] = useState(dummyInquiries);
  const [expandedRow, setExpandedRow] = useState(null);

  const updateStatus = (id, newStatus) => {
    setInquiries(inqs => inqs.map(inq => 
      inq.id === id ? { ...inq, status: newStatus } : inq
    ));
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'New': return { background: 'rgba(24,24,26,0.1)', color: '#18181a' };
      case 'Responded': return { background: 'rgba(46,204,113,0.1)', color: '#2ecc71' };
      case 'Closed': return { background: 'rgba(85,85,85,0.1)', color: '#555555' };
      default: return {};
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Bar Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: 300 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input type="text" placeholder="Search inquiries..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
          <button className="btn btn-outline" style={{ gap: '0.5rem', padding: '0 1.5rem' }}>
            <Filter size={18} /> Category: All
          </button>
          <button className="btn btn-outline" style={{ gap: '0.5rem', padding: '0 1.5rem' }}>
            <Filter size={18} /> Status: All
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <motion.div className={styles.glassCard} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.1}}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-stroke)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Phone</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Property</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, i) => (
                <React.Fragment key={inq.id}>
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                    onClick={() => setExpandedRow(expandedRow === inq.id ? null : inq.id)}
                    style={{ 
                      borderBottom: expandedRow === inq.id ? 'none' : '1px solid var(--admin-stroke)', 
                      background: expandedRow === inq.id ? 'rgba(0,0,0,0.04)' : (i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'),
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{inq.name}</td>
                    <td style={{ padding: '1rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{inq.phone}</td>
                    <td style={{ padding: '1rem', fontWeight: 400 }}>{inq.property}</td>
                    <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)' }}>{inq.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)', fontVariantNumeric: 'tabular-nums' }}>{inq.date}</td>
                    <td style={{ padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={inq.status} 
                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.85rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em',
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none',
                          ...getStatusStyle(inq.status)
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Responded">Responded</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button className={styles.iconBtn}>
                        {expandedRow === inq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </td>
                  </motion.tr>
                  {/* Expandable row */}
                  <AnimatePresence>
                    {expandedRow === inq.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ background: 'rgba(0,0,0,0.04)' }}
                      >
                        <td colSpan="7" style={{ padding: 0, borderBottom: '1px solid var(--admin-stroke)' }}>
                          <div style={{ padding: '0 2rem 2rem 2rem' }}>
                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>Message</h4>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--admin-text-body)', background: 'rgba(255,255,255,0.4)', padding: '1.25rem', borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
                              "{inq.message}"
                            </p>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                              <button className="btn" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', background: '#25D366', color: 'white', border: 'none', fontWeight: 600 }}>Reply on WhatsApp</button>
                              <button className="btn" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', background: '#18181a', color: 'white', border: 'none', fontWeight: 600 }}>Reply via Email</button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
