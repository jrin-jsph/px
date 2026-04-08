import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Building, Store, Map, Award, Handshake, Headphones, Star } from 'lucide-react';
import { getFeaturedProperties } from '../services/propertyService';
import PropertyCard from '../components/ui/PropertyCard';
import GtaMarker from '../components/ui/GtaMarker';
import { revealVariants, revealViewport } from '../hooks/useScrollReveal';
import styles from './Home.module.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedProperties().then(setFeatured);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find Your Perfect Property
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover premium real estate, curated exclusively by our expert team. Experience seamless living in the home of your dreams.
          </motion.p>
          <motion.div 
            className={styles.heroCtas}
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/properties" className="btn btn-primary">Explore Properties</Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Contact Us</Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <motion.div 
            className="section-header flex-between" 
            style={{ textAlign: 'left', marginBottom: '3rem' }}
            variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
          >
            <div>
              <h2>Featured Properties</h2>
              <p className="subtitle">Hand-picked premium listings available right now.</p>
            </div>
            <Link to="/properties" className="btn btn-outline">View All Listings</Link>
          </motion.div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {featured.map((prop, index) => (
              <motion.div 
                key={prop.id}
                variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header" style={{ textAlign: 'center' }}
            variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
          >
            <h2>Explore By Property Type</h2>
            <p className="subtitle" style={{ margin: '0 auto' }}>Select from our wide range of property categories to find your match.</p>
          </motion.div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '3rem' }}>
            {[
              { icon: HomeIcon, title: 'Villas', listed: 12 },
              { icon: Building, title: 'Apartments', listed: 45 },
              { icon: Store, title: 'Commercial', listed: 8 },
              { icon: Map, title: 'Land', listed: 5 }
            ].map((cat, i) => (
              <motion.div 
                key={i} 
                variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
                transition={{ delay: i * 0.1 }}
              >
                <Link to="/properties" className={styles.categoryCard}>
                  <cat.icon size={48} className={styles.categoryIcon} />
                  <h3>{cat.title}</h3>
                  <p className="subtitle" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{cat.listed} Listed</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <motion.div 
            className="section-header" style={{ textAlign: 'center' }}
            variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
          >
            <h2>Why Choose Property Express?</h2>
            <p className="subtitle" style={{ margin: '0 auto' }}>We stand out through our commitment to transparency, quality, and support.</p>
          </motion.div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginTop: '3rem' }}>
            {[
              { icon: Award, title: 'Verified Properties', desc: 'Every listing on our platform undergoes strict verification for your peace of mind.' },
              { icon: Handshake, title: 'Trusted Listings', desc: "We don't allow external agents. All properties are exclusively managed by our dedicated team." },
              { icon: Headphones, title: 'Expert Support', desc: 'Our real estate experts guide you through every step of the buying or renting process.' }
            ].map((feat, i) => (
              <motion.div 
                key={i} className={styles.featureItemMain}
                variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.iconBox}><feat.icon size={32} /></div>
                <h3>{feat.title}</h3>
                <p style={{ color: 'var(--color-text-light)', marginTop: '1rem' }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header" style={{ textAlign: 'center' }}
            variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
          >
            <h2>What Our Clients Say</h2>
            <p className="subtitle" style={{ margin: '0 auto' }}>Read stories from clients who found their perfect match with us.</p>
          </motion.div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '3rem' }}>
            <motion.div 
              className={styles.testimonialCard}
              variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
            >
              <div className={styles.stars}>
                {[1,2,3,4,5].map(v => <Star key={v} size={16} fill="currentColor" />)}
              </div>
              <p style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>"Property Express made finding my dream apartment in the city incredibly simple. Their team was professional, and the property exceeded my expectations."</p>
              <div className={styles.testimonialHeader}>
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Sarah J." className={styles.testimonialImg} />
                <div>
                  <h4 style={{ margin: 0 }}>Sarah Jenkins</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Apartment Buyer</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.testimonialCard}
              variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.stars}>
                {[1,2,3,4,5].map(v => <Star key={v} size={16} fill="currentColor" />)}
              </div>
              <p style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>"The level of transparency and support is unmatched. I purchased a family villa through them, and the entire process was seamless from start to finish."</p>
              <div className={styles.testimonialHeader}>
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Michael R." className={styles.testimonialImg} />
                <div>
                  <h4 style={{ margin: 0 }}>Michael Roberts</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Villa Owner</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GTA Map Section */}
      <section className={`cta-section ${styles.interactiveMapSection}`}>
        <div className={styles.mapBackdrop}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221803.05038730015!2d-97.91256637382843!3d30.267153020736885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b502373d67eb%3A0x5d370c1519f58e5c!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1712500000000!5m2!1sen!2sus"
            width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
        </div>
        <div className={styles.mapTintOverlay}></div>

        <div className={styles.mapMarkers}>
          <div className={styles.currentLocationMarker}>
            <div className={`${styles.locRipple} ${styles.locRipple1}`}></div>
            <div className={`${styles.locRipple} ${styles.locRipple2}`}></div>
            <div className={`${styles.locRipple} ${styles.locRipple3}`}></div>
            <div className={styles.locCore}>
              <div className={styles.locDotInner}></div>
            </div>
          </div>
          
          {/* Re-using first featured property for map pins */}
          {featured.length > 0 && (
            <>
              <GtaMarker property={featured[0]} style={{ top: '5%', left: '3%' }} delay={0.15} />
              <GtaMarker property={featured[1]} style={{ top: '32%', left: '18%' }} delay={0.25} />
              <GtaMarker property={featured[2]} style={{ top: '60%', left: '5%' }} delay={0.55} />
              <GtaMarker property={featured[0]} style={{ top: '85%', left: '22%' }} delay={0.65} />
              <GtaMarker property={featured[1]} style={{ top: '6%', left: '75%' }} delay={0.75} />
              <GtaMarker property={featured[2]} style={{ top: '25%', left: '55%' }} delay={0.35} />
              <GtaMarker property={featured[0]} style={{ top: '44%', left: '82%' }} delay={0.45} />
              <GtaMarker property={featured[1]} style={{ top: '75%', left: '52%' }} delay={0.6} />
              <GtaMarker property={featured[2]} style={{ top: '80%', left: '80%' }} delay={0.7} />
            </>
          )}
        </div>

        <div className={`container ${styles.mapCtaContent}`}>
          <h2 className={styles.mapCtaTitle}>Explore Nearby Homes</h2>
          <p className={styles.mapCtaSubtitle}>Browse available homes near you and explore<br/>listings in your favorite areas.</p>
          <div className={styles.mapCtaBtnWrap}>
            <div className={styles.ctaRadar1}></div>
            <div className={styles.ctaRadar2}></div>
            <Link to="/properties" className={styles.btnMapCta}>Get started</Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
