import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaClock, FaUtensils, FaStar } from 'react-icons/fa';

interface RecipeCardProps {
  recipe: {
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
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/recipes/${recipe.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={recipe.mainImage || '/recipe-placeholder.svg'}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <FaClock className="mr-1" />
              <span>{recipe.cookingTime || 0} min</span>
            </div>
            <div className="flex items-center">
              <FaUtensils className="mr-1" />
              <span>{recipe.difficulty || 'Easy'}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="mr-1 text-yellow-400" />
              <span>{recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'}</span>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={(recipe.author && recipe.author.image) ? recipe.author.image : '/images/default-avatar.png'}
                alt={(recipe.author && recipe.author.name) ? recipe.author.name : 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {(recipe.author && recipe.author.name) ? recipe.author.name : 'Author'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
