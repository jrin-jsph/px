import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Search, MessageSquare } from 'lucide-react';
import styles from '../styles/admin.module.css';

const dummyReviews = [
  { id: 1, name: 'Jonathan Doe', rating: 5, date: '2026-04-05', text: 'Absolutely incredible experience finding our new home. The agent was extremely professional and the property exceeded our expectations.', status: 'Pending' },
  { id: 2, name: 'Emily Clark', rating: 4, date: '2026-04-01', text: 'Great selection of luxury properties. Very smooth transaction process.', status: 'Approved' },
  { id: 3, name: 'Michael Robinson', rating: 5, date: '2026-03-28', text: 'Property Express understood exactly what we wanted and found it within a week.', status: 'Pending' },
  { id: 4, name: 'Spam Bot', rating: 1, date: '2026-03-20', text: 'Buy cheap crypto now click link.', status: 'Rejected' },
];

export default function Reviews() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');

  const [reviews, setReviews] = useState(dummyReviews);
  const [activeTab, setActiveTab] = useState(filterParam ? filterParam.charAt(0).toUpperCase() + filterParam.slice(1) : 'Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const updateStatus = (id, newStatus) => {
    setReviews(revs => revs.map(rev => rev.id === id ? { ...rev, status: newStatus } : rev));
  };

  const filteredReviews = reviews.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(term) || r.text.toLowerCase().includes(term);
    const matchTab = r.status === activeTab;
    
    let matchRating = true;
    if (ratingFilter === '5') matchRating = r.rating === 5;
    if (ratingFilter === '4') matchRating = r.rating === 4;
    if (ratingFilter === '3') matchRating = r.rating <= 3;

    return matchSearch && matchTab && matchRating;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Filters Bar */}
      <div className={styles.glassCard} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.4)', padding: '0.25rem', borderRadius: 40, border: '1px solid var(--admin-stroke)' }}>
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setLoading(true); }}
              style={{
                padding: '0.6rem 1.5rem', borderRadius: 30, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s ease',
                background: activeTab === tab ? '#18181a' : 'transparent', color: activeTab === tab ? '#fff' : 'var(--admin-text-muted)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" placeholder="Search reviews..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem', fontSize: '0.85rem' }} 
            />
            {searchTerm && <X size={14} onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--admin-text-muted)' }} />}
          </div>

          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
            <option value="All">All Stars</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐ and below</option>
          </select>
        </div>
      </div>

      {/* Review Cards Grid */}
      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence mode="popLayout">
          {loading ? (
             [...Array(3)].map((_, idx) => (
                <motion.div key={`skel-${idx}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ height: 200, borderRadius: 20, background: 'rgba(0,0,0,0.06)', animation: 'shimmer 2s infinite' }} />
             ))
          ) : filteredReviews.length === 0 ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontWeight: 300 }}>
              <MessageSquare size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
              <p>No {activeTab.toLowerCase()} reviews found matching your criteria.</p>
            </motion.div>
          ) : (
            filteredReviews.map((review, i) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
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
                    <button onClick={() => updateStatus(review.id, 'Approved')} className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--admin-text-main)', color: 'var(--admin-text-main)' }}>
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
            ))
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
