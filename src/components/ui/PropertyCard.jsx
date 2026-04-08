import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Scaling } from 'lucide-react';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const { id, title, price, status, location, beds, baths, sqft, images } = property;

  return (
    <motion.article 
      className={styles.propertyCard}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imgWrapper}>
        <span className={styles.badge} style={{ backgroundColor: status === 'For Rent' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.5)', color: status === 'For Rent' ? 'white' : '#222' }}>
          {status}
        </span>
        <img src={images[0]} alt={title} className={styles.propertyImg} />
      </div>
      <div className={styles.content}>
        <div className={styles.price}>
          ${price.toLocaleString()} {status === 'For Rent' && <span className={styles.perMonth}>/mo</span>}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.location}>
          <MapPin size={16} /> {location}
        </div>
        <div className={styles.features}>
          <span className={styles.featureItem}><BedDouble size={16} /> {beds} Beds</span>
          <span className={styles.featureItem}><Bath size={16} /> {baths} Baths</span>
          <span className={styles.featureItem}><Scaling size={16} /> {sqft.toLocaleString()} sqft</span>
        </div>
        <Link to={`/properties/${id}`} className="btn btn-outline" style={{ width: '100%' }}>View Details</Link>
      </div>
    </motion.article>
  );
}
