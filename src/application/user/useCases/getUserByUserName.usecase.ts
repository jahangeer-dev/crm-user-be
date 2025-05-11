import { UserRepository } from "@/infrastructure/database/repository/user.repository.js";
import { NotFoundError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import type { GetByNameCommand } from "../commands/GetUserCommand.js";
import type { UserResponseDTO } from "../dtos/UserReponseDTO.js";

export class GetUserByUserNameUseCase {
    private readonly userRepository = new UserRepository();


    public async exec(command: GetByNameCommand): Promise<UserResponseDTO> {
        try {
            const user = await this.userRepository.getByUserName(command.userName);
            if (!user) {
                appLogger.error("usecase", `User not found for: ${command.userName}`);
                throw new NotFoundError("User not found");
            }
            return {
                id: user.id,
                userName: user.userName,
                email: user.email,
                passwordHash: user.passwordHash,
                isOAuth: user.isOAuth,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                role:user.role

            };
        } catch (error) {
            appLogger.error("usecase", `GetUserByUserNameUseCase error: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw error instanceof NotFoundError ? error : new InternalServerError();
        }
    }
}
