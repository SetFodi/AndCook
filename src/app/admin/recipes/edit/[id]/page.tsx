'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaUpload, FaLink, FaImage, FaSave } from 'react-icons/fa';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import Link from 'next/link';
import LoadingIndicator from '../../../../../components/ui/LoadingIndicator';
import { useLoading } from '../../../../../context/LoadingContext';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Instruction {
  step: number;
  description: string;
}

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

export default function EditRecipePage({ params }: { params: { id: string } }) {
  // Get the ID safely without using React.use()
  const id = params?.id;
  const { startLoading, stopLoading } = useLoading();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: '',
    servings: '',
    difficulty: 'Medium',
    mainImage: '',
    categories: [] as string[],
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: '' },
  ]);

  const [instructions, setInstructions] = useState<Instruction[]>([
    { step: 1, description: '' },
  ]);

  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      if (session?.user?.email !== 'lukafartenadze2004@gmail.com' && session?.user?.role !== 'admin') {
        router.push('/');
      } else {
        fetchRecipe();
        fetchCategories();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, session, router, id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      startLoading(); // Start global loading animation

      const response = await fetch(`/api/recipes/by-id/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }

      const data = await response.json();
      setRecipe(data.recipe);

      // Populate form data
      setFormData({
        title: data.recipe.title || '',
        description: data.recipe.description || '',
        cookingTime: data.recipe.cookingTime?.toString() || '',
        servings: data.recipe.servings?.toString() || '',
        difficulty: data.recipe.difficulty || 'Medium',
        mainImage: data.recipe.mainImage || '',
        categories: data.recipe.categories?.map((cat: any) => cat._id) || [],
      });

      // Populate ingredients
      if (data.recipe.ingredients && data.recipe.ingredients.length > 0) {
        setIngredients(data.recipe.ingredients);
      }

      // Populate instructions
      if (data.recipe.instructions && data.recipe.instructions.length > 0) {
        setInstructions(data.recipe.instructions);
      }

    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Failed to load recipe. Please try again.');
    } finally {
      setLoading(false);
      stopLoading(); // Stop global loading animation
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryId = e.target.value;

    if (e.target.checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryId],
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(id => id !== categoryId),
      });
    }
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index].description = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    const nextStep = instructions.length + 1;
    setInstructions([...instructions, { step: nextStep, description: '' }]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);

      // Renumber steps
      newInstructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });

      setInstructions(newInstructions);
    }
  };

  const moveInstructionUp = (index: number) => {
    if (index > 0) {
      const newInstructions = [...instructions];
      const temp = newInstructions[index];
      newInstructions[index] = newInstructions[index - 1];
      newInstructions[index - 1] = temp;

      // Renumber steps
      newInstructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });

      setInstructions(newInstructions);
    }
  };

  const moveInstructionDown = (index: number) => {
    if (index < instructions.length - 1) {
      const newInstructions = [...instructions];
      const temp = newInstructions[index];
      newInstructions[index] = newInstructions[index + 1];
      newInstructions[index + 1] = temp;

      // Renumber steps
      newInstructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });

      setInstructions(newInstructions);
    }
  };

  const validateForm = () => {
    if (!formData.title) {
      setError('Recipe title is required');
      return false;
    }

    if (!formData.description) {
      setError('Recipe description is required');
      return false;
    }

    if (imageUploadMethod === 'url' && !formData.mainImage) {
      setError('Main image URL is required');
      return false;
    }

    if (imageUploadMethod === 'upload' && !uploadedImage && !formData.mainImage) {
      setError('Please upload an image or provide an image URL');
      return false;
    }

    if (!formData.cookingTime) {
      setError('Cooking time is required');
      return false;
    }

    if (!formData.servings) {
      setError('Number of servings is required');
      return false;
    }

    // Check if all ingredients have a name
    const invalidIngredient = ingredients.some((ing) => !ing.name);
    if (invalidIngredient) {
      setError('All ingredients must have a name');
      return false;
    }

    // Check if all instructions have a description
    const invalidInstruction = instructions.some((ins) => !ins.description);
    if (invalidInstruction) {
      setError('All instructions must have a description');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleFileUpload = async (): Promise<string> => {
    if (!uploadedImage) {
      setError('No file selected');
      return '';
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadedImage);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Reset after successful upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

      return data.url;
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
      console.error('Error uploading image:', err);
      setIsUploading(false);
      setUploadProgress(0);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      startLoading(); // Start global loading animation

      // If using file upload and there's a file but it hasn't been uploaded yet
      if (imageUploadMethod === 'upload' && uploadedImage && !formData.mainImage) {
        try {
          const uploadUrl = await handleFileUpload();
          if (!uploadUrl) {
            setSubmitting(false);
            stopLoading(); // Stop global loading animation
            return;
          }
          // Update formData with the uploaded image URL
          setFormData(prev => ({ ...prev, mainImage: uploadUrl }));
        } catch (uploadErr) {
          setError('Failed to upload image. Please try again.');
          setSubmitting(false);
          stopLoading(); // Stop global loading animation
          return;
        }
      }

      const recipeData = {
        ...formData,
        cookingTime: parseInt(formData.cookingTime),
        servings: parseInt(formData.servings),
        ingredients,
        instructions,
      };

      const response = await fetch(`/api/recipes/by-id/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData.message || 'Failed to update recipe');
      }

      const data = await response.json();
      console.log('Recipe updated successfully:', data);
      setSuccess(true);

      // Redirect to the recipe page after 2 seconds
      setTimeout(() => {
        router.push(`/recipes/${data.recipe.slug}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error updating recipe');
      console.error('Error updating recipe:', err);
    } finally {
      setSubmitting(false);
      stopLoading(); // Stop global loading animation
    }
  };

  // Use mock data if no categories are loaded yet
  const displayCategories = categories.length > 0 ? categories : [];

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingIndicator size="large" text="Preparing your recipe for editing..." />
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-green-50 p-6 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Recipe Updated Successfully!</h2>
          <p className="text-green-600 mb-4">
            Your recipe has been updated and will be available for others to enjoy.
          </p>
          <p className="text-gray-600">Redirecting to your recipe page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Edit Recipe</h1>
            <p className="text-gray-600">
              Update your recipe details below.
            </p>
          </motion.div>

          <div className="flex space-x-3">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              href={recipe ? `/recipes/${recipe.slug}` : '/recipes'}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Recipe
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input
                  label="Recipe Title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Homemade Chocolate Chip Cookies"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your recipe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div>
                <Input
                  label="Cooking Time (minutes)"
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  min="1"
                  required
                />
              </div>

              <div>
                <Input
                  label="Servings"
                  id="servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleInputChange}
                  placeholder="e.g., 4"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>

                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod('url')}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      imageUploadMethod === 'url'
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <FaLink className="mr-2" />
                    URL
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageUploadMethod('upload')}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      imageUploadMethod === 'upload'
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <FaUpload className="mr-2" />
                    Upload
                  </button>
                </div>

                {imageUploadMethod === 'url' ? (
                  <Input
                    id="mainImage"
                    name="mainImage"
                    value={formData.mainImage}
                    onChange={handleInputChange}
                    placeholder="Enter URL for the main recipe image"
                  />
                ) : (
                  <div>
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                      >
                        <FaImage className="mr-2 text-gray-500" />
                        <span>{uploadedImage ? 'Change Image' : 'Select Image'}</span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                      />

                      {uploadedImage && !isUploading && !formData.mainImage && (
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                        >
                          Upload Image
                        </button>
                      )}
                    </div>

                    {uploadedImage && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected: {uploadedImage.name} ({Math.round(uploadedImage.size / 1024)} KB)
                        </p>
                      </div>
                    )}

                    {isUploading && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-orange-500 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                      </div>
                    )}

                    {formData.mainImage && (
                      <div className="mt-3">
                        <p className="text-sm text-green-600 mb-2">Current image:</p>
                        <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                          <img
                            src={formData.mainImage}
                            alt="Recipe"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {displayCategories.map((category) => (
                  <div key={category._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category._id}`}
                      value={category._id}
                      checked={formData.categories.includes(category._id)}
                      onChange={handleCategoryChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-${category._id}`}
                      className="ml-2 text-gray-700"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Ingredients</h2>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-start mb-3">
                <div className="flex-1 grid grid-cols-12 gap-2">
                  <div className="col-span-3">
                    <Input
                      placeholder="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 mt-2 text-red-500 hover:text-red-700"
                  disabled={ingredients.length === 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center text-orange-500 hover:text-orange-600 mt-4"
            >
              <FaPlus className="mr-1" />
              <span>Add Ingredient</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>

            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start mb-4">
                <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 mt-2">
                  {instruction.step}
                </div>
                <div className="flex-1 ml-3">
                  <textarea
                    placeholder={`Step ${instruction.step} instructions`}
                    value={instruction.description}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={2}
                    required
                  ></textarea>
                </div>
                <div className="flex flex-col ml-2 mt-2">
                  <button
                    type="button"
                    onClick={() => moveInstructionUp(index)}
                    className="text-gray-500 hover:text-gray-700 mb-1"
                    disabled={index === 0}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveInstructionDown(index)}
                    className="text-gray-500 hover:text-gray-700 mb-1"
                    disabled={index === instructions.length - 1}
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={instructions.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addInstruction}
              className="flex items-center text-orange-500 hover:text-orange-600 mt-4"
            >
              <FaPlus className="mr-1" />
              <span>Add Step</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="flex items-center"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
