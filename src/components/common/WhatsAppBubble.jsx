import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './WhatsAppBubble.module.css';

export default function WhatsAppBubble() {
  return (
    <div className={styles.floatingActions}>
      <motion.a 
        href="https://wa.me/15551234567" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.floatBtn}
        title="Chat on WhatsApp"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
}
