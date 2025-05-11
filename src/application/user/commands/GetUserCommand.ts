import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { ValidationError } from "@/shared/utils/errors/ApiError.js";
import { validatorInstance } from "@/shared/utils/validator/addUser.js";
import { getUserValidator } from "@/shared/utils/validator/getUser.js";
export class GetByNameCommand {
    constructor(
        public readonly userName: string,
    ) {
        this.validate();
    }

    private validate() {
        const validate = getUserValidator.nameValidator.safeParse(this);
        if (!validate.success) {
            appLogger.error("user", `Validation error: ${validate.error.message}`);
            throw new ValidationError(validate.error.message);
        }

    }
}
export class GetByMailCommand {
    constructor(
        public readonly email: string,
    ) {
        this.validate();
    }

    private validate() {
        const validate = getUserValidator.emailValidator.safeParse(this);
        if (!validate.success) {
            appLogger.error("user", `Validation error: ${validate.error.message}`);
            throw new ValidationError(validate.error.message);
        }

    }
}