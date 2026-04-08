import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Building, Store, Map, Award, Handshake, Headphones, Star } from 'lucide-react';
import { getFeaturedProperties } from '../services/propertyService';
import PropertyCard from '../components/ui/PropertyCard';
import GtaMarker from '../components/ui/GtaMarker';
import { revealVariants, revealViewport } from '../hooks/useScrollReveal';
import styles from './Home.module.css';

const CountUp = ({ end, decimals = 0, suffix = "" }) => {
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    let animationFrameId;
    const duration = 2000;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = easeProgress * end;
            if (ref.current) {
              ref.current.textContent = currentVal.toFixed(decimals) + suffix;
            }
            if (progress < 1) {
              animationFrameId = window.requestAnimationFrame(step);
            } else {
              if (ref.current) ref.current.textContent = end.toFixed(decimals) + suffix;
            }
          };
          animationFrameId = window.requestAnimationFrame(step);
        } else {
          window.cancelAnimationFrame(animationFrameId);
          if (ref.current) {
            ref.current.textContent = (0).toFixed(decimals) + suffix;
          }
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [end, decimals, suffix]);

  return <span ref={ref}>{(0).toFixed(decimals)}{suffix}</span>;
};

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedProperties().then(setFeatured);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Apartment Buyer",
      text: "Property Express made finding my dream apartment incredibly simple. Their team was professional, and the property exceeded my expectations.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Michael Roberts",
      role: "Villa Owner",
      text: "The level of transparency and support is unmatched. I purchased a family villa through them, and the process was seamless.",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Commercial Investor",
      text: "Found the perfect retail space for my startup. The agents understood my needs perfectly and negotiated a fantastic lease.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 4,
      name: "David Alaba",
      role: "First-time Buyer",
      text: "As a first-time buyer I was terrified, but their consultants guided me through every detail with absolute patience and clarity.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 5,
      name: "Jessica Taylor",
      role: "Property Seller",
      text: "They sold my apartment in record time for above asking price! The marketing team is brilliant, and the transaction was hassle-free.",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
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
            <Link to="/properties" className={`btn ${styles.btnPrimary}`}>Explore Properties</Link>
            <Link to="/contact" className={`btn ${styles.btnSecondary}`}>Contact Us</Link>
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

      {/* Stats Section */}
      <section className="section">
        <div className="container" style={{ padding: '2rem 0' }}>
          <motion.div 
            className={styles.bentoGrid}
            variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
          >
            <div className={styles.bentoCol}>
              <motion.div 
                className={`${styles.statCard} ${styles.bgPurple}`}
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className={styles.statNumber}>
                  <CountUp end={1.2} decimals={1} suffix="K+" />
                </h2>
                <div className={styles.statFooter}>
                  <p>Properties Sold</p>
                </div>
              </motion.div>
              <motion.div 
                className={`${styles.statCard} ${styles.bgBlack}`}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              >
                <h2 className={styles.statNumber}>
                  <CountUp end={4.9} decimals={1} suffix="/5" />
                </h2>
                <div className={styles.statFooter}>
                  <p>Client Satisfaction</p>
                </div>
              </motion.div>
            </div>
            
            <div className={`${styles.bentoCol} ${styles.bentoOffset1}`}>
              <motion.div 
                className={`${styles.statCard} ${styles.bgTeal}`}
                initial={{ y: -100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <h2 className={styles.statNumber}>
                  <CountUp end={100} decimals={0} suffix="%" />
                </h2>
                <div className={styles.statFooter}>
                  <p>Verified Listings</p>
                </div>
              </motion.div>
            </div>

            <div className={`${styles.bentoCol} ${styles.bentoOffset2}`}>
              <motion.div 
                className={`${styles.statCard} ${styles.bgGreen}`}
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                <h2 className={styles.statNumber}>
                  <CountUp end={50} decimals={0} suffix="+" />
                </h2>
                <div className={styles.statFooter}>
                  <p>Expert Consultants</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
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

          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeTrack}>
              {duplicatedTestimonials.map((t, idx) => (
                <div key={idx} className={styles.testimonialCard}>
                  <div className={styles.stars}>
                    {[1,2,3,4,5].map(v => <Star key={v} size={16} fill="currentColor" />)}
                  </div>
                  <p style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div className={styles.testimonialHeader}>
                    <img src={t.img} alt={t.name} className={styles.testimonialImg} />
                    <div>
                      <h4 style={{ margin: 0 }}>{t.name}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
