import { AsyncHandler } from "@/infrastructure/http/middlewares/asyncHandler.js";
import type { Request, Response } from "express";
import { CreatedResponse, NoContentResponse, SuccessResponse } from "../responses/ApiResponse.js";
import type { UserResponseDTO } from "@/application/user/dtos/UserReponseDTO.js";
import { CreateUserUseCase } from "@/application/user/useCases/createUser.usecase.js";
import { AddUserCommand } from "@/application/user/commands/AddUser.command.js";
import type { CreateUserDTO } from "@/application/user/dtos/CreateUserDTO.js";
import { BadRequestError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { GetByMailCommand, GetByNameCommand } from "@/application/user/commands/GetUserCommand.js";
import { GetUserByEmailUseCase } from "@/application/user/useCases/getUserByEmail.usecase.js";
import { GetUserByUserNameUseCase } from "@/application/user/useCases/getUserByUserName.usecase.js";
import { CheckUserExistenceUseCase } from "@/application/user/useCases/UserExist.usecase.js";
export class UserController {
    private readonly createUserUseCase = new CreateUserUseCase();
    private readonly getUserByEmailUseCase = new GetUserByEmailUseCase();
    private readonly getUserByUserNameUseCase = new GetUserByUserNameUseCase();
    private readonly checkUserExistenceUseCase = new CheckUserExistenceUseCase();

    public addUser = AsyncHandler(async (req: Request, res: Response) => {

        const { userName, email, passwordHash, isOAuth, avatarUrl } = req.body as CreateUserDTO;
        const command = new AddUserCommand(email, userName, isOAuth ?? false, passwordHash, avatarUrl);
        appLogger.info("control", `User creation attempt for: ${userName} ${email} ${passwordHash}`);

        const user: UserResponseDTO = await this.createUserUseCase.exec(command);
        return new CreatedResponse("User created successfully", user).send(res);

    });
    public getUserByMail = AsyncHandler(async (req: Request, res: Response) => {
        const { email } = req.params;
        if (!email) {
            throw new BadRequestError("Email parameter is required");
        }

        const command = new GetByMailCommand(email)

        const user: UserResponseDTO = await this.getUserByEmailUseCase.exec(command);

        return new SuccessResponse("User fetched successfully", user).send(res);
    });
    public getUserByName = AsyncHandler(async (req: Request, res: Response) => {
        const { userName } = req.params;
        if (!userName) {
            throw new BadRequestError("userName parameter is required");
        }
        const command = new GetByNameCommand(userName)


        const user: UserResponseDTO = await this.getUserByUserNameUseCase.exec(command);

        return new SuccessResponse("User fetched successfully", user).send(res);
    });

    public checkUserExists = AsyncHandler(async (req: Request, res: Response) => {
        const { userName, email } = req.query;
        await this.checkUserExistenceUseCase.exec({
            userName: typeof userName === "string" ? userName : undefined,
            email: typeof email === "string" ? email : undefined
        });

        return new NoContentResponse("No user found").send(res);
    });

}
