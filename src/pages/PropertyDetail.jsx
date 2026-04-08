import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Scaling, Calendar, ShieldCheck, User } from 'lucide-react';
import { getPropertyById } from '../services/propertyService';
import { MOCK_AGENTS } from '../data/mockProperties';
import { revealVariants, revealViewport } from '../hooks/useScrollReveal';
import styles from './PropertyDetail.module.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    getPropertyById(id).then(data => {
      setProperty(data);
      if (data) {
        setAgent(MOCK_AGENTS.find(a => a.id === data.agentId));
      }
    });
  }, [id]);

  if (!property) return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Loading or not found...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.pageWrap}
    >
      <div className={styles.galleryHero}>
        <div className={styles.galleryGrid}>
          {property.images.map((img, idx) => (
            <div key={idx} className={`${styles.galleryItem} ${idx === 0 ? styles.galleryMain : ''}`}>
              <img src={img} alt={`${property.title} view ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className={`container ${styles.detailContainer}`}>
        {/* Main Content */}
        <div className={styles.detailMain}>
          <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}>
            <span className={styles.badge}>{property.status}</span>
            <div className={styles.headerRow}>
              <h1>{property.title}</h1>
              <div className={styles.price}>
                ${property.price.toLocaleString()} {property.status === 'For Rent' && <span>/mo</span>}
              </div>
            </div>
            <div className={styles.location}>
              <MapPin size={18} /> {property.location}
            </div>
          </motion.div>

          <motion.div className={styles.featuresStrip} variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}>
            <div className={styles.featureItem}><BedDouble size={20} /> <span>{property.beds} Bedrooms</span></div>
            <div className={styles.featureItem}><Bath size={20} /> <span>{property.baths} Bathrooms</span></div>
            <div className={styles.featureItem}><Scaling size={20} /> <span>{property.sqft.toLocaleString()} sqft</span></div>
            <div className={styles.featureItem}><Calendar size={20} /> <span>Built 2020</span></div>
          </motion.div>

          <motion.div className={styles.descriptionSection} variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}>
            <h3>Property Description</h3>
            <p>{property.description}</p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div className={styles.detailSidebar} variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className={styles.sidebarSticky}>
            <div className={styles.agentCard}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Listed By</h3>
              {agent && (
                <div className={styles.agentInfo}>
                  <img src={agent.photo} alt={agent.name} className={styles.agentPhoto} />
                  <div>
                    <h4 style={{ margin: 0 }}>{agent.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{agent.role}</p>
                  </div>
                </div>
              )}
              <div className={styles.agentContacts}>
                {agent && <a href={`tel:${agent.phone.replace(/\D/g, '')}`} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Call Agent</a>}
                <Link to="/contact" className="btn btn-outline" style={{ width: '100%' }}>Send Message</Link>
              </div>
            </div>
            
            <div className={styles.buyerProtection}>
              <ShieldCheck size={32} color="var(--color-accent-blue)" />
              <div>
                <h4>Buyer Protection</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>100% verified properties.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
