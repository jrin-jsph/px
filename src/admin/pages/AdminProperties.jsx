import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, UploadCloud, GripVertical } from 'lucide-react';
import { FlatIcon, PlotIcon, WarehouseIcon, VillaIcon } from '../components/icons/PropertyIcons';
import styles from '../styles/admin.module.css';

const MOCK_PROPERTIES = [
  { id: 1, title: 'Skyline Penthouse', category: 'Flats', price: '₹4.5Cr', location: 'Downtown', status: 'Active', numericPrice: 45000000 },
  { id: 2, title: 'Azure Villa', category: 'Villas', price: '₹8.0Cr', location: 'Suburbs', status: 'Active', numericPrice: 80000000 },
  { id: 3, title: 'Oceanview Plot', category: 'Plots', price: '₹2.1Cr', location: 'Coastal', status: 'Inactive', numericPrice: 21000000 },
  { id: 4, title: 'Industrial Hub', category: 'Warehouses', price: '₹12.0Cr', location: 'Outskirts', status: 'Active', numericPrice: 120000000 },
  { id: 5, title: 'Modern Studio', category: 'Flats', price: '₹85L', location: 'Downtown', status: 'Active', numericPrice: 8500000 },
];

export default function AdminProperties() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest First');
  
  // Image Upload State
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const pathSegments = location.pathname.split('/');
  const activeCategory = pathSegments[pathSegments.length - 1]; // "flats", "properties", etc.

  // 1. Loading Skeleton
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filteredDb = MOCK_PROPERTIES;
      if (activeCategory !== 'properties') {
        const catMap = { flats: 'Flats', plots: 'Plots', warehouses: 'Warehouses', villas: 'Villas' };
        filteredDb = MOCK_PROPERTIES.filter(p => p.category === catMap[activeCategory]);
      }
      setProperties(filteredDb);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const getPageIcon = () => {
    if (activeCategory === 'flats') return <FlatIcon size={32} />;
    if (activeCategory === 'villas') return <VillaIcon size={32} />;
    if (activeCategory === 'warehouses') return <WarehouseIcon size={32} />;
    if (activeCategory === 'plots') return <PlotIcon size={32} />;
    return <WarehouseIcon size={32} />;
  };

  const getPageTitle = () => activeCategory === 'properties' ? 'All Properties' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  // Deriving unique locations
  const uniqueLocations = [...new Set(properties.map(p => p.location))];

  // Apply filters via chained logic
  const filteredProperties = properties.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term);
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchLoc = locFilter === 'All' || p.location === locFilter;
    
    let matchPrice = true;
    if (priceFilter === 'Under ₹50L') matchPrice = p.numericPrice < 5000000;
    if (priceFilter === '₹50L–₹1Cr') matchPrice = p.numericPrice >= 5000000 && p.numericPrice <= 10000000;
    if (priceFilter === '₹1Cr–₹5Cr') matchPrice = p.numericPrice > 10000000 && p.numericPrice <= 50000000;
    if (priceFilter === 'Above ₹5Cr') matchPrice = p.numericPrice > 50000000;

    return matchSearch && matchStatus && matchLoc && matchPrice;
  }).sort((a, b) => {
    if (sortOrder === 'Price: Low to High') return a.numericPrice - b.numericPrice;
    if (sortOrder === 'Price: High to Low') return b.numericPrice - a.numericPrice;
    return 0; // Newest/Oldest placeholder logic
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriceFilter('All');
    setLocFilter('All');
    setSortOrder('Newest First');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'All' || priceFilter !== 'All' || locFilter !== 'All' || sortOrder !== 'Newest First';

  // --- Image Upload Logic ---
  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Read files as base64
    files.forEach(file => {
      if (images.length >= 8) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages(prev => {
          if (prev.length >= 8) return prev;
          return [...prev, ev.target.result];
        });
      };
      reader.readAsDataURL(file);
    });
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, dir) => {
    if (index + dir < 0 || index + dir >= images.length) return;
    setImages(prev => {
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[index + dir];
      arr[index + dir] = temp;
      return arr;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {getPageIcon()}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>{getPageTitle()}</h2>
        </div>
        <button 
          className="btn" 
          style={{ background: '#ed1b24', color: 'white', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 700 }}
          onClick={() => { setIsDrawerOpen(true); setEditingId(null); setImages([]); }}
        >
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Property
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.glassCard} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }} 
          />
          {searchTerm && (
            <X size={16} onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--admin-text-muted)' }} />
          )}
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600 }}>
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600 }}>
          <option value="All">Price: All</option>
          <option value="Under ₹50L">Under ₹50L</option>
          <option value="₹50L–₹1Cr">₹50L–₹1Cr</option>
          <option value="₹1Cr–₹5Cr">₹1Cr–₹5Cr</option>
          <option value="Above ₹5Cr">Above ₹5Cr</option>
        </select>

        <select value={locFilter} onChange={e => setLocFilter(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600 }}>
          <option value="All">Location: All</option>
          {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid var(--admin-stroke)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontWeight: 600 }}>
          <option value="Newest First">Newest First</option>
          <option value="Oldest First">Oldest First</option>
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
        </select>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#ed1b24', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Clear All Filters</button>
          )}
          <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 300 }}>{filteredProperties.length} results found</span>
        </div>
      </div>

      {/* Main Table */}
      <div className={styles.glassCard} style={{ minHeight: 400 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} style={{ height: 60, borderRadius: 12, background: 'rgba(0,0,0,0.06)', animation: 'shimmer 2s infinite' }} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--admin-text-muted)' }}>
            <Search size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
            <p>No properties match your exact filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <motion.table initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-stroke)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Title</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Category</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Location</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Price</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((prop, i) => (
                  <motion.tr 
                    key={prop.id}
                    variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                    style={{ borderBottom: '1px solid var(--admin-stroke)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{prop.title}</td>
                    <td style={{ padding: '1rem', fontWeight: 300 }}>{prop.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)' }}>{prop.location}</td>
                    <td style={{ padding: '1rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{prop.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                        background: prop.status === 'Active' ? 'rgba(46,204,113,0.1)' : 'rgba(85,85,85,0.1)',
                        color: prop.status === 'Active' ? '#2ecc71' : '#555555' 
                      }}>
                        {prop.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className={styles.iconBtn} onClick={() => { setIsDrawerOpen(true); setEditingId(prop.id); }}><Edit2 size={16} /></button>
                        <button className={styles.iconBtn} style={{ color: '#ed1b24' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}
      </div>

      {/* Slide-in Form Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 520, height: '100%', background: 'var(--admin-glass-bg)',
                backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                borderLeft: '1px solid var(--admin-glass-border)', padding: '2.5rem',
                display: 'flex', flexDirection: 'column', overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>
                  {editingId ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button onClick={() => setIsDrawerOpen(false)} className={styles.iconBtn} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '0.5rem' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Title</label>
                  <input type="text" placeholder="Property Title" style={{ width: '100%' }} />
                </div>
                
                {/* Image Upload Zone */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Property Images</label>
                    <span style={{ fontSize: '0.8rem', color: images.length >= 8 ? '#ed1b24' : 'var(--admin-text-muted)' }}>{images.length}/8 images</span>
                  </div>
                  
                  <div 
                    onClick={() => images.length < 8 && fileInputRef.current?.click()}
                    style={{ 
                      border: '2px dashed var(--admin-stroke)', borderRadius: 12, padding: '2rem', 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.4)', cursor: images.length < 8 ? 'pointer' : 'not-allowed', opacity: images.length < 8 ? 1 : 0.5
                    }}
                  >
                    <UploadCloud size={32} color="var(--admin-text-muted)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-body)', fontWeight: 300 }}>Drag images here or click to browse</p>
                    <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>

                  {images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '1rem 0', marginTop: '0.5rem' }}>
                      {images.map((src, i) => (
                        <div key={i} style={{ position: 'relative', flexShrink: 0, width: 100, height: 100, borderRadius: 12, overflow: 'hidden' }}>
                          <img src={src} alt={`preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {i === 0 && (
                            <span style={{ position: 'absolute', top: 4, left: 4, background: '#ed1b24', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>COVER</span>
                          )}
                          <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
                          
                          <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                            {i > 0 && <button onClick={() => moveImage(i, -1)} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 4px' }}>&lt;</button>}
                            {i < images.length - 1 && <button onClick={() => moveImage(i, 1)} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 4px' }}>&gt;</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Note: Store array logic locally for preview. Replace with Firebase Storage upload on submit. */}
                </div>

                <button 
                  className="btn" 
                  style={{ background: '#18181a', color: 'white', border: 'none', padding: '1rem', fontWeight: 700, marginTop: '1rem' }}
                >
                  {editingId ? 'Update Property' : 'Publish Property'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
