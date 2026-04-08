import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import styles from '../styles/admin.module.css';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className={styles.adminLayout}>
      <div className={styles.adminCanvas}></div>
      <Sidebar />
      <div className={styles.mainContent}>
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
    </div>
  );
}
