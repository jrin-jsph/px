import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Login from '../pages/Login';
import { useAdmin } from '../context/AdminContext';
import styles from '../styles/admin.module.css';

export default function AdminLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAdmin();

  return (
    <div className={styles.adminLayout}>
      <div className={styles.adminCanvas}></div>
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div key="login" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, scale: 0.98}} style={{width: '100%'}}>
            <Login />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} style={{display: 'flex', width: '100%', height: '100vh', overflow: 'hidden'}}>
            <Sidebar />
            <div className={styles.mainContent} style={{ overflowY: 'auto' }}>
              <TopNavbar />
              <main className={styles.pageContainer}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    style={{ height: '100%' }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
