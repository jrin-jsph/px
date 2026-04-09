import React, { useState, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Newest Registered');
  const [inquiryFilter, setInquiryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredClients = dummyClients.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(term) || c.phone.includes(term) || c.email.toLowerCase().includes(term);
    
    let matchInq = true;
    if (inquiryFilter === '1 Inquiry') matchInq = c.inquiries === 1;
    if (inquiryFilter === '2–5 Inquiries') matchInq = c.inquiries >= 2 && c.inquiries <= 5;
    if (inquiryFilter === '5+ Inquiries') matchInq = c.inquiries > 5;

    return matchSearch && matchInq;
  }).sort((a, b) => {
    if (sortOrder === 'Most Inquiries') return b.inquiries - a.inquiries;
    if (sortOrder === 'Alphabetical A–Z') return a.name.localeCompare(b.name);
    if (sortOrder === 'Z–A') return b.name.localeCompare(a.name);
    return 0; // Newest Registered fallback
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Filters */}
      <div className={styles.glassCard} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
          <input 
            type="text" placeholder="Search clients by name, phone or email..." 
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }} 
          />
          {searchTerm && <X size={16} onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--admin-text-muted)' }} />}
        </div>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600 }}>
          <option value="Newest Registered">Sort: Newest Registered</option>
          <option value="Most Inquiries">Sort: Most Inquiries</option>
          <option value="Alphabetical A–Z">Sort: Alphabetical A–Z</option>
          <option value="Z–A">Sort: Z–A</option>
        </select>

        <select value={inquiryFilter} onChange={e => setInquiryFilter(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600 }}>
          <option value="All">Inquiries: All</option>
          <option value="1 Inquiry">1 Inquiry</option>
          <option value="2–5 Inquiries">2–5 Inquiries</option>
          <option value="5+ Inquiries">5+ Inquiries</option>
        </select>
      </div>

      {/* Main Table */}
      <div className={styles.glassCard}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[...Array(3)].map((_, idx) => <div key={idx} style={{ height: 60, borderRadius: 12, background: 'rgba(0,0,0,0.06)', animation: 'shimmer 2s infinite' }} />)}
          </div>
        ) : filteredClients.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontWeight: 300 }}>
            <Users size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
            <p>No clients match your filter criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <motion.table variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="show" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                {filteredClients.map((client, i) => (
                  <motion.tr 
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
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
            </motion.table>
          </div>
        )}
      </div>

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
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 480, height: '100%', background: 'var(--admin-glass-bg)',
                backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                borderLeft: '1px solid var(--admin-glass-border)', padding: '2.5rem',
                display: 'flex', flexDirection: 'column', overflowY: 'auto'
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
                
                <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <motion.div variants={{ hidden: {opacity:0, y:10}, show: {opacity:1, y:0} }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid var(--admin-stroke)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontWeight: 600 }}>Skyline Penthouse</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Apr 09, 2026</span>
                    </div>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(24,24,26,0.1)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>New</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-body)', lineHeight: 1.5 }}>"Hi, I am interested in viewing this property this weekend. Is it still available?"</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
