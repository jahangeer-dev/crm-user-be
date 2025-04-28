import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { appConfig } from "@/config/readers/appConfig.js";
import express, { type Express } from "express";
import { redisClient } from "@/infrastructure/database/redis/redisClient.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { morganMiddleware } from "@/shared/observability/logger/httpLogger.js";
import { indexRouter } from "./routes/index.route.js";
import { rabbitMQClient } from "../messaging/rabbitmq/rabbitmqClient.js";
import helmet from "helmet";
import cors from "cors";
import { mongoClient } from "../database/mongo/mongoClient.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
import { AsyncHandler } from "./middlewares/asyncHandler.js";
class Server {
    private static instance: Server;
    private readonly app: Express
    private constructor() {
        this.app = express()
    }

    private async initDependencies() {
        await mongoClient.connect()
        await redisClient.connect()
        await rabbitMQClient.connect()
    }

    public static getInstance() {
        if (!Server.instance) {
            Server.instance = new Server()
        }
        return Server.instance
    }
    public async init() {
        this.initDependencies().then(async () => {
            this.handleProcessSignals();
            this.handleMiddleWares();
            this.handleRoutes();
            this.handleErrors();
            this.listen();
        })
    }
    private handleMiddleWares() {
        this.app.use(cors({
            origin: appConfig.app.allowedOrigin,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', "x-service"],
            credentials: true,
        }))
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json({ limit: '50mb' }))
        this.app.use(helmet())
        this.app.use(morganMiddleware)
        this.app.use(authenticationMiddleware.authenticate)
    }

    private handleRoutes() {

        this.app.use("/api", indexRouter)

    }
    private handleErrors(): void {
        this.app.use(errorHandler);
    }

    private handleProcessSignals(): void {
        process.on('SIGTERM', () => {
            redisClient.getClient().quit()
            appLogger.info("redis", "Successfully disconnected.");
            appLogger.info('event ', 'SIGTERM received. Shutting down gracefully.');
            process.exit();
        });

        process.on('SIGINT', () => {
            redisClient.getClient().quit()
            appLogger.info("redis", "Successfully disconnected.");
            appLogger.info(
                'event ', 'SIGINT (Ctrl+C) received. Shutting down gracefully.'
            );
            process.exit();
        });

        process.on('uncaughtException', (err: Error) => {
            appLogger.error('process ', `Uncaught exception: ${err.message}`);
        });

    }
    private listen() {
        this.app.listen(appConfig.app.port, () => {
            appLogger.info("server", `App is running at ${appConfig.app.port}`)
        })
    }
}


export const server = Server.getInstance()



