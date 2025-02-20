import Redis from './classes/Redis';
import { err } from './loggers/logger';

export const redisInstance = new Redis({url: GetConvar('redis_url', 'redis://127.0.0.1:6379')});

const prototype = Object.getPrototypeOf(redisInstance);
const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (method) => method !== 'constructor' && typeof prototype[method] === 'function'
);

methodNames.forEach((method) => {
    global.exports(method, async (callback: Function, ...args: any) => {
        try {
            const data = await (redisInstance as any)[method](...args);
            if(typeof callback == 'function') {
                callback(data);
            }

        } catch(excp: any) {
            err('Calling function ' + method + ' failed. ' + excp.message);
            if(typeof callback == 'function') {
                callback(null, excp.message);
            }
            return null;
        }
    });
});
