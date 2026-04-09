import React, { createContext, useState, useContext } from 'react';

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

  // Mock Notifications for TopNavbar Bell Drops
  // Replace with Firebase onSnapshot listener
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'New Inquiry', message: 'New inquiry from Alice Smith about Skyline Penthouse', time: '2 min ago', read: false, link: '/admin/inquiries' },
    { id: 2, type: 'New Review', message: 'Jonathan Doe left a 5-star review — pending approval', time: '1 hour ago', read: false, link: '/admin/reviews?filter=pending' },
    { id: 3, type: 'New Client', message: 'New client registered: Michael Chen', time: '5 hours ago', read: false, link: '/admin/clients' },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AdminContext.Provider 
      value={{
        isAuthenticated, login, logout,
        sections, setSections,
        notifications, markAllAsRead
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
