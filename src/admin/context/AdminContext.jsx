import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Section Visibility Logic
  const [sections, setSections] = useState({
    showFlats: true,
    showPlots: true,
    showWarehouses: true,
    showVillas: true,
    showReviews: true,
    showContactForm: true,
  });

  // Dark mode — persisted in localStorage
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('adminTheme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
      localStorage.setItem('adminTheme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'New Enquiry', message: 'New enquiry from Alice Smith about Skyline Penthouse', time: '2 min ago', read: false, link: '/admin/inquiries' },
    { id: 2, type: 'New Review', message: 'Jonathan Doe left a 5-star review — pending approval', time: '1 hour ago', read: false, link: '/admin/reviews?filter=pending' },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => setNotifications([]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const [properties, setProperties] = useState([
    { id: 1, title: 'Skyline Penthouse', category: 'Flat', price: '45000000', area: '3200', bedrooms: '4', bathrooms: '3', location: 'Downtown', address: '12 Sky Tower, Downtown', status: 'Active', isFeatured: true, numericPrice: 45000000, agentName: 'Ravi Kumar', agentPhone: '+91 9876543210', agentPhoto: null, description: 'Stunning penthouse with panoramic city views.', amenities: ['Swimming Pool', 'Gym', 'Elevator'], mapsUrl: '' },
    { id: 2, title: 'Azure Villa', category: 'Villa', price: '80000000', area: '8500', bedrooms: '6', bathrooms: '5', location: 'Suburbs', address: '45 Green Meadows, Suburbs', status: 'Active', isFeatured: false, numericPrice: 80000000, agentName: 'Priya Mehta', agentPhone: '+91 9876543211', agentPhoto: null, description: 'Luxury villa with private pool and garden.', amenities: ['Swimming Pool', '24/7 Security', 'Private Garage'], mapsUrl: '' },
    { id: 3, title: 'Oceanview Plot', category: 'Plot', price: '21000000', area: '5000', bedrooms: '', bathrooms: '', location: 'Coastal', address: '78 Coastal Road, Marine Drive', status: 'Inactive', isFeatured: false, numericPrice: 21000000, agentName: 'Suresh Patel', agentPhone: '+91 9876543212', agentPhoto: null, description: 'Prime coastal plot with ocean views.', amenities: ['City Water Supply'], mapsUrl: '' },
    { id: 4, title: 'Industrial Hub', category: 'Warehouse', price: '120000000', area: '25000', bedrooms: '', bathrooms: '', location: 'Outskirts', address: '1 Industrial Estate, Outskirts', status: 'Active', isFeatured: false, numericPrice: 120000000, agentName: 'Amit Shah', agentPhone: '+91 9876543213', agentPhoto: null, description: 'Large warehouse complex with loading docks.', amenities: ['Power Backup', 'CCTV', '24/7 Security'], mapsUrl: '' },
    { id: 5, title: 'Modern Studio', category: 'Flat', price: '8500000', area: '650', bedrooms: '1', bathrooms: '1', location: 'Downtown', address: '5 Central Ave, Downtown', status: 'Active', isFeatured: true, numericPrice: 8500000, agentName: 'Ravi Kumar', agentPhone: '+91 9876543210', agentPhoto: null, description: 'Compact modern studio in city centre.', amenities: ['High-Speed Internet', 'CCTV'], mapsUrl: '' },
  ]);

  const [customCategories, setCustomCategories] = useState([]);

  const addCustomCategory = (name) => {
    if (name && !customCategories.includes(name.trim()) && !['Flat', 'Villa', 'Plot', 'Warehouse'].includes(name.trim())) {
      setCustomCategories(prev => [...prev, name.trim()]);
    }
  };

  const deleteCustomCategory = (name, action = 'delete') => {
    setCustomCategories(prev => prev.filter(c => c !== name));
    if (action === 'delete') {
      setProperties(prev => prev.filter(p => p.category !== name));
    } else {
      setProperties(prev => prev.map(p => p.category === name ? { ...p, category: 'Uncategorized' } : p));
    }
  };

  return (
    <AdminContext.Provider 
      value={{
        isAuthenticated, login, logout,
        sections, setSections,
        notifications, setNotifications, markAllAsRead, deleteNotification, clearAllNotifications,
        isDark, toggleTheme,
        properties, setProperties, customCategories, addCustomCategory, deleteCustomCategory
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
