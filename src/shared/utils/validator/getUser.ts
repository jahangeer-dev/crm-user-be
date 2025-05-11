import { z } from "zod";

class GetUserValidator {
    private static instance: GetUserValidator;
    private constructor() { }
    public readonly nameValidator = z.object({

        userName: z
            .string()
            .min(3, { message: "Username must be at least 3 characters long" })

    }).transform(data => ({
        userName: data.userName.trim(),
    }));
    public readonly emailValidator = z.object({

        email: z
            .string()
            .email({ message: "Invalid email address" })
            .min(3, { message: "Email must be at least 3 characters long" })
            .trim(),
    })
        .transform(data => ({
            email: data.email.trim(),
        }));

    public static getInstance(): GetUserValidator {
        if (!GetUserValidator.instance) {
            GetUserValidator.instance = new GetUserValidator();
        }
        return GetUserValidator.instance;
    }
}

export const getUserValidator = GetUserValidator.getInstance();

