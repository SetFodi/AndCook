// src/components/ui/ThemeToggle.tsx
'use client';

import { motion } from 'framer-motion';
import { GiEgg, GiCookie } from 'react-icons/gi'; // Food-themed icons
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex items-center justify-center"
      >
        {theme === 'light' ? (
          <GiCookie size={24} className="text-gray-800" />
        ) : (
          <GiEgg size={24} className="text-yellow-300" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
