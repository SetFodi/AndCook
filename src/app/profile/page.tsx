'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch user profile and recipes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user.id) return;

      try {
        setLoading(true);

        // Fetch user profile
        const profileResponse = await fetch(`/api/users/${session.user.id}`);

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profileData = await profileResponse.json();
        setProfile(profileData);
        setFormData({
          name: profileData.name,
          bio: profileData.bio || '',
          image: profileData.image || '',
        });

        // Fetch user recipes
        const recipesResponse = await fetch(`/api/recipes?author=${session.user.id}`);

        if (!recipesResponse.ok) {
          throw new Error('Failed to fetch user recipes');
        }

        const recipesData = await recipesResponse.json();
        setUserRecipes(recipesData.recipes || []);
      } catch (err) {
        setError('Error loading profile. Please try again later.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.id) {
      fetchUserData();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user.id) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Mock data for initial display
  const mockRecipes: Recipe[] = [
    {
      _id: '1',
      title: 'Homemade Pizza',
      description: 'Delicious pizza with a crispy crust and your favorite toppings.',
      mainImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
      slug: 'homemade-pizza',
      cookingTime: 60,
      difficulty: 'Medium',
      averageRating: 4.7,
      author: {
        name: session?.user.name || 'User',
        image: session?.user.image || '',
      },
    },
    {
      _id: '2',
      title: 'Chocolate Chip Cookies',
      description: 'Classic chocolate chip cookies that are soft in the middle and crispy on the edges.',
      mainImage: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      slug: 'chocolate-chip-cookies',
      cookingTime: 25,
      difficulty: 'Easy',
      averageRating: 4.9,
      author: {
        name: session?.user.name || 'User',
        image: session?.user.image || '',
      },
    },
  ];

  // Mock profile for initial display
  const mockProfile: UserProfile = {
    _id: session?.user.id || '0',
    name: session?.user.name || 'User',
    email: session?.user.email || 'user@example.com',
    image: session?.user.image || '/images/default-avatar.svg',
    bio: '',
    favorites: [],
  };

  // Use mock data if no data is loaded yet
  const displayRecipes = userRecipes.length > 0 ? userRecipes : mockRecipes;
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image URL
                    </label>
                    <Input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                    />
                  </div>

                  {formData.image && (
                    <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md">
                      <Image
                        src={formData.image}
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
                    src={displayProfile.image || '/default-avatar.svg'}
                    alt={displayProfile.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
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
                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-500">Recipes</p>
                    <p className="text-xl font-bold">{displayRecipes.length}</p>
                  </div>

                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-500">Favorites</p>
                    <p className="text-xl font-bold">{displayProfile.favorites?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`pb-4 font-medium ${
                activeTab === 'recipes'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Recipes
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 font-medium ${
                activeTab === 'favorites'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'recipes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Recipes</h2>
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
              <div className="bg-gray-50 p-8 rounded-xl text-center">
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
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Favorite Recipes</h2>

            {displayProfile.favorites && displayProfile.favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProfile.favorites.map((recipe, index) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
