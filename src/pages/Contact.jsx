import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { submitLead } from '../services/leadService';
import { revealVariants, revealViewport } from '../hooks/useScrollReveal';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitLead(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.pageWrap}
    >
      <section className={styles.pageHeader}>
        <div className={`container ${styles.headerContent}`}>
          <h1>Contact Us</h1>
          <p className="subtitle">We're here to help you find your dream home.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.5fr)', gap: '4rem' }}>
            
            <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}>
              <h2>Get in Touch</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '3rem' }}>
                Whether you're looking to buy, rent, or just have a question about the market, our team is ready to assist you.
              </p>

              <div className={styles.contactInfoList}>
                <div className={styles.contactItem}>
                  <div className={styles.iconWrap}><MapPin size={24} /></div>
                  <div>
                    <h4>Office Location</h4>
                    <p style={{ color: 'var(--color-text-light)' }}>123 Business Avenue, Suite 100<br/>New York, NY 10001</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconWrap}><Phone size={24} /></div>
                  <div>
                    <h4>Phone Number</h4>
                    <p style={{ color: 'var(--color-text-light)' }}>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconWrap}><Mail size={24} /></div>
                  <div>
                    <h4>Email Address</h4>
                    <p style={{ color: 'var(--color-text-light)' }}>hello@propertyexpress.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.formContainer}
              variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport} transition={{ delay: 0.2 }}
            >
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="john@example.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea rows="5" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>Message sent successfully!</p>}
              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </motion.div>
  );
}
