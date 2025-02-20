import ioredis from 'ioredis';
import handleError from "./error";
import handleReady from "./ready";

export default function registerHandlers(client: ioredis) {
    client.on('error', handleError);
    client.on('ready', handleReady);
}