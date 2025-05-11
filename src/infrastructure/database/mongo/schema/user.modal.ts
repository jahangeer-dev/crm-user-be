import type { IUser } from '@/domain/interfaces/IUser.js';
import { Schema, model, Document } from 'mongoose';

interface IUserDocument extends Omit<IUser, '_id'>, Document { }

const UserSchema = new Schema<IUserDocument>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: function (this: any) {
        return !this.isOAuth;
      },
    },
    isOAuth: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    phone: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = model('User', UserSchema);
