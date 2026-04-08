import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User } from 'lucide-react';
import styles from '../styles/admin.module.css';

const dummyClients = [
  { id: 1, name: 'Alice Smith', phone: '+1 555-0100', email: 'alice@example.com', date: '2026-03-15', inquiries: 3 },
  { id: 2, name: 'Michael Chen', phone: '+1 555-0199', email: 'm.chen@domain.co', date: '2026-04-01', inquiries: 1 },
  { id: 3, name: 'Sarah Jones', phone: '+1 555-0144', email: 'sarah.j@web.com', date: '2026-04-05', inquiries: 5 },
];

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
          <input type="text" placeholder="Search clients by name or email..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
        </div>
      </div>

      {/* Main Table */}
      <motion.div className={styles.glassCard} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.1}}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-stroke)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem', width: 50 }}></th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Email</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Phone</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Date Registered</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Total Inquiries</th>
              </tr>
            </thead>
            <tbody>
              {dummyClients.map((client, i) => (
                <motion.tr 
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                  style={{ 
                    borderBottom: '1px solid var(--admin-stroke)', 
                    background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                    cursor: 'pointer'
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--admin-stroke)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="var(--admin-text-muted)" />
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{client.name}</td>
                  <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-main)' }}>{client.email}</td>
                  <td style={{ padding: '1rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{client.phone}</td>
                  <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)' }}>{client.date}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{client.inquiries}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Client Detail Drawer */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setSelectedClient(null)}
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
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>{selectedClient.name}</h2>
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{selectedClient.email} • {selectedClient.phone}</p>
                </div>
                <button onClick={() => setSelectedClient(null)} className={styles.iconBtn} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '0.5rem' }}><X size={20} /></button>
              </div>

              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>Inquiry History</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid var(--admin-stroke)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontWeight: 600 }}>Skyline Penthouse</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Apr 09, 2026</span>
                    </div>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(24,24,26,0.1)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>New</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-body)', lineHeight: 1.5 }}>"Hi, I am interested in viewing this property this weekend. Is it still available?"</p>
                  </div>
                  
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid var(--admin-stroke)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontWeight: 600 }}>Downtown Loft</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Mar 10, 2026</span>
                    </div>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(85,85,85,0.1)', color: 'var(--admin-text-muted)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>Closed</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-body)', lineHeight: 1.5 }}>"Thanks for the tour. I decided to pass on this one."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
