import { AsyncHandler } from "@/infrastructure/http/middlewares/asyncHandler.js";
import type { Request, Response } from "express";
import { SuccessResponse } from "../responses/ApiResponse.js";
import type { CreateUserResponseDTO, GetUserResponseDTO } from "@/application/user/dtos/UserReponseDTO.js";
import { CreateUserUseCase } from "@/application/user/useCases/createUser.usecase.js";
import { AddUserCommand } from "@/application/user/commands/AddUser.command.js";
import type { CreateUserDTO } from "@/application/user/dtos/CreateUserDTO.js";
import { BadRequestError, InternalServerError, NotFoundError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { getUserUseCase } from "@/application/user/useCases/getUser.usecase.js";

export class UserController {
    private readonly createUserUseCase = new CreateUserUseCase();
    public addUser = AsyncHandler(async (req: Request, res: Response) => {

        const { userName, email, password, isOAuth } = req.body as CreateUserDTO;
        if (!userName || !email || !password || isOAuth === undefined) {
            appLogger.error("control", `userName: ${userName}, email: ${email}, password: ${password}, isOAuth: ${isOAuth}`)
            throw new BadRequestError("userName, email and password are required")
        }
        const command: AddUserCommand = new AddUserCommand(email, password, isOAuth, userName);
        const { id }: CreateUserResponseDTO = await this.createUserUseCase.exec(command);
        return new SuccessResponse("User created successfully", id).send(res);

    });
    public getUser = AsyncHandler(async (req: Request, res: Response) => {
        const { userNameOrEmail } = req.params;

        if (!userNameOrEmail) {
            appLogger.error("control", `userNameOrEmail is missing`);
            throw new BadRequestError("userNameOrEmail is required");
        }

        const user: GetUserResponseDTO = await getUserUseCase.exec(userNameOrEmail);

        return new SuccessResponse("User fetched successfully", user).send(res);
    });



}
