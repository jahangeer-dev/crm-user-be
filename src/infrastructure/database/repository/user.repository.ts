import { appLogger } from "@/shared/observability/logger/appLogger.js";
import type { IUser } from "@/domain/interfaces/IUser.js";
import { UserModel } from "../mongo/schema/user.modal.js";
import { DuplicateResourceError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
import type { UserResponseDTO } from "@/application/user/dtos/UserReponseDTO.js";
import { redisClient } from "../redis/redisClient.js";
import type { MongooseError } from "mongoose";
import logger from "@/shared/observability/logger/logger.js";
export class UserRepository {
    private readonly redisclient = redisClient
    public async add(data: IUser): Promise<UserResponseDTO> {
        try {
            const user = await UserModel.create(data) as IUser & { _id: string }
            appLogger.info("db", `User created successfully ${user._id}`)
            return {
                id: user._id as string,
                userName: user.userName,
                email: user.email,
                isOAuth: user.isOAuth,
                passwordHash: user.passwordHash,
                isActive: user.isActive,
                emailVerified: user.emailVerified ?? false,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
            };
        } catch (error) {
            if ((error as MongooseError).name === "MongoServerError" && (error as any).code === 11000) {
                const duplicateField = Object.keys((error as any).keyPattern)[0];
                appLogger.error("db", `Duplicate user error: ${duplicateField}`);
                throw new DuplicateResourceError(`User with this ${duplicateField} already exists`);
            } else {
                appLogger.error("db", `An error occurred while creating user: ${error}`);
                throw new InternalServerError("An error occurred while creating user");
            }
        }
    }
    public async getByEmail(email: string): Promise<UserResponseDTO | null> {
        let user = await this.redisclient.get(email)
        if (user) {
            user = JSON.parse(user)
        }
        if (!user) {
            appLogger.info("db", `User not found in cache, fetching from DB: ${email}`);
            const userDoc = await UserModel.findOne({ email: email }).exec();

            user = userDoc as (IUser & { _id: string }) | null;
            if (!user) return null;
            await this.redisclient.set(user.email, JSON.stringify(user), 60 * 60 * 24)
        }
        return {
            id: user._id as string,
            userName: user.userName,
            email: user.email,
            isOAuth: user.isOAuth,
            passwordHash: user.passwordHash,
            isActive: user.isActive,
            emailVerified: user.emailVerified ?? false,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        };
    }
    public async getByUserName(userName: string): Promise<UserResponseDTO | null> {

        let user = await this.redisclient.get(userName)
        if (user) {
            user = JSON.parse(user)
        }
        if (!user) {
            appLogger.info("db", `User not found in cache, fetching from DB: ${userName}`);
            const userDoc = await UserModel.findOne({ userName: userName }).exec();
            console.log(userDoc);

            user = userDoc as (IUser & { _id: string }) | null;
            if (!user) return null;

            await this.redisclient.set(user.userName, JSON.stringify(user), 60 * 60 * 24)
        }
        return {
            id: user._id as string,
            userName: user.userName,
            email: user.email,
            isOAuth: user.isOAuth,
            passwordHash: user.passwordHash,
            isActive: user.isActive,
            emailVerified: user.emailVerified ?? false,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
        };
    }

}
