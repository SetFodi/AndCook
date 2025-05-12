'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Error loading categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Mock categories for initial display
  const mockCategories: Category[] = [
    {
      _id: '1',
      name: 'Italian',
      description: 'Classic Italian dishes from pasta to pizza and everything in between.',
      image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'italian',
    },
    {
      _id: '2',
      name: 'Asian',
      description: 'Explore the diverse flavors of Asian cuisine from China, Japan, Thailand, and more.',
      image: 'https://images.unsplash.com/photo-1541696490-8744a5dc0228?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'asian',
    },
    {
      _id: '3',
      name: 'Vegetarian',
      description: 'Delicious meat-free recipes that are full of flavor and nutrition.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'vegetarian',
    },
    {
      _id: '4',
      name: 'Desserts',
      description: 'Sweet treats from cakes and cookies to ice cream and pastries.',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      slug: 'desserts',
    },
    {
      _id: '5',
      name: 'Breakfast',
      description: 'Start your day right with these delicious breakfast recipes.',
      image: 'https://images.unsplash.com/photo-1533089860892-a9b969df67e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'breakfast',
    },
    {
      _id: '6',
      name: 'Quick & Easy',
      description: 'Delicious meals ready in 30 minutes or less for busy weeknights.',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80',
      slug: 'quick-easy',
    },
    {
      _id: '7',
      name: 'Seafood',
      description: 'Fresh and flavorful seafood recipes from around the world.',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'seafood',
    },
    {
      _id: '8',
      name: 'Baking',
      description: 'From bread to pastries, these baking recipes will satisfy your cravings.',
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'baking',
    },
  ];

  // Use mock data if no categories are loaded yet
  const displayCategories = categories.length > 0 ? categories : mockCategories;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Recipe Categories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our diverse collection of recipes organized by category. From quick weeknight dinners to elaborate desserts, find the perfect recipe for any occasion.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayCategories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/recipes?category=${category._id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                    {category.name}
                  </h2>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-600 mb-4 flex-1">{category.description}</p>
                  <div className="flex items-center text-orange-500 font-medium">
                    <span>Explore recipes</span>
                    <FaArrowRight className="ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
