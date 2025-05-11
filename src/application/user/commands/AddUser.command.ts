import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { ValidationError } from "@/shared/utils/errors/ApiError.js";
import { validatorInstance } from "@/shared/utils/validator/addUser.js";
export class AddUserCommand {
    constructor(
        public readonly email: string,
        public readonly userName: string,
        public readonly isOAuth: boolean = false,
        public readonly password?: string,
        public readonly avatarUrl?: string,
    ) {
        this.validate();
    }

    private validate() {
        const validate = validatorInstance.validator.safeParse(this);
        if (!validate.success) {
            appLogger.error("user", `Validation error: ${validate.error.message}`);
            throw new ValidationError(validate.error.message);
        }
        if (!this.isOAuth && !this.password) {
            appLogger.error("user", `Validation error: Password is required for non-OAuth users.`);
            throw new ValidationError("Password is required for non-OAuth users.");
        }
    }
}