import mongoose, { Schema, models } from 'mongoose';

const RecipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    ingredients: [{
      name: String,
      quantity: String,
      unit: String,
    }],
    instructions: [{
      step: Number,
      description: String,
    }],
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
    },
    servings: {
      type: Number,
      required: [true, 'Number of servings is required'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    images: [{
      type: String,
    }],
    mainImage: {
      type: String,
      required: [true, 'Main image is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    ratings: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      userName: String,
      userImage: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    averageRating: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// In production, always create a fresh model to avoid stale data
let Recipe;
if (process.env.NODE_ENV === 'production') {
  // If the model exists, delete it first
  if (mongoose.models.Recipe) {
    delete mongoose.models.Recipe;
  }
  Recipe = mongoose.model('Recipe', RecipeSchema);
} else {
  // In development, use the cached model
  Recipe = models.Recipe || mongoose.model('Recipe', RecipeSchema);
}

export default Recipe;
