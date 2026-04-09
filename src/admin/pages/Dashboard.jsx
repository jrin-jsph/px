import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowRight } from 'lucide-react';
import styles from '../styles/admin.module.css';

const StatCard = ({ title, value, icon, to }) => {
  const [count, setCount] = useState(0);
  const [startCount, setStartCount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!startCount) return;
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, startCount]);

  return (
    <motion.div 
      onClick={() => navigate(to)}
      onAnimationComplete={() => setStartCount(true)}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      className={styles.glassCard}
      style={{ borderTop: '4px solid #3f41a5', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
      whileHover="hover"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </h3>
        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
        {count.toLocaleString()}
      </div>
      <motion.div 
        variants={{ hover: { x: 0, opacity: 1 }, initial: { x: -20, opacity: 0 } }}
        initial="initial"
        style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', color: '#ed1b24' }}
      >
        <ArrowRight size={20} />
      </motion.div>
    </motion.div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  // Using explicit fixed heights on charts + loading states
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800); // Simulate network
  }, []);

  const pieData = [
    { name: 'Flats', value: 45 },
    { name: 'Plots', value: 30 },
    { name: 'Villas', value: 15 },
    { name: 'Warehouses', value: 10 },
  ];
  const COLORS = ['#18181a', '#555555', '#888888', '#bbbbbb'];

  const barData = [
    { name: 'Oct', inquiries: 42 },
    { name: 'Nov', inquiries: 55 },
    { name: 'Dec', inquiries: 38 },
    { name: 'Jan', inquiries: 65 },
    { name: 'Feb', inquiries: 80 },
    { name: 'Mar', inquiries: 110, fill: '#ed1b24' },
  ];

  const recentInquiries = [
    { id: 1, name: 'Alice Smith', property: 'Skyline Penthouse', phone: '+1 555-0100', date: '2026-04-09', status: 'New' },
    { id: 2, name: 'Michael Chen', property: 'Azure Villa', phone: '+1 555-0199', date: '2026-04-08', status: 'Responded' },
    { id: 3, name: 'Sarah Jones', property: 'Downtown Loft', phone: '+1 555-0144', date: '2026-04-07', status: 'Closed' },
  ];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'New': return { background: 'rgba(24,24,26,0.1)', color: '#18181a' };
      case 'Responded': return { background: 'rgba(46,204,113,0.1)', color: '#2ecc71' };
      case 'Closed': return { background: 'rgba(85,85,85,0.1)', color: '#555555' };
      default: return {};
    }
  };

  const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const tableContainer = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const tableRow = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Cards Row */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Properties" value={142} icon="🏘️" to="/admin/properties" />
        <StatCard title="Total Inquiries" value={840} icon="📩" to="/admin/inquiries" />
        <StatCard title="Page Views" value={45200} icon="👁️" to="/admin/settings" />
        <StatCard title="Pending Approvals" value={12} icon="⭐" to="/admin/reviews?filter=pending" />
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          <div className={styles.glassCard} style={{ height: 400, background: 'rgba(0,0,0,0.06)', animation: 'shimmer 2s infinite' }} />
          <div className={styles.glassCard} style={{ height: 400, background: 'rgba(0,0,0,0.06)', animation: 'shimmer 2s infinite' }} />
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <motion.div className={styles.glassCard} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Properties by Category</h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className={styles.glassCard} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Inquiries (Last 6 Months)</h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-stroke)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--admin-text-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--admin-text-muted)'}} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px' }}/>
                    <Bar dataKey="inquiries" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || '#18181a'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Table Row */}
          <motion.div className={styles.glassCard} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.2}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Recent Inquiries</h3>
              <Link to="/admin/inquiries" style={{ fontWeight: 300, color: 'var(--admin-text-main)', textDecoration: 'underline' }}>View All</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <motion.table variants={tableContainer} initial="hidden" animate="show" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-stroke)' }}>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Name</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Property</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Phone</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Date</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inq, i) => (
                    <motion.tr 
                      key={inq.id}
                      variants={tableRow}
                      onClick={() => navigate(`/admin/inquiries?expanded=${inq.id}`)}
                      style={{ borderBottom: '1px solid var(--admin-stroke)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{inq.name}</td>
                      <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)' }}>{inq.property}</td>
                      <td style={{ padding: '1rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{inq.phone}</td>
                      <td style={{ padding: '1rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums', color: 'var(--admin-text-muted)' }}>{inq.date}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.35rem 0.85rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.08em',
                          ...getStatusStyle(inq.status) 
                        }}>
                          {inq.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            </div>
          </motion.div>
        </>
      )}

    </div>
  );
}
