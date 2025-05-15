import mongoose, { Schema, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
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
let Category;
if (process.env.NODE_ENV === 'production') {
  // If the model exists, delete it first
  if (mongoose.models.Category) {
    delete mongoose.models.Category;
  }
  Category = mongoose.model('Category', CategorySchema);
} else {
  // In development, use the cached model
  Category = models.Category || mongoose.model('Category', CategorySchema);
}

export default Category;
