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
    { id: 1, type: 'New Inquiry', message: 'New inquiry from Alice Smith about Skyline Penthouse', time: '2 min ago', read: false, link: '/admin/inquiries' },
    { id: 2, type: 'New Review', message: 'Jonathan Doe left a 5-star review — pending approval', time: '1 hour ago', read: false, link: '/admin/reviews?filter=pending' },
    { id: 3, type: 'New Client', message: 'New client registered: Michael Chen', time: '5 hours ago', read: false, link: '/admin/clients' },
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

  return (
    <AdminContext.Provider 
      value={{
        isAuthenticated, login, logout,
        sections, setSections,
        notifications, setNotifications, markAllAsRead, deleteNotification, clearAllNotifications,
        isDark, toggleTheme,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
