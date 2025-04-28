import { appLogger } from "@/shared/observability/logger/appLogger.js";
import type { IUser } from "@/domain/interfaces/IUser.js";
import { UserModel } from "../schema/user.modal.js";
import { DuplicateResourceError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
import type { UserResponseDTO } from "@/application/user/dtos/UserReponseDTO.js";
class UserRepository {
    private static instance: UserRepository;
    private constructor() {

    }
    public static getInstance(): UserRepository {
        if (!UserRepository.instance)
            UserRepository.instance = new UserRepository();

        return UserRepository.instance;
    }

    public async add(data: IUser): Promise<UserResponseDTO> {
        try {
            const user = await UserModel.create(data)
            appLogger.info("db", `user created successfully ${user._id}`)
            return {
                id: user._id as string,
            };
        } catch (error) {
            if ((error as any).code === 11000) {
                appLogger.error("db", `Duplicate user error: ${error}`);
                throw new DuplicateResourceError("Email already exists");
            } else {
                appLogger.error("db", `An error occurred while creating user: ${error}`);
                throw new InternalServerError("An error occurred while creating user");
            }
        }
    }

}

export const userRepository = UserRepository.getInstance();