import { Router } from "express"
import { healthRouter } from "./health.route.js"
import { userRouter } from "./user.route.js"

class IndexRouter {
    private static instance: IndexRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.use("/health", healthRouter)
        this.router.use("/users", userRouter)


    }
    public getRouter() {
        return this.router
    }

    public static getInstance() {
        if (!IndexRouter.instance) {
            IndexRouter.instance = new IndexRouter()
        }
        return IndexRouter.instance
    }

}
export const indexRouter = IndexRouter.getInstance().getRouter()