'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPen, FaPlus, FaHeart } from 'react-icons/fa';
import RecipeCard from '../../components/recipes/RecipeCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

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

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  favorites: Recipe[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recipes');
  const [favoritesFilter, setFavoritesFilter] = useState('all');
  const [favoritesSort, setFavoritesSort] = useState('newest');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image: '',
  });
  const [saving, setSaving] = useState(false);
  const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log("User is not authenticated, redirecting to sign in");
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      console.log("User is authenticated:", session?.user);
    }
  }, [status, router, session]);

  // Fetch user profile and recipes
  useEffect(() => {
    const fetchUserData = async () => {
      if (status !== 'authenticated') {
        console.log("User not authenticated, skipping profile fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching profile data");

        // Fetch user profile and recipes from the new API endpoint
        const response = await fetch('/api/profile');

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Profile fetch error response:", errorData);
          throw new Error(`Failed to fetch profile data: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("Profile data fetched successfully:", data);

        // Set profile data
        setProfile(data.profile);
        setFormData({
          name: data.profile.name,
          bio: data.profile.bio || '',
          image: data.profile.image || '',
        });

        // Set recipes data
        setUserRecipes(data.recipes || []);
      } catch (err) {
        setError('Error loading profile. Please try again later.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only attempt to fetch data if we have a session and it's not loading
    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      // If user is not authenticated, stop loading
      setLoading(false);
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) return;

    try {
      setSaving(true);
      console.log("Submitting profile update");

      let imageUrl = formData.image;

      // If using file upload and we have a file, upload it first
      if (imageSourceType === 'upload' && imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile);

        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload,
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
          }

          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url; // Get the URL from the upload response
        } catch (uploadErr) {
          console.error('Error uploading image:', uploadErr);
          alert('Failed to upload image. Please try again or use a URL instead.');
          setSaving(false);
          return;
        }
      }

      // Now update the profile with the image URL (either from input or upload)
      const updatedFormData = {
        ...formData,
        image: imageUrl,
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile update error:", errorData);
        throw new Error(`Failed to update profile: ${errorData.message || response.statusText}`);
      }

      const updatedProfile = await response.json();
      console.log("Profile updated successfully:", updatedProfile);
      setProfile(updatedProfile);

      // Reset the image states
      setImageFile(null);
      setImagePreview('');
      setImageSourceType('url');

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Recipe management functions
  const handleEditRecipe = (recipeId: string) => {
    router.push(`/recipes/edit/${recipeId}`);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Update the recipes list by removing the deleted recipe
      setUserRecipes(userRecipes.filter((recipe: any) => recipe._id !== recipeId));

      // Show success message
      alert('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  // We're using real data from the API now

  // Function to filter and sort favorites
  const getFilteredAndSortedFavorites = () => {
    if (!displayProfile.favorites || displayProfile.favorites.length === 0) {
      return [];
    }

    // First, filter the favorites
    let filtered = [...displayProfile.favorites];

    if (favoritesFilter !== 'all') {
      // This is a simplified example - in a real app, you'd have category data on recipes
      // For now, we'll just filter based on some keywords in the title or description
      filtered = filtered.filter((recipe: any) => {
        const lowerTitle = (recipe.title || '').toLowerCase();
        const lowerDesc = (recipe.description || '').toLowerCase();

        switch (favoritesFilter) {
          case 'desserts':
            return lowerTitle.includes('dessert') ||
                   lowerTitle.includes('cake') ||
                   lowerTitle.includes('cookie') ||
                   lowerTitle.includes('sweet') ||
                   lowerDesc.includes('dessert') ||
                   lowerDesc.includes('sweet');
          case 'main-dishes':
            return lowerTitle.includes('dinner') ||
                   lowerTitle.includes('lunch') ||
                   lowerTitle.includes('main') ||
                   lowerDesc.includes('dinner') ||
                   lowerDesc.includes('main course');
          case 'appetizers':
            return lowerTitle.includes('appetizer') ||
                   lowerTitle.includes('starter') ||
                   lowerTitle.includes('snack') ||
                   lowerDesc.includes('appetizer') ||
                   lowerDesc.includes('starter');
          case 'drinks':
            return lowerTitle.includes('drink') ||
                   lowerTitle.includes('beverage') ||
                   lowerTitle.includes('cocktail') ||
                   lowerDesc.includes('drink') ||
                   lowerDesc.includes('beverage');
          default:
            return true;
        }
      });
    }

    // Then, sort the filtered results
    return filtered.sort((a: any, b: any) => {
      switch (favoritesSort) {
        case 'newest':
          // Assuming recipes have a createdAt field
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'a-z':
          return (a.title || '').localeCompare(b.title || '');
        case 'z-a':
          return (b.title || '').localeCompare(a.title || '');
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });
  };

  // Mock profile for initial display
  const mockProfile: UserProfile = {
    _id: session?.user.id || '0',
    name: session?.user.name || 'User',
    email: session?.user.email || 'user@example.com',
    image: session?.user.image || '/images/default-avatar.png',
    bio: '',
    favorites: [],
  };

  // Use real data, not mock data
  const displayRecipes = userRecipes;
  const displayProfile = profile || mockProfile;

  if (status === 'loading' || loading) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-8"
        >
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      Profile Image
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-2">
                        <label className="inline-flex items-center text-sm text-gray-600 dark:!text-gray-400">
                          <input
                            type="radio"
                            name="imageSourceType"
                            value="url"
                            checked={imageSourceType === 'url'}
                            onChange={() => setImageSourceType('url')}
                            className="mr-2"
                          />
                          Use URL
                        </label>
                        {imageSourceType === 'url' && (
                          <Input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="Enter image URL"
                          />
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label className="inline-flex items-center text-sm text-gray-600 dark:!text-gray-400">
                          <input
                            type="radio"
                            name="imageSourceType"
                            value="upload"
                            checked={imageSourceType === 'upload'}
                            onChange={() => setImageSourceType('upload')}
                            className="mr-2"
                          />
                          Upload Image
                        </label>
                        {imageSourceType === 'upload' && (
                          <div className="mt-1 flex items-center">
                            <label className="block w-full">
                              <span className="sr-only">Choose profile photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 dark:!text-gray-400
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-medium
                                  file:bg-orange-50 file:text-orange-700
                                  dark:!file:bg-orange-900/20 dark:!file:text-orange-400
                                  hover:file:bg-orange-100 dark:hover:!file:bg-orange-900/30
                                  transition-colors"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(formData.image || imagePreview) && (
                    <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-white dark:!border-gray-700 shadow-md">
                      <Image
                        src={imagePreview || formData.image}
                        alt={formData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="md:w-2/3">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={session?.user.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                  <Image
                    src={displayProfile.image || '/images/default-avatar.png'}
                    alt={displayProfile.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 dark:text-white"
                >
                  <FaPen size={14} />
                  <span>Edit Profile</span>
                </Button>
              </div>

              <div className="md:w-2/3">
                <h1 className="text-2xl font-bold mb-2">
                  {displayProfile.name}
                </h1>

                <div className="flex items-center text-gray-600 mb-4">
                  <FaEnvelope className="mr-2" />
                  <span>{displayProfile.email}</span>
                </div>

                {displayProfile.bio ? (
                  <div className="mb-4">
                    <h2 className="text-lg font-medium mb-2">About</h2>
                    <p className="text-gray-700">{displayProfile.bio}</p>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Your profile is looking a bit empty. Click "Edit Profile" to add a bio and tell others about yourself.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 rounded-md">
                    <p className="text-sm text-black">Recipes</p>
                    <p className="text-xl font-bold text-black">{displayRecipes.length}</p>
                  </div>

                  <div className="px-4 py-2 rounded-md">
                    <p className="text-sm text-black">Favorites</p>
                    <p className="text-xl font-bold text-black">{displayProfile.favorites?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b">
          <div className="flex space-x-8 relative">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`pb-4 font-medium ${
                activeTab === 'recipes'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:hover:!text-gray-300'
              }`}
            >
              My Recipes
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 font-medium ${
                activeTab === 'favorites'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:hover:!text-gray-300'
              }`}
            >
              Favorites
            </button>

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-orange-500"
              initial={false}
              animate={{
                left: activeTab === 'recipes' ? '0%' : '50%',
                width: activeTab === 'recipes' ? '80px' : '80px'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:!text-white">My Recipes</h2>
                <Link href="/recipes/new">
                  <Button variant="primary" className="flex items-center gap-2">
                    <FaPlus size={14} />
                    <span>Add New Recipe</span>
                  </Button>
                </Link>
              </div>

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
              <div className="p-8 rounded-xl text-center">
                <FaPlus className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-xl font-medium mb-2">No recipes yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't created any recipes yet. Start sharing your culinary creations!
                </p>
                <Link href="/recipes/new">
                  <Button variant="primary">Create Your First Recipe</Button>
                </Link>
              </div>
            )}
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:!text-white mb-4 md:mb-0">My Favorite Recipes</h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center">
                    <label htmlFor="filter" className="mr-2 text-sm text-gray-600 dark:!text-gray-400">
                      Filter:
                    </label>
                    <select
                      id="filter"
                      value={favoritesFilter}
                      onChange={(e) => setFavoritesFilter(e.target.value)}
                      className="bg-white dark:!bg-gray-700 border border-gray-300 dark:!border-gray-600 text-gray-700 dark:!text-gray-200 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="all">All Recipes</option>
                      <option value="desserts">Desserts</option>
                      <option value="main-dishes">Main Dishes</option>
                      <option value="appetizers">Appetizers</option>
                      <option value="drinks">Drinks</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-sm text-gray-600 dark:!text-gray-400">
                      Sort:
                    </label>
                    <select
                      id="sort"
                      value={favoritesSort}
                      onChange={(e) => setFavoritesSort(e.target.value)}
                      className="bg-white dark:!bg-gray-700 border border-gray-300 dark:!border-gray-600 text-gray-700 dark:!text-gray-200 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="a-z">A-Z</option>
                      <option value="z-a">Z-A</option>
                      <option value="rating">Highest Rating</option>
                    </select>
                  </div>
                </div>
              </div>

            {displayProfile.favorites && displayProfile.favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredAndSortedFavorites().map((recipe: any, index: number) => {
                  // Make sure recipe has an _id
                  const recipeId = recipe._id ? recipe._id.toString() : `favorite-${index}`;
                  return (
                    <motion.div
                      key={recipeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        showManageButtons={true}
                        onEdit={handleEditRecipe}
                        onDelete={handleDeleteRecipe}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-xl text-center">
                <FaHeart className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't saved any recipes as favorites yet. Browse recipes and click the heart icon to save them here.
                </p>
                <Link href="/recipes">
                  <Button variant="primary">Browse Recipes</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
