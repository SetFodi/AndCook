'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import RecipeCard from '../../components/recipes/RecipeCard';
import Button from '../../components/ui/Button';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import { useLoading } from '../../context/LoadingContext';
import { fetchJsonWithRetry } from '../../lib/utils/api-utils';

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
  totalPages?: number;
  totalRecipes?: number;
}

function RecipesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const { startLoading, stopLoading, isSessionLoading } = useLoading();

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch recipes with retry mechanism
  const fetchRecipes = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      startLoading(); // Start global loading animation

      // Get current state values to ensure we're using the latest values
      const currentSearchQuery = searchQuery;
      const currentCategories = selectedCategories;

      // Build the base URL
      let url = `/api/recipes?page=${page}&limit=${pagination.limit}`;

      if (currentSearchQuery) {
        url += `&search=${encodeURIComponent(currentSearchQuery)}`;
      }

      if (currentCategories.length > 0) {
        console.log('Applying category filters:', currentCategories);
        currentCategories.forEach(category => {
          url += `&categories=${encodeURIComponent(category)}`;
        });
      } else {
        console.log('No category filters applied');
      }

      console.log('Fetching recipes from:', url);

      // Use our utility function to fetch with retry logic
      const data = await fetchJsonWithRetry<{
        recipes: Recipe[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      }>(url, {}, 3, 15000); // 3 retries, 15 second timeout

      console.log('Recipes fetched successfully:', data.recipes?.length || 0);

      // Only update state if we have valid data
      if (Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
        setPagination(data.pagination || {
          total: 0,
          page: 1,
          limit: 12,
          pages: 0,
        });
      } else {
        console.warn('Received invalid recipes data:', data);
        throw new Error('Invalid recipe data format');
      }
    } catch (err) {
      console.error('Error fetching recipes after all retries:', err);
      setError('Error loading recipes. Please try again later.');
    } finally {
      setLoading(false);
      stopLoading(); // Stop global loading animation
    }
  }, [searchQuery, selectedCategories, pagination.limit, startLoading, stopLoading]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      startLoading(); // Start global loading animation

      // Use our utility function to fetch with retry logic
      const data = await fetchJsonWithRetry<{ categories: Category[] }>(
        '/api/categories',
        {},
        3,
        10000
      );

      console.log('Categories fetched successfully:', data.categories?.length || 0);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      stopLoading(); // Stop global loading animation
    }
  }, [startLoading, stopLoading]);

  // Initial data fetch
  useEffect(() => {
    // Fetch categories
    fetchCategories();

    // Use a delay to ensure the session is fully loaded
    const initialLoadDelay = isSessionLoading ? 2000 : 500;

    console.log(`Setting up initial data fetch with ${initialLoadDelay}ms delay...`);

    const timer = setTimeout(() => {
      console.log('Executing initial data fetch...');
      // Use our improved fetchRecipes function for the initial load
      fetchRecipes(1);
    }, initialLoadDelay);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log('Category selected/deselected:', categoryId);

    setSelectedCategories(prev => {
      // If category is already selected, remove it
      if (prev.includes(categoryId)) {
        console.log('Removing category from selection:', categoryId);
        const newSelection = prev.filter(id => id !== categoryId);
        console.log('New selection after removal:', newSelection);
        return newSelection;
      }
      // Otherwise add it to the selection
      else {
        console.log('Adding category to selection:', categoryId);
        const newSelection = [...prev, categoryId];
        console.log('New selection after addition:', newSelection);
        return newSelection;
      }
    });

    // Don't fetch immediately to allow multiple selections before applying
  };

  const handlePageChange = (page: number) => {
    fetchRecipes(page);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);

    // Wait for state updates to complete
    setTimeout(() => {
      fetchRecipes(1);
    }, 0);
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
    {
      _id: '4',
      title: 'Khachapuri',
      description: 'Traditional Georgian cheese-filled bread with a runny egg on top.',
      mainImage: 'https://images.unsplash.com/photo-1584278858647-52115c9df4ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'khachapuri',
      cookingTime: 60,
      difficulty: 'Medium',
      averageRating: 4.9,
      author: {
        name: 'Chef Nino',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      },
      categories: [
        { _id: '9', name: 'Georgian', slug: 'georgian' },
        { _id: '6', name: 'Vegetarian', slug: 'vegetarian' },
      ],
    },
    {
      _id: '5',
      title: 'Khinkali',
      description: 'Georgian soup dumplings filled with spiced meat and aromatic herbs.',
      mainImage: 'https://images.unsplash.com/photo-1610197361600-33a3a5073cad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'khinkali',
      cookingTime: 90,
      difficulty: 'Hard',
      averageRating: 4.7,
      author: {
        name: 'Chef Nino',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      },
      categories: [
        { _id: '9', name: 'Georgian', slug: 'georgian' },
        { _id: '13', name: 'Beef', slug: 'beef' },
      ],
    },
    {
      _id: '6',
      title: 'Pad Thai',
      description: 'Classic Thai stir-fried noodles with eggs, tofu, bean sprouts, and peanuts.',
      mainImage: 'https://images.unsplash.com/photo-1637806931079-93f363be53a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'pad-thai',
      cookingTime: 25,
      difficulty: 'Medium',
      averageRating: 4.6,
      author: {
        name: 'Chef Suki',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=677&q=80',
      },
      categories: [
        { _id: '11', name: 'Asian', slug: 'asian' },
        { _id: '6', name: 'Vegetarian', slug: 'vegetarian' },
      ],
    },
    {
      _id: '7',
      title: 'Beef Tacos',
      description: 'Authentic Mexican tacos with seasoned ground beef, fresh salsa, and guacamole.',
      mainImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'beef-tacos',
      cookingTime: 35,
      difficulty: 'Easy',
      averageRating: 4.5,
      author: {
        name: 'Chef Carlos',
        image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
      categories: [
        { _id: '10', name: 'Mexican', slug: 'mexican' },
        { _id: '13', name: 'Beef', slug: 'beef' },
      ],
    },
    {
      _id: '8',
      title: 'Greek Salad',
      description: 'Fresh Mediterranean salad with tomatoes, cucumbers, olives, and feta cheese.',
      mainImage: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1090&q=80',
      slug: 'greek-salad',
      cookingTime: 15,
      difficulty: 'Easy',
      averageRating: 4.3,
      author: {
        name: 'Chef Eleni',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      },
      categories: [
        { _id: '12', name: 'Mediterranean', slug: 'mediterranean' },
        { _id: '15', name: 'Salad', slug: 'salad' },
        { _id: '6', name: 'Vegetarian', slug: 'vegetarian' },
      ],
    },
    {
      _id: '9',
      title: 'Lobio',
      description: 'Georgian spiced kidney bean stew with traditional herbs and spices.',
      mainImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      slug: 'lobio',
      cookingTime: 60,
      difficulty: 'Medium',
      averageRating: 4.6,
      author: {
        name: 'Chef Nino',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      },
      categories: [
        { _id: '9', name: 'Georgian', slug: 'georgian' },
        { _id: '6', name: 'Vegetarian', slug: 'vegetarian' },
        { _id: '14', name: 'Soup', slug: 'soup' },
      ],
    },
    {
      _id: '10',
      title: 'Chicken Pho',
      description: 'Vietnamese noodle soup with chicken, herbs, and aromatic broth.',
      mainImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      slug: 'chicken-pho',
      cookingTime: 120,
      difficulty: 'Medium',
      averageRating: 4.8,
      author: {
        name: 'Chef Minh',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=677&q=80',
      },
      categories: [
        { _id: '11', name: 'Asian', slug: 'asian' },
        { _id: '4', name: 'Chicken', slug: 'chicken' },
        { _id: '14', name: 'Soup', slug: 'soup' },
      ],
    },
    {
      _id: '11',
      title: 'Tiramisu',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      mainImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
      slug: 'tiramisu',
      cookingTime: 240,
      difficulty: 'Medium',
      averageRating: 4.9,
      author: {
        name: 'Chef Mario',
        image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
      categories: [
        { _id: '1', name: 'Italian', slug: 'italian' },
        { _id: '7', name: 'Dessert', slug: 'dessert' },
      ],
    },
    {
      _id: '12',
      title: 'Chakhokhbili',
      description: 'Georgian chicken stew with fresh herbs, tomatoes, and traditional spices.',
      mainImage: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
      slug: 'chakhokhbili',
      cookingTime: 75,
      difficulty: 'Medium',
      averageRating: 4.7,
      author: {
        name: 'Chef Nino',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      },
      categories: [
        { _id: '9', name: 'Georgian', slug: 'georgian' },
        { _id: '4', name: 'Chicken', slug: 'chicken' },
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
    { _id: '9', name: 'Georgian', slug: 'georgian' },
    { _id: '10', name: 'Mexican', slug: 'mexican' },
    { _id: '11', name: 'Asian', slug: 'asian' },
    { _id: '12', name: 'Mediterranean', slug: 'mediterranean' },
    { _id: '13', name: 'Beef', slug: 'beef' },
    { _id: '14', name: 'Soup', slug: 'soup' },
    { _id: '15', name: 'Salad', slug: 'salad' },
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
                    checked={selectedCategories.includes(category._id)}
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

          {/* Apply Filters Button */}
          <button
            onClick={() => {
              console.log('Apply Filters clicked with categories:', selectedCategories);
              fetchRecipes(1);
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md mb-4 flex items-center justify-center"
          >
            <FaFilter className="mr-2" />
            Apply Filters
          </button>

          {/* Clear Filters Button */}
          {(searchQuery || selectedCategories.length > 0) && (
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
                  className="w-full px-4 py-2 pl-10 border border-gray-300 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button type="submit" variant="primary">
                Search
              </Button>
            </form>
          </div>

          {/* Recipes Grid */}
          {loading || isSessionLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingIndicator
                size="medium"
                text={isSessionLoading ? "Loading your session..." : "Finding delicious recipes..."}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRecipes.length > 0 ? (
                displayRecipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-gray-600">No recipes found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-orange-500 hover:text-orange-600"
                  >
                    Clear filters and show all recipes
                  </button>
                </div>
              )}
            </div>
          )}

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

// Main export function with Suspense boundary
export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
      <LoadingIndicator size="large" text="Loading recipes..." />
    </div>}>
      <RecipesContent />
    </Suspense>
  );
}
