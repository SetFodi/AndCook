'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface Category {
  _id: string;
  name: string;
}

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Instruction {
  step: number;
  description: string;
}

export default function NewRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat !== value),
      }));
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
    
    if (!formData.mainImage) {
      setError('Main image URL is required');
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
      
      const recipeData = {
        ...formData,
        cookingTime: parseInt(formData.cookingTime),
        servings: parseInt(formData.servings),
        ingredients,
        instructions,
      };
      
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create recipe');
      }
      
      const data = await response.json();
      setSuccess(true);
      
      // Redirect to the new recipe page after 2 seconds
      setTimeout(() => {
        router.push(`/recipes/${data.recipe.slug}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error creating recipe');
      console.error('Error creating recipe:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Mock categories for initial display
  const mockCategories: Category[] = [
    { _id: '1', name: 'Italian' },
    { _id: '2', name: 'Asian' },
    { _id: '3', name: 'Vegetarian' },
    { _id: '4', name: 'Desserts' },
    { _id: '5', name: 'Breakfast' },
    { _id: '6', name: 'Quick & Easy' },
    { _id: '7', name: 'Seafood' },
    { _id: '8', name: 'Baking' },
  ];

  // Use mock data if no categories are loaded yet
  const displayCategories = categories.length > 0 ? categories : mockCategories;

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

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-green-50 p-6 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Recipe Created Successfully!</h2>
          <p className="text-green-600 mb-4">
            Your recipe has been created and will be available for others to enjoy.
          </p>
          <p className="text-gray-600">Redirecting to your recipe page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Create New Recipe</h1>
          <p className="text-gray-600">
            Share your culinary creations with the AndCook community.
          </p>
        </motion.div>

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
              
              <div>
                <Input
                  label="Main Image URL"
                  id="mainImage"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleInputChange}
                  placeholder="Enter URL for the main recipe image"
                  required
                />
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
            >
              {submitting ? 'Creating Recipe...' : 'Create Recipe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
