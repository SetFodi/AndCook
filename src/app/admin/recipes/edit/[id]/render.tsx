'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaUpload, FaLink, FaImage, FaSave } from 'react-icons/fa';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';

interface RenderProps {
  recipe: any;
  formData: any;
  setFormData: any;
  ingredients: any[];
  setIngredients: any;
  instructions: any[];
  setInstructions: any;
  imageUploadMethod: 'url' | 'upload';
  setImageUploadMethod: any;
  uploadedImage: File | null;
  setUploadedImage: any;
  uploadProgress: number;
  isUploading: boolean;
  fileInputRef: any;
  handleInputChange: any;
  handleCategoryChange: any;
  handleIngredientChange: any;
  addIngredient: any;
  removeIngredient: any;
  handleInstructionChange: any;
  addInstruction: any;
  removeInstruction: any;
  moveInstructionUp: any;
  moveInstructionDown: any;
  handleFileChange: any;
  handleFileUpload: any;
  handleSubmit: any;
  submitting: boolean;
  error: string;
  categories: any[];
}

export default function RecipeEditForm({
  recipe,
  formData,
  setFormData,
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
  imageUploadMethod,
  setImageUploadMethod,
  uploadedImage,
  setUploadedImage,
  uploadProgress,
  isUploading,
  fileInputRef,
  handleInputChange,
  handleCategoryChange,
  handleIngredientChange,
  addIngredient,
  removeIngredient,
  handleInstructionChange,
  addInstruction,
  removeInstruction,
  moveInstructionUp,
  moveInstructionDown,
  handleFileChange,
  handleFileUpload,
  handleSubmit,
  submitting,
  error,
  categories,
}: RenderProps) {
  const router = useRouter();

  // Use mock data if no categories are loaded yet
  const displayCategories = categories.length > 0 ? categories : [];

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
