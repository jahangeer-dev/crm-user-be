import mongoose from "mongoose";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { appConfig } from "@/config/readers/appConfig.js";

class MongoClient {
    private static instance: MongoClient;
    private readonly mongoUri: string;

    private constructor() {
        this.mongoUri = appConfig.db.mongoUri;
    }

    public static getInstance(): MongoClient {
        if (!MongoClient.instance) {
            MongoClient.instance = new MongoClient();
        }
        return MongoClient.instance;
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.mongoUri);
            appLogger.info("mongodb", "Connected successfully");
        } catch (err: unknown) {
            appLogger.error("mongodb", `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            appLogger.error('mongodb', 'Shutting down application due to MongoDB connection failure');
            process.exit(1); 
        }
    }
    

    public getConnection(): typeof mongoose {
        return mongoose;
    }
}

export const mongoClient = MongoClient.getInstance();