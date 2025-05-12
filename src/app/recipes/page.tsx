'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import RecipeCard from '../../components/recipes/RecipeCard';
import Button from '../../components/ui/Button';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  mainImage: string;
  slug: string;
  cookingTime: number;
  difficulty: string;
  averageRating: number;
  author: {
    name: string;
    image?: string;
  };
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch recipes
  const fetchRecipes = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/api/recipes?page=${page}&limit=${pagination.limit}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
      setPagination(data.pagination || {
        total: 0,
        page: 1,
        limit: 12,
        pages: 0,
      });
    } catch (err) {
      setError('Error loading recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    fetchRecipes(1);
  };

  const handlePageChange = (page: number) => {
    fetchRecipes(page);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    fetchRecipes(1);
  };

  // Mock data for initial display
  const mockRecipes: Recipe[] = [
    {
      _id: '1',
      title: 'Spaghetti Carbonara',
      description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
      mainImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      slug: 'spaghetti-carbonara',
      cookingTime: 30,
      difficulty: 'Medium',
      averageRating: 4.8,
      author: {
        name: 'Chef Mario',
        image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
      categories: [
        { _id: '1', name: 'Italian', slug: 'italian' },
        { _id: '2', name: 'Pasta', slug: 'pasta' },
      ],
    },
    {
      _id: '2',
      title: 'Chicken Tikka Masala',
      description: 'Grilled chicken chunks in a creamy sauce with Indian spices.',
      mainImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1371&q=80',
      slug: 'chicken-tikka-masala',
      cookingTime: 45,
      difficulty: 'Medium',
      averageRating: 4.7,
      author: {
        name: 'Chef Priya',
        image: 'https://images.unsplash.com/photo-1587116987928-7c12a2d0f9e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
      categories: [
        { _id: '3', name: 'Indian', slug: 'indian' },
        { _id: '4', name: 'Chicken', slug: 'chicken' },
      ],
    },
    {
      _id: '3',
      title: 'Avocado Toast',
      description: 'Simple and delicious breakfast with mashed avocado on toasted bread.',
      mainImage: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      slug: 'avocado-toast',
      cookingTime: 10,
      difficulty: 'Easy',
      averageRating: 4.5,
      author: {
        name: 'Chef Emma',
        image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
      categories: [
        { _id: '5', name: 'Breakfast', slug: 'breakfast' },
        { _id: '6', name: 'Vegetarian', slug: 'vegetarian' },
      ],
    },
  ];

  // Use mock data if no recipes are loaded yet
  const displayRecipes = recipes.length > 0 ? recipes : mockRecipes;

  // Mock categories
  const mockCategories: Category[] = [
    { _id: '1', name: 'Italian', slug: 'italian' },
    { _id: '2', name: 'Pasta', slug: 'pasta' },
    { _id: '3', name: 'Indian', slug: 'indian' },
    { _id: '4', name: 'Chicken', slug: 'chicken' },
    { _id: '5', name: 'Breakfast', slug: 'breakfast' },
    { _id: '6', name: 'Vegetarian', slug: 'vegetarian' },
    { _id: '7', name: 'Dessert', slug: 'dessert' },
    { _id: '8', name: 'Seafood', slug: 'seafood' },
  ];

  // Use mock categories if no categories are loaded yet
  const displayCategories = categories.length > 0 ? categories : mockCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden w-full mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-md"
          >
            <span className="font-medium">Filters</span>
            {isFilterOpen ? <FaTimes /> : <FaFilter />}
          </button>
        </div>

        {/* Sidebar Filters */}
        <motion.div
          className={`w-full md:w-64 bg-white p-4 rounded-lg shadow-sm ${isFilterOpen ? 'block' : 'hidden'} md:block`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {displayCategories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category._id}`}
                    checked={selectedCategory === category._id}
                    onChange={() => handleCategoryChange(category._id)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category._id}`}
                    className="ml-2 text-gray-700 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {(searchQuery || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
            >
              <FaTimes className="mr-1" /> Clear all filters
            </button>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button type="submit" variant="primary">
                Search
              </Button>
            </form>
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      pagination.page === page
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
