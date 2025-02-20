import { success } from "../loggers/logger";
import { redisInstance } from "../server";

export default async function handleReady() {
    const info = await redisInstance.getClient().info();
    const match = info.match(/redis_version:(\d+\.\d+\.\d+)/);
    const version = match ? match[1] : 'unknown';
    success('['+version+'] Successfuly connected to Redis server!');
}