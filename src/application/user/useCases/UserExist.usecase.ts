import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { UserRepository } from "@/infrastructure/database/repository/user.repository.js";
import { ConflictError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
import type { CheckUserExistenceDTO } from "../dtos/CheckUserExistenceDTO.js";
export class CheckUserExistenceUseCase {
    private readonly userRepository = new UserRepository();


    public async exec({ email, userName }: CheckUserExistenceDTO): Promise<void> {
        try {
            appLogger.info("usecase", `Checking user existence for email: ${email} and username: ${userName}`);
            const emailUser = email ? await this.userRepository.getByEmail(email) : null;
            if (emailUser) {
                throw new ConflictError("USER_EMAIL_ALREADY_EXISTS");
            }
            const usernameUser = userName ? await this.userRepository.getByUserName(userName) : null;
            if (usernameUser) {
                throw new ConflictError("USER_NAME_ALREADY_EXISTS");
            }

        } catch (error) {
            if (error instanceof ConflictError) throw error;
            appLogger.error("usecase", `Error checking user existence: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw new InternalServerError();
        }
    }
}

