import { Router } from "express"
import { userController } from "../controllers/user.controller.js"

class UserRouter {
    private static instance: UserRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.post("/", userController.addUser)
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
