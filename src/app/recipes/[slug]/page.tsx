'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { FaClock, FaUtensils, FaStar, FaUser, FaPrint, FaShare, FaBookmark, FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../../../components/ui/Button';
import LoadingIndicator from '../../../components/ui/LoadingIndicator';
import { useLoading } from '../../../context/LoadingContext';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  instructions: {
    step: number;
    description: string;
  }[];
  cookingTime: number;
  servings: number;
  difficulty: string;
  mainImage: string;
  images: string[];
  author: {
    _id: string;
    name: string;
    image?: string;
  };
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
  ratings: {
    user: {
      _id: string;
      name: string;
      image?: string;
    };
    rating: number;
    comment: string;
    date: string;
  }[];
  averageRating: number;
  slug: string;
  createdAt: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReviewId, setUserReviewId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savingToFavorites, setSavingToFavorites] = useState(false);

  // Get the slug from params safely
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';

  // Check if recipe is in user's favorites
  const checkFavoriteStatus = async (recipeId: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/user/favorites/check?recipeId=${recipeId}`);

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!recipe) return;

    try {
      setSavingToFavorites(true);
      startLoading(); // Start global loading animation

      console.log('Saving recipe to favorites:', recipe._id);

      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe._id,
        }),
      });

      const data = await response.json();
      console.log('Response from favorites API:', data);

      if (response.ok) {
        setIsFavorite(data.isFavorite);

        // Show a toast or notification
        if (data.isFavorite) {
          alert('Recipe saved to your favorites!');
        } else {
          alert('Recipe removed from your favorites.');
        }
      } else {
        alert('Error saving recipe: ' + data.message);
      }
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      alert('Error saving recipe. Please try again.');
    } finally {
      setSavingToFavorites(false);
      stopLoading(); // Stop global loading animation
    }
  };

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        startLoading(); // Start global loading animation

        const response = await fetch(`/api/recipes/${slug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }

        const data = await response.json();
        setRecipe(data);

        // Check if the recipe is in user's favorites
        if (session && data._id) {
          await checkFavoriteStatus(data._id);
        }

        // Check if the user has already reviewed this recipe
        if (session && session.user && data.ratings) {
          const userReview = data.ratings.findIndex((rating: any) =>
            rating.user && session.user && session.user.id &&
            rating.user === session.user.id
          );

          if (userReview !== -1) {
            setUserHasReviewed(true);
            setUserReviewId(userReview);
            // Pre-fill the form with existing review data for editing
            setUserRating(data.ratings[userReview].rating);
            setComment(data.ratings[userReview].comment || '');
            setEditingReview(false); // Initially not in editing mode
          } else {
            setUserHasReviewed(false);
            setUserReviewId(null);
            setUserRating(0);
            setComment('');
          }
        }
      } catch (err) {
        setError('Error loading recipe. Please try again later.');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
        stopLoading(); // Stop global loading animation
      }
    };

    if (slug) {
      fetchRecipe();
    }
  }, [slug, startLoading, stopLoading, session]);

  // Submit rating
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (userRating === 0) {
      return;
    }

    try {
      setSubmittingRating(true);
      startLoading(); // Start global loading animation

      const response = await fetch(`/api/recipes/${encodeURIComponent(slug)}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: userRating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      // Refresh recipe data
      const recipeResponse = await fetch(`/api/recipes/${encodeURIComponent(slug)}`);
      const updatedRecipe = await recipeResponse.json();
      setRecipe(updatedRecipe);

      // Update user review state
      if (!userHasReviewed) {
        // Find the user's review in the updated recipe
        const userReviewIndex = updatedRecipe.ratings.findIndex(
          (r: any) => r.user && session.user && session.user.id &&
          r.user === session.user.id
        );

        if (userReviewIndex !== -1) {
          setUserHasReviewed(true);
          setUserReviewId(userReviewIndex);
          setEditingReview(false);
        }
      } else {
        // Just exit edit mode if already reviewed
        setEditingReview(false);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setSubmittingRating(false);
      stopLoading(); // Stop global loading animation
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async () => {
    if (!session || !recipe || recipe.author._id !== session.user.id) {
      return;
    }

    try {
      startLoading(); // Start global loading animation

      const response = await fetch(`/api/recipes/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      router.push('/recipes');
    } catch (err) {
      console.error('Error deleting recipe:', err);
    } finally {
      stopLoading(); // Stop global loading animation
    }
  };

  // Start editing review
  const handleEditReview = () => {
    if (!session || userReviewId === null || !recipe) return;

    setEditingReview(true);

    // Pre-fill form with existing review data
    const userReview = recipe.ratings[userReviewId];
    if (userReview) {
      setUserRating(userReview.rating || 0);
      setComment(userReview.comment || '');
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!session || userReviewId === null) return;

    try {
      startLoading();

      const response = await fetch(`/api/recipes/${encodeURIComponent(slug)}/rate`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Refresh recipe data
      const recipeResponse = await fetch(`/api/recipes/${encodeURIComponent(slug)}`);
      const updatedRecipe = await recipeResponse.json();
      setRecipe(updatedRecipe);

      // Reset states
      setUserHasReviewed(false);
      setUserReviewId(null);
      setUserRating(0);
      setComment('');
      setEditingReview(false);

    } catch (err) {
      console.error('Error deleting review:', err);
    } finally {
      stopLoading();
    }
  };

  // Cancel editing review
  const handleCancelEdit = () => {
    setEditingReview(false);

    // Reset form to original review data if user has reviewed
    if (userHasReviewed && userReviewId !== null && recipe) {
      const userReview = recipe.ratings[userReviewId];
      if (userReview) {
        setUserRating(userReview.rating || 0);
        setComment(userReview.comment || '');
      }
    } else {
      setUserRating(0);
      setComment('');
    }
  };

  // Mock recipe data for initial display
  const mockRecipe: Recipe = {
    _id: '1',
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper. This creamy pasta dish is quick and easy to make, perfect for a weeknight dinner.',
    ingredients: [
      { name: 'Spaghetti', quantity: '400', unit: 'g' },
      { name: 'Pancetta', quantity: '150', unit: 'g' },
      { name: 'Egg yolks', quantity: '6', unit: '' },
      { name: 'Parmesan cheese', quantity: '50', unit: 'g' },
      { name: 'Black pepper', quantity: '1', unit: 'tsp' },
      { name: 'Salt', quantity: '', unit: 'to taste' },
    ],
    instructions: [
      { step: 1, description: 'Bring a large pot of salted water to boil and cook the spaghetti according to package instructions.' },
      { step: 2, description: 'While the pasta is cooking, cut the pancetta into small cubes and fry in a pan until crispy.' },
      { step: 3, description: 'In a bowl, whisk together the egg yolks, grated Parmesan cheese, and plenty of black pepper.' },
      { step: 4, description: 'When the pasta is cooked, drain it, reserving a cup of the pasta water.' },
      { step: 5, description: 'Add the hot pasta to the pan with the pancetta and toss well.' },
      { step: 6, description: 'Remove the pan from the heat and quickly stir in the egg mixture, adding a splash of pasta water to create a creamy sauce.' },
      { step: 7, description: 'Serve immediately with extra Parmesan cheese and black pepper.' },
    ],
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    mainImage: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    images: [],
    author: {
      _id: '101',
      name: 'Chef Mario',
      image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    categories: [
      { _id: '1', name: 'Italian', slug: 'italian' },
      { _id: '2', name: 'Pasta', slug: 'pasta' },
    ],
    ratings: [
      {
        user: {
          _id: '201',
          name: 'John Doe',
          image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        },
        rating: 5,
        comment: 'Absolutely delicious! The creaminess of the sauce was perfect.',
        date: '2023-04-15T12:00:00Z',
      },
      {
        user: {
          _id: '202',
          name: 'Jane Smith',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        },
        rating: 4,
        comment: 'Great recipe, but I added a bit more cheese than suggested.',
        date: '2023-04-10T15:30:00Z',
      },
    ],
    averageRating: 4.5,
    slug: 'spaghetti-carbonara',
    createdAt: '2023-03-01T10:00:00Z',
  };

  // Use mock data if no recipe is loaded yet
  const displayRecipe = recipe || mockRecipe;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingIndicator size="large" text="Preparing your delicious recipe..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error}</p>
          <Link href="/recipes" className="text-orange-500 hover:underline mt-2 inline-block">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Recipe Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayRecipe.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{displayRecipe.cookingTime} min</span>
          </div>
          <div className="flex items-center">
            <FaUtensils className="mr-1" />
            <span>{displayRecipe.difficulty}</span>
          </div>
          <div className="flex items-center">
            <FaStar className="mr-1 text-yellow-400" />
            <span>{displayRecipe.averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span>Serves {displayRecipe.servings}</span>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={displayRecipe.author.image || '/images/default-avatar.png'}
              alt={displayRecipe.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Recipe by</p>
            <p className="font-medium">{displayRecipe.author.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {displayRecipe.categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recipe Image and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] rounded-xl overflow-hidden"
          >
            <Image
              src={displayRecipe.mainImage}
              alt={displayRecipe.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 mb-6">{displayRecipe.description}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleToggleFavorite}
                disabled={savingToFavorites}
                className={`flex items-center justify-center gap-2 w-full py-2 ${
                  isFavorite
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white rounded-md transition-colors`}
              >
                {savingToFavorites ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaBookmark />
                    <span>{isFavorite ? 'Saved to Profile' : 'Save Recipe'}</span>
                  </>
                )}
              </button>

              {session && session.user.id === displayRecipe.author._id && (
                <>
                  <Link href={`/recipes/${displayRecipe.slug}/edit`}>
                    <button className="flex items-center justify-center gap-2 w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                      <FaEdit />
                      <span>Edit Recipe</span>
                    </button>
                  </Link>

                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      <FaTrash />
                      <span>Delete Recipe</span>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteRecipe}
                        className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {displayRecipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <div className="h-5 w-5 rounded-full border border-orange-500 flex-shrink-0 mt-0.5"></div>
                <span className="ml-3 text-gray-700">
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="space-y-6">
            {displayRecipe.instructions.map((instruction) => (
              <li key={instruction.step} className="flex">
                <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  {instruction.step}
                </div>
                <p className="ml-4 text-gray-700">{instruction.description}</p>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/* Ratings and Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-12"
      >
        <h2 className="text-xl font-bold mb-6">Ratings & Reviews</h2>

        {/* Add/Edit Rating Form */}
        <div className="mb-8 border-b pb-8">
          {session ? (
            userHasReviewed ? (
              // User has already reviewed - show their review with edit/delete options
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Your Review</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditReview}
                      className="flex items-center gap-1 text-orange-500 hover:text-orange-600"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={handleDeleteReview}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>

                {editingReview ? (
                  // Edit form
                  <form onSubmit={handleRatingSubmit}>
                    <div className="mb-4">
                      <p className="mb-2">Your Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="text-2xl"
                          >
                            <FaStar
                              className={star <= userRating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="comment" className="block mb-2">
                        Your Comment
                      </label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={4}
                      ></textarea>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={submittingRating || userRating === 0}
                      >
                        {submittingRating ? 'Submitting...' : 'Update Review'}
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Display review
                  <div className="bg-orange-50 p-4 rounded-md">
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= userRating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{comment || 'No comment provided'}</p>
                  </div>
                )}
              </div>
            ) : (
              // User has not reviewed yet - show the form
              <div>
                <h3 className="text-lg font-medium mb-4">Add Your Review</h3>
                <form onSubmit={handleRatingSubmit}>
                  <div className="mb-4">
                    <p className="mb-2">Your Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="text-2xl"
                        >
                          <FaStar
                            className={star <= userRating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="comment" className="block mb-2">
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submittingRating || userRating === 0}
                  >
                    {submittingRating ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            )
          ) : (
            // User is not signed in
            <div>
              <h3 className="text-lg font-medium mb-4">Add Your Review</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">Please sign in to leave a review.</p>
                <Link href="/auth/signin">
                  <Button variant="primary">Sign In</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {displayRecipe.ratings.length} {displayRecipe.ratings.length === 1 ? 'Review' : 'Reviews'}
          </h3>

          {displayRecipe.ratings.length > 0 ? (
            <div className="space-y-6">
              {displayRecipe.ratings.map((rating, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={rating.userImage || '/images/default-avatar.png'}
                        alt={rating.userName || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {rating.userName
                          ? (session && rating.user === session.user.id
                              ? `${rating.userName} (You)`
                              : rating.userName)
                          : 'User'}
                      </p>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {rating.date ? new Date(rating.date).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{rating.comment || 'No comment provided'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this recipe!</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
