import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building, Store, Map, ArrowLeft } from 'lucide-react';
import { PropertiesContext } from '../context/PropertiesContext';
import PropertyCard from '../components/ui/PropertyCard';
import FilterBar from '../components/ui/FilterBar';
import { revealVariants, revealViewport } from '../hooks/useScrollReveal';
import styles from './Properties.module.css';

const CATEGORIES = [
  { id: 'Villa', title: 'Villas', icon: Home, desc: 'Luxury standalone houses' },
  { id: 'Apartment', title: 'Flats & Apartments', icon: Building, desc: 'Premium city living' },
  { id: 'Commercial', title: 'Commercial & Warehouses', icon: Store, desc: 'Office and retail spaces' },
  { id: 'Plot', title: 'Plots & Land', icon: Map, desc: 'Build your dream project' }
];

export default function Properties() {
  const { properties, loading, error, setFilters, filters } = useContext(PropertiesContext);
  const [selectedCategory, setSelectedCategory] = useState(filters.type || null);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilters({ ...filters, type: categoryId });
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setFilters({});
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
          <h1>Our Properties</h1>
          <p className="subtitle">Discover our portfolio of premium real estate listings.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ marginTop: selectedCategory ? '0' : '4rem' }}>
          
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div 
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid" 
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}
              >
                {CATEGORIES.map((cat, i) => (
                  <motion.div 
                    key={cat.id}
                    variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div 
                      className={styles.categoryCard} 
                      onClick={() => handleSelectCategory(cat.id)}
                    >
                      <cat.icon size={48} className={styles.categoryIcon} />
                      <h2>{cat.title}</h2>
                      <p className={styles.categoryDesc}>{cat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="properties"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <button onClick={handleBack} className={`btn ${styles.backBtn}`}>
                  <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Categories
                </button>

                <div style={{ marginTop: '2rem' }}>
                  <FilterBar />
                </div>

                <div style={{ marginTop: '4rem' }}>
                  {loading && <p>Loading properties...</p>}
                  {error && <p>Error: {error}</p>}
                  
                  {!loading && !error && (
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                      {properties.map((prop, i) => (
                        <motion.div 
                          key={prop.id}
                          variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport}
                          transition={{ delay: i * 0.1 }}
                        >
                          <PropertyCard property={prop} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {!loading && properties.length === 0 && (
                    <p>No properties found matching your criteria.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </motion.div>
  );
}
