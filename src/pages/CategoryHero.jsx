import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FILTER_TAXONOMY } from '../data/filterTaxonomy';
import styles from './CategoryHero.module.css';

import { CATEGORY_IMAGES } from '../data/categoryImages';

// Floating positions for 4 images: top-left, top-right, center-left, bottom-right
const FLOAT_POSITIONS = [
  { top: '8%', left: '-2%', rotate: -8, zIndex: 2 },
  { top: '5%', right: '4%', rotate: 5, zIndex: 3 },
  { top: '42%', left: '5%', rotate: -4, zIndex: 2 },
  { top: '38%', right: '-1%', rotate: 6, zIndex: 2 },
];

function FloatingImage({ src, position, scrollProgress, index, onClick }) {
  // Each image flies from its floating position toward the center-bottom as scroll increases
  const exitX = useTransform(scrollProgress, [0, 1], [0, (index % 2 === 0 ? -150 : 150)]);
  const exitY = useTransform(scrollProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollProgress, [0, 0.55, 0.85], [1, 0.6, 0]);
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.65]);
  const rotate = useTransform(scrollProgress, [0, 1], [position.rotate, 0]);

  const springX = useSpring(exitX, { stiffness: 60, damping: 20 });
  const springY = useSpring(exitY, { stiffness: 60, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 80, damping: 25 });
  const springScale = useSpring(scale, { stiffness: 80, damping: 25 });

  const style = { ...position };
  delete style.rotate; // handle via motion

  return (
    <motion.div
      className={styles.floatingImg}
      style={{
        position: 'absolute',
        x: springX,
        y: springY,
        opacity: springOpacity,
        scale: springScale,
        rotate,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
    >
      <img src={src} alt="" className={styles.floatingImgEl} />
    </motion.div>
  );
}

function PropertyListingCard({ property, index }) {
  return (
    <motion.div
      className={styles.listingCard}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className={styles.listingImgWrap}>
        <span
          className={styles.listingBadge}
          style={{
            background: property.status === 'For Rent' ? '#1a1a1a' : 'rgba(255,255,255,0.55)',
            color: property.status === 'For Rent' ? '#fff' : '#222',
          }}
        >
          {property.status}
        </span>
        <img src={property.images[0]} alt={property.title} className={styles.listingImg} />
      </div>
      <div className={styles.listingContent}>
        <div className={styles.listingPrice}>
          ${property.price.toLocaleString()}
          {property.status === 'For Rent' && <span className={styles.perMonth}> /mo</span>}
        </div>
        <h3 className={styles.listingTitle}>{property.title}</h3>
        <p className={styles.listingLocation}>📍 {property.location}</p>
        <div className={styles.listingFeatures}>
          {property.beds > 0 && <span>🛏 {property.beds} Beds</span>}
          {property.baths > 0 && <span>🚿 {property.baths} Baths</span>}
          <span>📐 {property.sqft.toLocaleString()} sqft</span>
        </div>
        <Link 
          to={`/properties/${property.id}`} 
          className={styles.viewBtn} 
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

export default function CategoryHero({ categoryId, categoryTitle, onBack }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const images = CATEGORY_IMAGES[categoryId] || CATEGORY_IMAGES.Villa;
  const taxonomy = FILTER_TAXONOMY[categoryId];

  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    location: '',
    priceMax: '',
    ...Object.fromEntries((taxonomy?.subFilters || []).map(sf => [sf.key, '']))
  });
  const [showSubFilters, setShowSubFilters] = useState(false);

  const handleFilterChange = (e) => {
    setLocalFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Apply filters to images (client-side, simple)
  const filteredImages = images.filter(img => {
    if (localFilters.location && img.location !== localFilters.location) return false;
    if (localFilters.priceMax) {
      const numericPrice = img.price;
      if (numericPrice > parseFloat(localFilters.priceMax)) return false;
    }
    return true;
  });

  // Title: scale up as you scroll, then fade out
  const titleScale = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 1.3, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 0.85], [1, 0.8, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const springTitleScale = useSpring(titleScale, { stiffness: 60, damping: 22 });
  const springTitleOpacity = useSpring(titleOpacity, { stiffness: 80, damping: 28 });
  const springTitleY = useSpring(titleY, { stiffness: 60, damping: 22 });

  // Listings reveal opacity
  const listingsOpacity = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);
  const listingsSpring = useSpring(listingsOpacity, { stiffness: 60, damping: 25 });

  return (
    <div ref={containerRef} className={styles.outerWrap}>
      {/* Sticky hero panel — images float here & scroll away */}
      <div ref={heroRef} className={styles.heroPanel}>
        <div className={styles.heroInner}>
          {/* Back button */}
          <motion.button
            className={styles.backBtn}
            onClick={onBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            ← Back
          </motion.button>

          {/* Floating images */}
          {images.slice(0, 4).map((img, i) => (
            <FloatingImage
              key={img.id}
              src={img.images[0]}
              position={FLOAT_POSITIONS[i]}
              scrollProgress={scrollYProgress}
              index={i}
            />
          ))}

          {/* Big category name */}
          <motion.div
            className={styles.heroTitle}
            style={{
              scale: springTitleScale,
              opacity: springTitleOpacity,
              y: springTitleY,
            }}
          >
            {categoryTitle}
          </motion.div>


        </div>
      </div>

      {/* Listings that emerge below the hero */}
      <motion.section
        className={styles.listingsSection}
        style={{ opacity: listingsSpring }}
      >
        <div className={styles.listingsHeader}>
          <h2>{categoryTitle}</h2>
          <p>{filteredImages.length} properties available</p>
        </div>

        {/* ── Filter Bar ──────────────────────────────── */}
        <div className={styles.filterWrap}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Location</label>
              <select name="location" value={localFilters.location} onChange={handleFilterChange}>
                <option value="">All Locations</option>
                {[...new Set(images.map(i => i.location))].map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Max Price</label>
              <select name="priceMax" value={localFilters.priceMax} onChange={handleFilterChange}>
                <option value="">No Max</option>
                <option value="500000">Up to $500k</option>
                <option value="1000000">Up to $1M</option>
                <option value="2000000">Up to $2M</option>
                <option value="5000000">Up to $5M</option>
              </select>
            </div>
            {taxonomy?.subFilters?.length > 0 && (
              <button
                className={styles.subFilterToggle}
                onClick={() => setShowSubFilters(v => !v)}
              >
                <SlidersHorizontal size={16} />
                {showSubFilters ? 'Less Filters' : 'More Filters'}
              </button>
            )}
            <button className={styles.searchBtn} onClick={() => { }}>
              <Search size={16} /> Search
            </button>
          </div>

          <AnimatePresence>
            {showSubFilters && taxonomy?.subFilters && (
              <motion.div
                className={styles.subFilterRow}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
                transition={{ duration: 0.3 }}
              >
                {taxonomy.subFilters.map(sf => (
                  <div key={sf.key} className={styles.filterGroup}>
                    <label>{sf.label}</label>
                    <select name={sf.key} value={localFilters[sf.key] || ''} onChange={handleFilterChange}>
                      <option value="">Any {sf.label}</option>
                      {sf.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.listingsGrid}>
          {filteredImages.length > 0
            ? filteredImages.map((property, i) => (
              <PropertyListingCard key={property.id} property={property} index={i} />
            ))
            : <p className={styles.noResults}>No properties match your filters.</p>
          }
        </div>
      </motion.section>
    </div>
  );
}
