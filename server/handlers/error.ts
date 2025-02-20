import { err } from '../loggers/logger';

export default function handleError(error: Error) {
    err(error.message);
}