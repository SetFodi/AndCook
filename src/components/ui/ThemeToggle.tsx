// src/components/ui/ThemeToggle.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiHamburger, GiMoon } from 'react-icons/gi'; // More food-themed icons
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : 180,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 0.5 },
          scale: { duration: 0.3 }
        }}
        className="relative w-6 h-6 flex items-center justify-center"
      >
        {theme === 'light' ? (
          <GiHamburger 
            size={22} 
            className="text-amber-600 absolute transform transition-all duration-300" 
          />
        ) : (
          <GiMoon 
            size={22} 
            className="text-indigo-300 absolute transform transition-all duration-300" 
          />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
