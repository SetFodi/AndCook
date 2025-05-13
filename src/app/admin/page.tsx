'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaUtensils, FaList, FaTags, FaChartBar, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

interface Recipe {
  _id: string;
  title: string;
  slug: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      if (session?.user?.email !== 'lukafartenadze2004@gmail.com' && session?.user?.role !== 'admin') {
        router.push('/');
      } else {
        // Fetch recipes and users data
        fetchData();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch recipes using admin API endpoint
      const recipesResponse = await fetch('/api/admin/recipes');
      const recipesData = await recipesResponse.json();
      console.log('Recipes data:', recipesData);
      setRecipes(recipesData.recipes || []);

      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();
      console.log('Users data:', usersData);
      setUsers(usersData.users || []);

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      console.log('Categories data:', categoriesData);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(recipeId);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/recipes/by-id/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete recipe');
      }

      // Remove the deleted recipe from the state
      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));

    } catch (error) {
      console.error('Error deleting recipe:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete recipe');
    } finally {
      setDeleteLoading(null);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'dashboard' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
                >
                  <FaChartBar className="mr-2" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'recipes' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
                >
                  <FaUtensils className="mr-2" />
                  Recipes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'users' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
                >
                  <FaUsers className="mr-2" />
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'categories' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
                >
                  <FaTags className="mr-2" />
                  Categories
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-600">Total Recipes</h3>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-600">Total Users</h3>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-600">Admin Users</h3>
                  <p className="text-2xl font-bold">{users.filter(user => user.role === 'admin').length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-600">Categories</h3>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                <p className="text-gray-500">Recent activity will be displayed here.</p>
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recipes</h2>
                <Link href="/recipes/new" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                  Add New Recipe
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Title</th>
                      <th className="py-2 px-4 text-left">Author</th>
                      <th className="py-2 px-4 text-left">Created</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map(recipe => (
                      <tr key={recipe._id} className="border-t">
                        <td className="py-2 px-4">{recipe.title}</td>
                        <td className="py-2 px-4">{recipe.author?.name || 'Unknown'}</td>
                        <td className="py-2 px-4">{new Date(recipe.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/recipes/${recipe.slug}`}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="View Recipe"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              href={`/admin/recipes/edit/${recipe._id}`}
                              className="text-orange-500 hover:text-orange-700 transition-colors"
                              title="Edit Recipe"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDeleteRecipe(recipe._id)}
                              className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                              disabled={deleteLoading === recipe._id}
                              title="Delete Recipe"
                            >
                              {deleteLoading === recipe._id ? (
                                <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                          {deleteError && deleteLoading === recipe._id && (
                            <p className="text-red-500 text-xs mt-1">{deleteError}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                    {recipes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          No recipes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Role</th>
                      <th className="py-2 px-4 text-left">Joined</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-t">
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <button className="text-orange-500 hover:underline mr-2">
                            Edit
                          </button>
                          <button className="text-red-500 hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Categories</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                  Add New Category
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Slug</th>
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category._id} className="border-t">
                        <td className="py-2 px-4">{category.name}</td>
                        <td className="py-2 px-4">{category.slug}</td>
                        <td className="py-2 px-4">{category.description || '-'}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/categories/${category.slug}`}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="View Category"
                            >
                              <FaEye />
                            </Link>
                            <button
                              className="text-orange-500 hover:text-orange-700 transition-colors"
                              title="Edit Category"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Category"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
