// This script seeds the database with initial data for testing
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    // Hardcode the MongoDB URI from .env.local
    const MONGODB_URI = 'mongodb+srv://setfodimaro:kakilo123@andcook.annqlf9.mongodb.net/?retryWrites=true&w=majority&appName=AndCook';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Define schemas
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    image: String,
  },
  { timestamps: true }
);

// Create models
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Seed categories
async function seedCategories() {
  try {
    // Check if categories already exist
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log(`${count} categories already exist. Skipping category seeding.`);
      return;
    }

    // Categories to seed
    const categories = [
      {
        name: 'Italian',
        slug: 'italian',
        description: 'Delicious Italian recipes',
        image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
      {
        name: 'Asian',
        slug: 'asian',
        description: 'Flavorful Asian cuisine',
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
      {
        name: 'Mexican',
        slug: 'mexican',
        description: 'Spicy Mexican dishes',
        image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
      },
      {
        name: 'Vegetarian',
        slug: 'vegetarian',
        description: 'Healthy vegetarian options',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
      {
        name: 'Desserts',
        slug: 'desserts',
        description: 'Sweet treats and desserts',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      },
      {
        name: 'Georgian',
        slug: 'georgian',
        description: 'Traditional Georgian cuisine',
        image: 'https://images.unsplash.com/photo-1597695435729-f78f6a2d7c1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
    ];

    // Insert categories
    await Category.insertMany(categories);
    console.log(`${categories.length} categories seeded successfully`);
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// Main function
async function main() {
  await connectToDatabase();
  await seedCategories();

  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

// Run the script
main();
