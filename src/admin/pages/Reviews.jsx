import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X } from 'lucide-react';
import styles from '../styles/admin.module.css';

const dummyReviews = [
  { id: 1, name: 'Jonathan Doe', rating: 5, date: '2026-04-05', text: 'Absolutely incredible experience finding our new home. The agent was extremely professional and the property exceeded our expectations.', status: 'Pending' },
  { id: 2, name: 'Emily Clark', rating: 4, date: '2026-04-01', text: 'Great selection of luxury properties. Very smooth transaction process.', status: 'Approved' },
  { id: 3, name: 'Michael Robinson', rating: 5, date: '2026-03-28', text: 'Property Express understood exactly what we wanted and found it within a week.', status: 'Pending' },
  { id: 4, name: 'Spam Bot', rating: 1, date: '2026-03-20', text: 'Buy cheap crypto now click link.', status: 'Rejected' },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(dummyReviews);
  const [activeTab, setActiveTab] = useState('Pending');

  const updateStatus = (id, newStatus) => {
    setReviews(revs => revs.map(rev => rev.id === id ? { ...rev, status: newStatus } : rev));
  };

  const filteredReviews = reviews.filter(r => r.status === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', background: 'var(--admin-glass-bg)', padding: '0.5rem', borderRadius: 40, width: 'fit-content', border: '1px solid var(--admin-glass-border)' }}>
        {['Pending', 'Approved', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 30,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: activeTab === tab ? '#18181a' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--admin-text-muted)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Review Cards Grid */}
      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredReviews.length === 0 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ padding: '3rem', color: 'var(--admin-text-muted)' }}>
              No {activeTab.toLowerCase()} reviews found.
            </motion.div>
          )}
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={styles.glassCard}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{review.name}</h3>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill={idx < review.rating ? '#18181a' : 'transparent'} color={idx < review.rating ? '#18181a' : 'var(--admin-stroke)'} />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{review.date}</span>
              </div>
              
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--admin-text-body)', fontWeight: 300, flex: 1 }}>
                "{review.text}"
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--admin-stroke)', paddingTop: '1.5rem' }}>
                {activeTab !== 'Approved' && (
                  <button onClick={() => updateStatus(review.id, 'Approved')} className="btn" style={{ flex: 1, background: 'transparent', borderColor: '#18181a', color: '#18181a' }}>
                    <Check size={16} style={{ marginRight: '0.5rem' }} /> Approve
                  </button>
                )}
                {activeTab !== 'Rejected' && (
                  <button onClick={() => updateStatus(review.id, 'Rejected')} className="btn" style={{ flex: 1, background: 'transparent', borderColor: '#ed1b24', color: '#ed1b24' }}>
                    <X size={16} style={{ marginRight: '0.5rem' }} /> Reject
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
