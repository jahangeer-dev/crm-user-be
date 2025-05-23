
export interface UserResponseDTO {
    id: string;
    userName: string;
    email: string;
    passwordHash?: string;
    isOAuth: boolean;
    isActive: boolean;
    emailVerified: boolean;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    phone?: string;
    avatarUrl?: string;
    
  }
  