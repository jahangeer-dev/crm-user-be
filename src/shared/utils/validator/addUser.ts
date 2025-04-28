import { z } from "zod";

class AddUserValidator {
    private static instance: AddUserValidator;
    public readonly validator = z.object({
        email: z
            .string()
            .email({ message: "Invalid email address" })
            .min(3, { message: "Email must be at least 3 characters long" })
            .trim(),
        password: z
            .string(),
        userName: z
            .string()
            .min(3, { message: "Username must be at least 3 characters long" })
            .max(20, { message: "Username must not exceed 20 characters" })
            .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain alphanumeric characters and underscores" })
            .trim(),
        isOAuth: z
            .boolean()
            .default(false),
    }).transform(data => ({
        email: data.email.trim(),
        password: data.password,
        userName: data.userName.trim(),
        isOAuth: data.isOAuth,
    }));

    private constructor() { }

    public static getInstance(): AddUserValidator {
        if (!AddUserValidator.instance) {
            AddUserValidator.instance = new AddUserValidator();
        }
        return AddUserValidator.instance;
    }
}

export const validatorInstance = AddUserValidator.getInstance();

