import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaClock, FaUtensils, FaStar, FaEdit, FaTrash } from 'react-icons/fa';

interface RecipeCardProps {
  recipe: {
    _id?: string;
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
      _id?: string;
    };
  };
  showManageButtons?: boolean;
  onEdit?: (recipeId: string) => void;
  onDelete?: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  showManageButtons = false,
  onEdit,
  onDelete
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit && recipe._id) {
      onEdit(recipe._id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && recipe._id) {
      if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
        onDelete(recipe._id);
      }
    }
  };
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Link href={`/recipes/${recipe.slug}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={recipe.mainImage || '/recipe-placeholder.svg'}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {showManageButtons && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleEdit}
              className="bg-white dark:!bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors"
              aria-label="Edit recipe"
            >
              <FaEdit className="text-orange-500" size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white dark:!bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors"
              aria-label="Delete recipe"
            >
              <FaTrash className="text-red-500" size={16} />
            </button>
          </div>
        )}
        <Link href={`/recipes/${recipe.slug}`} className="block">
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 dark:!text-white mb-2 line-clamp-1">
              {recipe.title}
            </h3>
            <p className="text-gray-600 dark:!text-gray-300 text-sm mb-3 line-clamp-2">
              {recipe.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:!text-gray-400 mb-3">
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
              <span className="ml-2 text-sm text-gray-600 dark:!text-gray-400">
                {(recipe.author && recipe.author.name) ? recipe.author.name : 'Author'}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
