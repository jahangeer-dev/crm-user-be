
export interface CreateUserDTO {
    email: string;
    passwordHash: string;
    userName: string;
    isOAuth: boolean;
    avatarUrl?: string;
}
