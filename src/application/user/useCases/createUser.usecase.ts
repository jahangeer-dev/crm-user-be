import { appLogger } from "@/shared/observability/logger/appLogger.js";
import type { IUser } from "@/domain/interfaces/IUser.js";
import type { AddUserCommand } from "../commands/AddUser.command.js";
import { UserRepository } from "@/infrastructure/database/repository/user.repository.js";
import type { UserResponseDTO } from "../dtos/UserReponseDTO.js";
import { DuplicateResourceError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
export class CreateUserUseCase {
    private readonly userRepository = new UserRepository();


    public async exec(data: AddUserCommand): Promise<UserResponseDTO> {
        try {
            const user: IUser = {
                userName: data.userName,
                email: data.email,
                passwordHash: data.password ?? "",
                isOAuth: data.isOAuth,
                isActive: true,
                avatarUrl: data.avatarUrl ?? "",
                emailVerified: false,
            };
            return await this.userRepository.add(user);

        } catch (error) {
            if (error instanceof DuplicateResourceError) {
                throw error;
            }
            if (error instanceof Error) {
                appLogger.error("user", `Error creating user: ${error.message}`);
            } else {
                appLogger.error("user", "Error creating user: Unknown error");
            }
            throw new InternalServerError();
        }

    }



}
