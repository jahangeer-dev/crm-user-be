import { UserRepository } from "@/infrastructure/database/repository/user.repository.js";
import { NotFoundError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import type { GetUserByMailDTO } from "../dtos/GetUserDTO.js";
import type { UserResponseDTO } from "../dtos/UserReponseDTO.js";

export class GetUserByEmailUseCase {
    private readonly userRepository = new UserRepository();
    public async exec(command: GetUserByMailDTO): Promise<UserResponseDTO> {
        try {
            const user = await this.userRepository.getByEmail(command.email);
            if (!user) {
                appLogger.error("usecase", `User not found for: ${command.email}`);
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
            appLogger.error("usecase", `GetUserByEmailUseCase error: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw error instanceof NotFoundError ? error : new InternalServerError();
        }
    }
}
