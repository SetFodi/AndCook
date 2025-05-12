import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/db/mongodb';
import User from '../../../lib/models/User';
import Recipe from '../../../lib/models/Recipe';
import Category from '../../../lib/models/Category';
import { sampleRecipes, sampleCategories } from '../../../lib/data/sampleRecipes';
import { additionalRecipes } from '../../../lib/data/additionalRecipes';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check if we're in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { message: 'Seed route is only available in development mode' },
        { status: 403 }
      );
    }

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Category.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@andcook.com',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      bio: 'I love cooking and sharing recipes!',
    });

    await adminUser.save();

    // Create categories
    const categoryMap = new Map();

    for (const categoryData of sampleCategories) {
      const category = new Category({
        name: categoryData.name,
        description: categoryData.description,
        image: categoryData.image,
        slug: categoryData.slug,
      });

      await category.save();
      categoryMap.set(categoryData.name, category._id);
    }

    // Create recipes
    const allRecipes = [...sampleRecipes, ...additionalRecipes];

    for (const recipeData of allRecipes) {
      // Map category names to category IDs
      const categoryIds = recipeData.categories.map(
        (categoryName: string) => categoryMap.get(categoryName)
      ).filter(Boolean);

      const recipe = new Recipe({
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        mainImage: recipeData.mainImage,
        images: [],
        author: adminUser._id,
        categories: categoryIds,
        ratings: [],
        averageRating: 0,
        slug: recipeData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-'),
      });

      await recipe.save();
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      user: {
        email: adminUser.email,
        password: 'password123',
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { message: 'Error seeding database' },
      { status: 500 }
    );
  }
}
