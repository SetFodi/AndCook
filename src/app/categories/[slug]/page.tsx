'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import RecipeCard from '../../../components/recipes/RecipeCard';

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
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slug = params.slug as string;

  // Fetch category and its recipes
  useEffect(() => {
    const fetchCategoryAndRecipes = async () => {
      try {
        setLoading(true);
        
        // Fetch category
        const categoryResponse = await fetch(`/api/categories/${slug}`);
        
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category');
        }
        
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
        
        // Fetch recipes in this category
        const recipesResponse = await fetch(`/api/recipes?category=${categoryData._id}`);
        
        if (!recipesResponse.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        const recipesData = await recipesResponse.json();
        setRecipes(recipesData.recipes || []);
      } catch (err) {
        setError('Error loading category. Please try again later.');
        console.error('Error fetching category and recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndRecipes();
    }
  }, [slug]);

  // Mock data for initial display
  const mockCategory: Category = {
    _id: '1',
    name: 'Italian',
    description: 'Classic Italian dishes from pasta to pizza and everything in between. Italian cuisine is known for its simplicity, with many dishes having only a few ingredients but relying on the quality of the ingredients rather than elaborate preparation.',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    slug: 'italian',
  };

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
    },
    {
      _id: '2',
      title: 'Margherita Pizza',
      description: 'Simple yet delicious pizza with tomato sauce, mozzarella, and fresh basil.',
      mainImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
      slug: 'margherita-pizza',
      cookingTime: 45,
      difficulty: 'Medium',
      averageRating: 4.6,
      author: {
        name: 'Chef Luigi',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      },
    },
    {
      _id: '3',
      title: 'Risotto ai Funghi',
      description: 'Creamy mushroom risotto made with Arborio rice and Parmesan cheese.',
      mainImage: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      slug: 'risotto-ai-funghi',
      cookingTime: 40,
      difficulty: 'Hard',
      averageRating: 4.5,
      author: {
        name: 'Chef Sofia',
        image: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=744&q=80',
      },
    },
  ];

  // Use mock data if no data is loaded yet
  const displayCategory = category || mockCategory;
  const displayRecipes = recipes.length > 0 ? recipes : mockRecipes;

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
          <Link href="/categories" className="text-orange-500 hover:underline mt-2 inline-block">
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={displayCategory.image}
          alt={displayCategory.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {displayCategory.name} Recipes
            </h1>
            <p className="text-white/90 max-w-2xl">
              {displayCategory.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {displayRecipes.length} {displayRecipes.length === 1 ? 'Recipe' : 'Recipes'} in {displayCategory.name}
        </h2>
        
        {displayRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <p className="text-gray-600 mb-4">No recipes found in this category.</p>
            <Link href="/recipes/new">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                Add the first recipe
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Back to Categories */}
      <div className="text-center">
        <Link href="/categories" className="text-orange-500 hover:underline">
          Back to all categories
        </Link>
      </div>
    </div>
  );
}
