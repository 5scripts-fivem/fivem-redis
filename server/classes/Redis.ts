import ioredis from 'ioredis';
import registerHandlers from '../handlers/handler';

export default class Redis {
    private redisClient: ioredis;

    constructor(options = {}) {
        this.redisClient = new ioredis({
            retryStrategy: (times) => {
                const delay = Math.min(times * 5000, 25000);
                return delay;
            },
            ...options
        });

        registerHandlers(this.redisClient);
    }

    /**
     * Gets the Redis client, mostly meant for internal usage.
     * @returns {ioredis} Redis client
     */
    getClient(): ioredis {
        return this.redisClient;
    }

    /**
     * Clears all keys in the database.
     */
    async flushAllKeys(): Promise<void> {
        await this.redisClient.flushall();
    }

    /**
     * Checks if Redis client status is ready.
     * @returns {boolean} Whether the Redis client is ready or not
     */
    isReady(): boolean {
        return this.redisClient.status === 'ready';
    }

    /**
     * Handler for when Redis client is ready.
     * @param callback Function to be called when Redis client is ready
     */
    onReady(callback: Function): void {
        if (this.isReady()) {
            callback();
        } else {
            this.redisClient.on('ready', () => {
                callback();
            });
        }
    }

    /**
     * Set's a value in Redis.
     * @param key Key to set
     * @param value Value to set
     * @param expiration Expiration time in milliseconds (optional)
     * @returns Whether operation is successful or not
     */
    async set(key: string, value: string|number|object, expiration: number|null = null): Promise<boolean> {
        try {
            if(typeof value == 'object') {
                value = JSON.stringify(value);
            }
            if(expiration) {
                await this.redisClient.set(key, value, 'PX', expiration);
            } else {
                await this.redisClient.set(key, value);
            }
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Retrieves a value from Redis.
     * @param key Key to retrieve
     * @returns Value of the key, or false if operation failed
     */
    async get(key: string): Promise<string|null|boolean> {
        try {
            return await this.redisClient.get(key);
        } catch {
            return false;
        }
    }

    /**
     * Delete's a key with its value from Redis.
     * @param key Key to delete
     * @returns 
     */
    async delete(key: string): Promise<number|boolean> {
        try {
            return await this.redisClient.del(key);
        } catch {
            return false;
        }
    }

    /**
     * Sets a temporary key in Redis (useful for locks).
     * @param key Key to add
     * @param value Value of the key
     * @param expiration Expiration time in milliseconds (defaults to 5000ms)
     * @returns If operation succeeded
     */
    async setTemporary(key: string, value: string|number|object, expiration: number = 5000): Promise<boolean> {
        return await this.set(key, value, expiration);
    }

    /**
     * Increments a value in Redis.
     * @param key Key to increment
     * @returns New value, or false if operation failed
     */
    async increment(key: string): Promise<number|boolean> {
        try {
            return await this.redisClient.incr(key);
        } catch {
            return false;
        }
    }

    /**
     * Decrements a value in Redis.
     * @param key Key to decrement
     * @returns New value, or false if operation failed
     */
    async decrement(key: string): Promise<number|boolean> {
        try {
            return await this.redisClient.decr(key);
        } catch {
            return false;
        }
    }

    /**
     * Pushes a value to a list of key.
     * @param listName Key of the list
     * @param value Value to push
     * @returns New length of the list, or false if operation failed
     */
    async pushToList(listName: string, value: string|number): Promise<number|boolean> {
        try {
            return await this.redisClient.rpush(listName, value);
        } catch {
            return false;
        }
    }

    /**
     * Pops a value from a list of key.
     * @param listName Key of the list
     * @returns Value of the popped value, or false if operation failed
     */
    async popFromList(listName: string): Promise<string|null|boolean> {
        try {
            return await this.redisClient.lpop(listName);
        } catch {
            return false;
        }
    }

    /**
     * Retrieves list of values from a given key.
     * @param listName Key of the list
     * @returns List of present values, or false if failed
     */
    async getList(listName: string): Promise<string[]|boolean> {
        try {
            return await this.redisClient.lrange(listName, 0, -1);
        } catch {
            return false;
        }
    }

    /**
     * Tries to acquire a lock
     * @param lockName Key of the lock
     * @param duration Duration of the lock in milliseconds, defaults to 5000
     * @returns If lock was acquired (false - already locked/failed, true - lock acquired)
     */
    async tryToAcquireLock(lockName: string, duration: number = 5000): Promise<boolean> {
        if(await this.get(lockName) !== null)
            return false;
        
        const result = await this.set(lockName, '1', duration);
        return result;
    }

    /**
     * Tries to acquire a lock for a player
     * @param name Key of the lock
     * @param playerSource Player source
     * @param duration Duration of the lock in milliseconds, defaults to 5000
     * @returns If lock was acquired (false - already locked/failed, true - lock acquired)
     */
    async tryToAcquireLockForPlayer(name: string, playerSource: string, duration: number = 5000): Promise<boolean> {
        return await this.tryToAcquireLock(name+'_player:'+playerSource, duration);
    }

    /**
     * Tries to relase a lock
     * @param lockName Key of the lock
     * @returns If lock was released (false - failed, true - released)
     */
    async releaseLock(lockName: string): Promise<boolean> {
        try {
            await this.delete(lockName);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Tries to release a lock for a player
     * @param name Key of the lock
     * @param playerSource Player source
     * @returns If lock was released (false - failed, true - released)
     */
    async releaseLockForPlayer(name: string, playerSource: string): Promise<boolean> {
        return await this.releaseLock(name+'_player:'+playerSource);
    }
}