import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, UploadCloud, User } from 'lucide-react';
import { FlatIcon, PlotIcon, WarehouseIcon, VillaIcon } from '../components/icons/PropertyIcons';
import styles from '../styles/admin.module.css';

const MOCK_PROPERTIES = [
  { id: 1, title: 'Skyline Penthouse', category: 'Flats', price: '₹4.5Cr', location: 'Downtown', status: 'Active', numericPrice: 45000000 },
  { id: 2, title: 'Azure Villa', category: 'Villas', price: '₹8.0Cr', location: 'Suburbs', status: 'Active', numericPrice: 80000000 },
  { id: 3, title: 'Oceanview Plot', category: 'Plots', price: '₹2.1Cr', location: 'Coastal', status: 'Inactive', numericPrice: 21000000 },
  { id: 4, title: 'Industrial Hub', category: 'Warehouses', price: '₹12.0Cr', location: 'Outskirts', status: 'Active', numericPrice: 120000000 },
  { id: 5, title: 'Modern Studio', category: 'Flats', price: '₹85L', location: 'Downtown', status: 'Active', numericPrice: 8500000 },
];

const PRESET_AMENITIES = [
  'Swimming Pool', '24/7 Security', 'Private Garage', 'Central AC / Heating',
  'Smart Home System', 'Outdoor BBQ Area', 'City Water Supply', 'High-Speed Internet',
  'Gym', 'Elevator', 'CCTV', 'Power Backup'
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
  const agentPhotoRef = useRef(null);

  // Expanded Form State
  const initialForm = {
    title: '', category: 'Flat', status: 'Active', isFeatured: false,
    price: '', area: '', bedrooms: '', bathrooms: '',
    address: '', mapsUrl: '', agentName: '', agentPhone: '', agentPhoto: null,
    description: '', amenities: []
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');

  const pathSegments = location.pathname.split('/');
  const activeCategory = pathSegments[pathSegments.length - 1];

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

  const uniqueLocations = [...new Set(properties.map(p => p.location))];

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
    return 0; 
  });

  const clearFilters = () => {
    setSearchTerm(''); setStatusFilter('All'); setPriceFilter('All'); setLocFilter('All'); setSortOrder('Newest First');
  };
  const hasActiveFilters = searchTerm || statusFilter !== 'All' || priceFilter !== 'All' || locFilter !== 'All' || sortOrder !== 'Newest First';

  // --- Image Upload Logic ---
  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAgentPhoto = (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(prev => ({ ...prev, agentPhoto: ev.target.result }));
    reader.readAsDataURL(e.target.files[0]);
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));
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

  // --- Form Logic ---
  const handleFormChange = (prop, val) => {
    setFormData(prev => ({...prev, [prop]: val}));
    setFormErrors(prev => prev.filter(err => err !== prop));
  };

  const toggleAmenity = (name) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(name);
      return { ...prev, amenities: exists ? prev.amenities.filter(a => a !== name) : [...prev.amenities, name] };
    });
  };

  const handleCustomAmenity = (e) => {
    if (e.key === 'Enter' && customAmenity.trim()) {
      e.preventDefault();
      if (!formData.amenities.includes(customAmenity.trim())) {
        toggleAmenity(customAmenity.trim());
      }
      setCustomAmenity('');
    }
  };

  const handleSaveProperty = () => {
    // Validation
    const required = ['title', 'category', 'status', 'price', 'area', 'address'];
    const newErrors = [];
    required.forEach(req => {
      if (!formData[req]) newErrors.push(req);
    });
    if (images.length === 0) newErrors.push('images');
    
    if (newErrors.length > 0) {
      setFormErrors(newErrors);
      return; 
    }
    
    // Success simulation
    setIsDrawerOpen(false);
  };

  const SectionHeading = ({ children }) => (
    <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--admin-stroke)', paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '2rem' }}>
      {children}
    </h3>
  );

  const Label = ({ children, required }) => (
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
      {children} {required && <span style={{ color: '#ed1b24' }}>*</span>}
    </label>
  );

  const getInputStyle = (field) => ({
    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.4)',
    border: formErrors.includes(field) ? '1px solid #ed1b24' : '1px solid var(--admin-glass-border)',
    borderRadius: 12, outline: 'none', color: 'var(--admin-text-main)',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', fontFamily: 'Outfit'
  });

  // Hiding bed/bath for Plot/Warehouse
  const isRoomApplicable = formData.category !== 'Plot' && formData.category !== 'Warehouse';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'Outfit' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {getPageIcon()}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>{getPageTitle()}</h2>
        </div>
        <button 
          className="btn" 
          style={{ background: '#ed1b24', color: 'white', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 700 }}
          onClick={() => { setIsDrawerOpen(true); setEditingId(null); setImages([]); setFormData(initialForm); setFormErrors([]); }}
        >
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Property
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.glassCard} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
          <input 
            type="text" placeholder="Search by title or location..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }} 
          />
          {searchTerm && <X size={16} onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--admin-text-muted)' }} />}
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
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
        </select>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {hasActiveFilters && <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#ed1b24', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Clear All Filters</button>}
          <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 300 }}>{filteredProperties.length} results found</span>
        </div>
      </div>

      {/* Main Table */}
      <div className={styles.glassCard} style={{ minHeight: 400 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[...Array(5)].map((_, idx) => <div key={idx} style={{ height: 60, borderRadius: 12, background: 'rgba(0,0,0,0.06)', animation: 'shimmer 2s infinite' }} />)}
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
                  <motion.tr key={prop.id} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} style={{ borderBottom: '1px solid var(--admin-stroke)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{prop.title}</td>
                    <td style={{ padding: '1rem', fontWeight: 300 }}>{prop.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 300, color: 'var(--admin-text-muted)' }}>{prop.location}</td>
                    <td style={{ padding: '1rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{prop.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: prop.status === 'Active' ? 'rgba(46,204,113,0.1)' : 'rgba(85,85,85,0.1)', color: prop.status === 'Active' ? '#2ecc71' : '#555555' }}>
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

      <style dangerouslySetInnerHTML={{__html:`
        .no-spinners::-webkit-inner-spin-button, 
        .no-spinners::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinners { -moz-appearance: textfield; }
      `}}/>

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
                width: '100%', maxWidth: 580, height: '100%', background: 'var(--admin-glass-bg)',
                backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                borderLeft: '1px solid var(--admin-glass-border)',
                display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 2.5rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>
                  {editingId ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button onClick={() => setIsDrawerOpen(false)} className={styles.iconBtn} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '0.5rem' }}><X size={20} /></button>
              </div>

              {/* Scrollable Form Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 2.5rem 2.5rem' }}>
                
                {formErrors.length > 0 && <p style={{ color: '#ed1b24', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 600 }}>Please fill out all required fields marked in red.</p>}

                {/* Section 1 */}
                <SectionHeading>Section 1 — Basic Information</SectionHeading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <Label required>Property Title</Label>
                    <input type="text" placeholder="Enter property title..." value={formData.title} onChange={e => handleFormChange('title', e.target.value)} style={getInputStyle('title')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <Label required>Category</Label>
                      <select value={formData.category} onChange={e => handleFormChange('category', e.target.value)} style={getInputStyle('category')}>
                        <option value="Flat">Flat</option>
                        <option value="Plot">Plot</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>
                    <div>
                      <Label required>Status</Label>
                      <select value={formData.status} onChange={e => handleFormChange('status', e.target.value)} style={getInputStyle('status')}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => handleFormChange('isFeatured', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: formData.isFeatured ? '#18181a' : 'rgba(0,0,0,0.1)', borderRadius: 24, transition: '0.3s' }}>
                        <span style={{ position: 'absolute', height: 18, width: 18, left: 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '0.3s', transform: formData.isFeatured ? 'translateX(20px)' : 'translateX(0)' }}></span>
                      </span>
                    </label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Is Featured?</span>
                  </div>
                </div>

                {/* Section 2 */}
                <SectionHeading>Section 2 — Pricing & Size</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <Label required>Price (₹)</Label>
                    <input type="number" placeholder="Enter price in ₹..." className="no-spinners" value={formData.price} onChange={e => handleFormChange('price', e.target.value)} style={getInputStyle('price')} />
                  </div>
                  <div>
                    <Label required>Area (sqft)</Label>
                    <input type="number" placeholder="Enter area in sqft..." className="no-spinners" value={formData.area} onChange={e => handleFormChange('area', e.target.value)} style={getInputStyle('area')} />
                  </div>
                </div>
                <AnimatePresence>
                  {isRoomApplicable && (
                    <motion.div initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <Label>Bedrooms</Label>
                          <input type="number" placeholder="No. of bedrooms" className="no-spinners" value={formData.bedrooms} onChange={e => handleFormChange('bedrooms', e.target.value)} style={getInputStyle('bedrooms')} />
                        </div>
                        <div>
                          <Label>Bathrooms</Label>
                          <input type="number" placeholder="No. of bathrooms" className="no-spinners" value={formData.bathrooms} onChange={e => handleFormChange('bathrooms', e.target.value)} style={getInputStyle('bathrooms')} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section 3 */}
                <SectionHeading>Section 3 — Location</SectionHeading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <Label required>Full Address</Label>
                    <input type="text" placeholder="Enter full address..." value={formData.address} onChange={e => handleFormChange('address', e.target.value)} style={getInputStyle('address')} />
                  </div>
                  <div>
                    <Label>Google Maps Embed URL</Label>
                    <input type="text" placeholder="Paste Google Maps embed URL..." value={formData.mapsUrl} onChange={e => handleFormChange('mapsUrl', e.target.value)} style={getInputStyle('mapsUrl')} />
                  </div>
                </div>

                {/* Section 4 */}
                <SectionHeading>Section 4 — Agent Details</SectionHeading>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', border: '1px dashed var(--admin-stroke)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }} onClick={() => agentPhotoRef.current?.click()}>
                    {formData.agentPhoto ? (
                      <img src={formData.agentPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Agent" />
                    ) : (
                      <User size={32} color="var(--admin-text-muted)" />
                    )}
                    <input type="file" accept="image/*" style={{ display: 'none' }} ref={agentPhotoRef} onChange={handleAgentPhoto} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <Label>Agent Name</Label>
                      <input type="text" placeholder="Assigned agent name..." value={formData.agentName} onChange={e => handleFormChange('agentName', e.target.value)} style={getInputStyle('agentName')} />
                    </div>
                    <div>
                      <Label>Agent Phone</Label>
                      <input type="text" placeholder="Agent contact number..." value={formData.agentPhone} onChange={e => handleFormChange('agentPhone', e.target.value)} style={getInputStyle('agentPhone')} />
                    </div>
                  </div>
                </div>

                {/* Section 5 */}
                <SectionHeading>Section 5 — Description</SectionHeading>
                <div>
                  <Label>Property Description</Label>
                  <textarea placeholder="Write a detailed description..." rows={4} value={formData.description} onChange={e => handleFormChange('description', e.target.value)} style={{ ...getInputStyle('description'), minHeight: 120, resize: 'vertical' }} />
                </div>

                {/* Section 6 */}
                <SectionHeading>Section 6 — Amenities</SectionHeading>
                <div>
                  <Label>Amenities</Label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {PRESET_AMENITIES.map(amenity => {
                      const isActive = formData.amenities.includes(amenity);
                      return (
                        <button key={amenity} onClick={() => toggleAmenity(amenity)} style={{ padding: '0.4rem 0.8rem', borderRadius: 20, background: isActive ? '#18181a' : 'rgba(255,255,255,0.4)', color: isActive ? 'white' : 'var(--admin-text-main)', border: isActive ? '1px solid transparent' : '1px solid var(--admin-stroke)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}>
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                  {/* Custom additions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {formData.amenities.filter(a => !PRESET_AMENITIES.includes(a)).map(amenity => (
                       <span key={amenity} style={{ padding: '0.4rem 0.8rem', borderRadius: 20, background: '#18181a', color: 'white', border: '1px solid transparent', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         {amenity} <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleAmenity(amenity)} />
                       </span>
                    ))}
                    <input type="text" placeholder="Type custom amenity & press Enter..." value={customAmenity} onChange={e => setCustomAmenity(e.target.value)} onKeyDown={handleCustomAmenity} style={{ ...getInputStyle('customAmenity'), padding: '0.4rem 1rem', width: 220, borderRadius: 20 }} />
                  </div>
                </div>

                {/* Section 7 */}
                <SectionHeading>Section 7 — Property Images</SectionHeading>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Label required>Upload Images</Label>
                    <span style={{ fontSize: '0.8rem', color: images.length >= 8 ? '#ed1b24' : 'var(--admin-text-muted)' }}>{images.length}/8 max</span>
                  </div>
                  
                  <div onClick={() => images.length < 8 && fileInputRef.current?.click()} style={{ border: formErrors.includes('images') ? '2px dashed #ed1b24' : '2px dashed var(--admin-stroke)', borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', cursor: images.length < 8 ? 'pointer' : 'not-allowed', opacity: images.length < 8 ? 1 : 0.5 }}>
                    <UploadCloud size={32} color="var(--admin-text-muted)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-body)', fontWeight: 300 }}>Drag images here or click to browse</p>
                    <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>
                  {formErrors.includes('images') && <span style={{ color: '#ed1b24', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}>Please upload at least one image.</span>}

                  {images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '1rem 0', marginTop: '0.5rem' }}>
                      {images.map((src, i) => (
                        <div key={i} style={{ position: 'relative', flexShrink: 0, width: 100, height: 100, borderRadius: 12, overflow: 'hidden' }}>
                          <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {i === 0 && <span style={{ position: 'absolute', top: 4, left: 4, background: '#ed1b24', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>COVER</span>}
                          <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
                          <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                            {i > 0 && <button onClick={() => moveImage(i, -1)} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>&lt;</button>}
                            {i < images.length - 1 && <button onClick={() => moveImage(i, 1)} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>&gt;</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', display: 'flex', gap: '1rem', position: 'sticky', bottom: 0 }}>
                <button className="btn" onClick={() => setIsDrawerOpen(false)} style={{ background: 'transparent', color: '#555555', border: '1px solid var(--admin-stroke)', padding: '1rem 2rem', fontWeight: 600 }}>Cancel</button>
                <button className="btn" onClick={handleSaveProperty} style={{ background: '#ed1b24', color: 'white', border: 'none', padding: '1rem', fontWeight: 700, flex: 1, boxShadow: '0 8px 30px rgba(237,27,36,0.3)' }}>
                  {editingId ? 'Save Changes' : 'Save Property'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
