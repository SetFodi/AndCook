'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaPizzaSlice, FaHamburger, FaIceCream, FaCarrot, FaAppleAlt } from 'react-icons/fa';
import { GiCupcake, GiNoodles, GiChopsticks } from 'react-icons/gi';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

// Reduced number of food icons to improve performance
const foodIcons = [
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaCarrot,
  GiCupcake
];

export default function LoadingIndicator({
  size = 'medium',
  text = 'Loading delicious content...',
  fullScreen = false
}: LoadingIndicatorProps) {
  // Determine size based on prop
  const sizeMap = {
    small: {
      container: 'w-16 h-16',
      icon: 'text-2xl',
      orbit: 'w-16 h-16',
      text: 'text-sm mt-2'
    },
    medium: {
      container: 'w-24 h-24',
      icon: 'text-3xl',
      orbit: 'w-24 h-24',
      text: 'text-base mt-3'
    },
    large: {
      container: 'w-32 h-32',
      icon: 'text-4xl',
      orbit: 'w-32 h-32',
      text: 'text-lg mt-4'
    }
  };

  const selectedSize = sizeMap[size];

  // Animation variants for the orbiting food icons - optimized for performance
  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 12, // Slower rotation to reduce CPU usage
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  // Animation for each food icon - optimized for performance
  const iconVariants = {
    animate: (i: number) => ({
      scale: [1, 1.1, 1], // Reduced scale change
      transition: {
        duration: 4, // Slower animation
        delay: i * 0.8, // More spread out delays
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    })
  };

  // Animation for the plate/center - optimized for performance
  const plateVariants = {
    animate: {
      scale: [1, 1.03, 1], // Reduced scale change
      transition: {
        duration: 3, // Slower animation
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Animation for the text - optimized for performance
  const textVariants = {
    animate: {
      opacity: [0.7, 1, 0.7], // Less opacity change
      transition: {
        duration: 2.5, // Slower animation
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const renderContent = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Orbiting container */}
        <motion.div
          className={`relative ${selectedSize.container}`}
          variants={containerVariants}
          animate="animate"
        >
          {/* Food icons orbiting */}
          {foodIcons.map((Icon, index) => {
            const angle = (index / foodIcons.length) * Math.PI * 2;
            const radius = size === 'small' ? 30 : size === 'medium' ? 45 : 60;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={index}
                className={`absolute ${selectedSize.icon} transform -translate-x-1/2 -translate-y-1/2`}
                style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                custom={index}
                variants={iconVariants}
                animate="animate"
              >
                <Icon className={`text-orange-${(index % 5) * 100 + 300}`} />
              </motion.div>
            );
          })}

          {/* Center plate */}
          <motion.div
            className={`absolute inset-0 flex items-center justify-center`}
            variants={plateVariants}
            animate="animate"
          >
            <div className={`w-1/2 h-1/2 bg-white rounded-full border-4 border-orange-400 shadow-lg flex items-center justify-center`}>
              <span className="text-orange-500 font-bold">
                {size === 'small' ? '🍽️' : size === 'medium' ? '🍽️' : '🍽️'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Loading text */}
      {text && (
        <motion.p
          className={`${selectedSize.text} text-orange-600 font-medium`}
          variants={textVariants}
          animate="animate"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  // If fullScreen, render with a backdrop
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {renderContent()}
      </div>
    );
  }

  // Otherwise, render inline
  return renderContent();
}
