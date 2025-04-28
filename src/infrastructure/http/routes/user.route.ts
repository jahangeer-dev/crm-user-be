import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"

class UserRouter {
    private static instance: UserRouter
    private readonly userController = new UserController()
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.post("/", this.userController.addUser)
        this.router.get("/:userNameOrEmail", this.userController.getUser)

    }
    public getRouter() {
        return this.router
    }

    public static getInstance() {
        if (!UserRouter.instance) {
            UserRouter.instance = new UserRouter()
        }
        return UserRouter.instance
    }
}
export const userRouter = UserRouter.getInstance().getRouter()
