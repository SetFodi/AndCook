import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      // Only required for users created through registration
      required: false,
    },
    image: {
      type: String,
      default: '/images/default-avatar.png',
    },
    bio: {
      type: String,
      default: '',
    },
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
    }],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', UserSchema);

export default User;
