import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  userName: string;
  email: string;
  passwordHash?: string;
  isOAuth: boolean;
  role?: 'customer' | 'seller' | 'admin';
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified?: boolean;

}