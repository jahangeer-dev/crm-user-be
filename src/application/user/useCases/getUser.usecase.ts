import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { UserRepository } from "@/infrastructure/database/repository/user.repository.js";
import { InternalServerError, NotFoundError } from "@/shared/utils/errors/ApiError.js";
import type { GetUserResponseDTO } from "../dtos/UserReponseDTO.js";
import { z } from "zod";

class GetUserUseCase {
    private static instance: GetUserUseCase;
    private readonly userRepository = new UserRepository();
    private constructor() { }
    public static getInstance(): GetUserUseCase {
        if (!GetUserUseCase.instance)
            GetUserUseCase.instance = new GetUserUseCase();
        return GetUserUseCase.instance;
    }

    public async exec(userNameOrEmail: string): Promise<GetUserResponseDTO> {
        try {
            const emailSchema = z.string().email();
            const isEmail = emailSchema.safeParse(userNameOrEmail).success;

            let user;
            if (isEmail) {
                user = await this.userRepository.getByEmail(userNameOrEmail);
            } else {
                user = await this.userRepository.getByUserName(userNameOrEmail);
            }

            if (!user) {
                appLogger.error("usecase", `User not found for: ${userNameOrEmail}`);
                throw new NotFoundError("User not found");
            }

            const response: GetUserResponseDTO = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                passwordHash: user.passwordHash,
                isOAuth: user.isOAuth,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
            };

            return response;

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            if (error instanceof Error) {
                appLogger.error("usecase", `Error fetching user: ${error.message}`);
            } else {
                appLogger.error("usecase", "Error fetching user: Unknown error");
            }
            throw new InternalServerError();
        }
    }
}


export const getUserUseCase = GetUserUseCase.getInstance();
