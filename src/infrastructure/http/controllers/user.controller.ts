import { AsyncHandler } from "@/infrastructure/http/middlewares/asyncHandler.js";
import type { Request, Response } from "express";
import { SuccessResponse } from "../responses/ApiResponse.js";
import type { UserResponseDTO } from "@/application/user/dtos/UserReponseDTO.js";
import { userUseCase } from "@/application/user/useCases/User.usecase.js";
import { AddUserCommand } from "@/application/user/commands/AddUser.command.js";
import type { CreateUserDTO } from "@/application/user/dtos/CreateUserDTO.js";
import { InternalServerError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";

class UserController {
    private static instance: UserController;
    private constructor() { }

    public addUser = AsyncHandler(async (req: Request, res: Response) => {
        try {
            const { userName, email, password, isOAuth } = req.body as CreateUserDTO;

            const command: AddUserCommand = new AddUserCommand(email, password, isOAuth, userName);
            const { id }: UserResponseDTO = await userUseCase.addExec(command);
            return new SuccessResponse("User created successfully", id).send(res);
        } catch (error) {
            appLogger.error("control",`Error occured on controller ${JSON.stringify(error)}`)
            throw new InternalServerError()
        }
    });

    public static getInstance() {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
}

export const userController = UserController.getInstance();