// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { GiCook, GiCupcake, GiHotMeal, GiCoffeeCup } from 'react-icons/gi';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recipes?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const scrolledBg = isScrolled
    ? theme === 'dark'
      ? 'bg-gray-900/95'
      : 'bg-white/95'
    : 'bg-transparent';
  const scrolledExtras = isScrolled ? 'backdrop-blur-sm shadow-md py-2' : 'py-4';

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolledBg} ${scrolledExtras}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold text-primary">
                AndCook
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Home */}
            <motion.div
              whileHover="hover"
              initial="initial"
              animate="initial"
              className="font-medium relative"
            >
              <Link href="/" className="group">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="text-gray-700 dark:text-black
                      group-hover:text-primary dark:group-hover:text-primary-light"
                    variants={{
                      initial: { y: 0, rotate: 0 },
                      hover: {
                        y: [0, -5, 0],
                        rotate: [0, -5, 5, 0],
                        transition: {
                          duration: 0.5,
                          ease: 'easeInOut',
                          times: [0, 0.2, 0.8, 1],
                        },
                      },
                    }}
                  >
                    <GiCoffeeCup size={20} />
                  </motion.div>
                  <span className="text-gray-800 dark:text-black
                    group-hover:text-primary dark:group-hover:text-primary-light
                    transition-colors duration-200"
                  >
                    Home
                  </span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5
                  bg-primary dark:bg-primary-light
                  group-hover:w-full transition-all duration-300"
                />
              </Link>
            </motion.div>

            {/* Recipes */}
            <motion.div
              whileHover="hover"
              initial="initial"
              animate="initial"
              className="font-medium relative"
            >
              <Link href="/recipes" className="group">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="text-gray-700 dark:text-black
                      group-hover:text-primary dark:group-hover:text-primary-light"
                    variants={{
                      initial: { scale: 1 },
                      hover: {
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        transition: { duration: 0.5, ease: 'easeInOut' },
                      },
                    }}
                  >
                    <GiHotMeal size={20} />
                  </motion.div>
                  <span className="text-gray-800 dark:text-black
                    group-hover:text-primary dark:group-hover:text-primary-light
                    transition-colors duration-200"
                  >
                    Recipes
                  </span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5
                  bg-primary dark:bg-primary-light
                  group-hover:w-full transition-all duration-300"
                />
              </Link>
            </motion.div>

            {/* Categories */}
            <motion.div
              whileHover="hover"
              initial="initial"
              animate="initial"
              className="font-medium relative"
            >
              <Link href="/categories" className="group">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="text-gray-700 dark:text-black
                      group-hover:text-primary dark:group-hover:text-primary-light"
                    variants={{
                      initial: { rotate: 0 },
                      hover: {
                        rotate: [0, 15, -15, 10, -10, 0],
                        transition: { duration: 0.6, ease: 'easeInOut' },
                      },
                    }}
                  >
                    <GiCupcake size={20} />
                  </motion.div>
                  <span className="text-gray-800 dark:text-black
                    group-hover:text-primary dark:group-hover:text-primary-light
                    transition-colors duration-200"
                  >
                    Categories
                  </span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5
                  bg-primary dark:bg-primary-light
                  group-hover:w-full transition-all duration-300"
                />
              </Link>
            </motion.div>

            {/* Contact */}
            <motion.div
              whileHover="hover"
              initial="initial"
              animate="initial"
              className="font-medium relative"
            >
              <Link href="/contact" className="group">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="text-gray-700 dark:text-black
                      group-hover:text-primary dark:group-hover:text-primary-light"
                    variants={{
                      initial: { y: 0, x: 0 },
                      hover: {
                        y: [0, -3, 3, -2, 0],
                        x: [0, 2, -2, 1, 0],
                        transition: { duration: 0.5, ease: 'easeInOut' },
                      },
                    }}
                  >
                    <GiCook size={20} />
                  </motion.div>
                  <span className="text-gray-800 dark:text-black
                    group-hover:text-primary dark:group-hover:text-primary-light
                    transition-colors duration-200"
                  >
                    Contact
                  </span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5
                  bg-primary dark:bg-primary-light
                  group-hover:w-full transition-all duration-300"
                />
              </Link>
            </motion.div>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center relative max-w-xs w-full mx-4"
          >
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-500 hover:text-primary transition-colors duration-200 transform hover:scale-110"
            >
              <FaSearch />
            </button>
          </form>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-primary">
                    <Image
                      src={session.user.image || '/images/default-avatar.png'}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-700">
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/recipes/new"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Add Recipe
                    </Link>
                    {(session.user.role === 'admin' ||
                      session.user.email ===
                        'lukafartenadze2004@gmail.com') && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-orange-600 dark:text-orange-400 font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-1 text-black dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 border border-transparent hover:border-primary/30 hover:text-primary dark:hover:text-primary-light"
              >
                <FaUser className="mr-2 transform group-hover:scale-110 transition-transform duration-300 text-orange-500" />
                <span className='text-orange-500'>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-black focus:outline-none transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>

              <div className="flex justify-between items-center mb-6">
                <ThemeToggle />
              </div>

              <nav className="flex flex-col space-y-4">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center group py-2 font-medium relative text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                    className="mr-3 text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light"
                  >
                    <GiCoffeeCup size={20} />
                  </motion.div>
                  <motion.span className="transform group-hover:translate-x-2 transition-transform duration-300">
                    Home
                  </motion.span>
                  <span className="absolute left-0 bottom-0 h-0.5 bg-primary dark:bg-primary-light w-0 group-hover:w-1/4 transition-all duration-300" />
                </Link>

                {/* Recipes */}
                <Link
                  href="/recipes"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center group py-2 font-medium relative text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: [1, 1.2, 0.9, 1.1, 1], transition: { duration: 0.5 } }}
                    className="mr-3 text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light"
                  >
                    <GiHotMeal size={20} />
                  </motion.div>
                  <motion.span className="transform group-hover:translate-x-2 transition-transform duration-300">
                    Recipes
                  </motion.span>
                  <span className="absolute left-0 bottom-0 h-0.5 bg-primary dark:bg-primary-light w-0 group-hover:w-1/4 transition-all duration-300" />
                </Link>

                {/* Categories */}
                <Link
                  href="/categories"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center group py-2 font-medium relative text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                >
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 0 }}
                    whileHover={{ y: [0, -5, 0], transition: { duration: 0.4, repeat: 1, repeatType: 'reverse' } }}
                    className="mr-3 text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light"
                  >
                    <GiCupcake size={20} />
                  </motion.div>
                  <motion.span className="transform group-hover:translate-x-2 transition-transform duration-300">
                    Categories
                  </motion.span>
                  <span className="absolute left-0 bottom-0 h-0.5 bg-primary dark:bg-primary-light w-0 group-hover:w-1/4 transition-all duration-300" />
                </Link>

                {/* Contact */}
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center group py-2 font-medium relative text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: [0, 20, -20, 10, 0], transition: { duration: 0.5 } }}
                    className="mr-3 text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light"
                  >
                    <GiCook size={20} />
                  </motion.div>
                  <motion.span className="transform group-hover:translate-x-2 transition-transform duration-300">
                    Contact
                  </motion.span>
                  <span className="absolute left-0 bottom-0 h-0.5 bg-primary dark:bg-primary-light w-0 group-hover:w-1/4 transition-all duration-300" />
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-4">
                  {session ? (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary">
                          <Image
                            src={session.user.image || '/images/default-avatar.png'}
                            alt={session.user.name || 'User'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {session.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/recipes/new"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                      >
                        Add Recipe
                      </Link>
                      {(session.user.email === 'lukafartenadze2004@gmail.com' ||
                        session.user.role === 'admin') && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2 text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left py-2 text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-primary text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-primary-dark transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
