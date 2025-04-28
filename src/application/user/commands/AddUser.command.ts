import { ValidationError } from "@/shared/utils/errors/ApiError.js";
import { validatorInstance } from "@/shared/utils/validator/addUser.js";
export class AddUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly isOAuth: boolean = false,
        public readonly userName: string,
    ) {
        this.validate();
    }

    private validate() {
        const validate = validatorInstance.validator.safeParse({  email: this.email, password: this.password });
        if (!validate.success) {
            throw new ValidationError(validate.error.message);
        }
    }
}