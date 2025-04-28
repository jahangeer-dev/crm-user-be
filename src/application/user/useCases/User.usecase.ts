import { appLogger } from "@/shared/observability/logger/appLogger.js";
import type { IUser } from "@/domain/interfaces/IUser.js";
import type { AddUserCommand } from "../commands/AddUser.command.js";
import { userRepository } from "@/infrastructure/database/mongo/repository/user.repository.js";
import type { UserResponseDTO } from "../dtos/UserReponseDTO.js";
import { InternalServerError } from "@/shared/utils/errors/ApiError.js";
class UserUseCase {
    private static instance: UserUseCase;
    private constructor() { }
    public static getInstance(): UserUseCase {
        if (!UserUseCase.instance)
            UserUseCase.instance = new UserUseCase()
        return UserUseCase.instance
    }
    public async addExec(data: AddUserCommand): Promise<UserResponseDTO> {
        try {
            const user: IUser = {
                userName: data.userName,
                email: data.email,
                passwordHash: data.password,
                isOAuth: data.isOAuth,
                isActive: true,
                emailVerified: false,
            };
            return await userRepository.add(user);

        } catch (error) {
            if (error instanceof Error) {
                appLogger.error("user", `Error creating user: ${error.message}`);
            } else {
                appLogger.error("user", "Error creating user: Unknown error");
            }
            throw new InternalServerError();
        }

    }


}

export const userUseCase = UserUseCase.getInstance();