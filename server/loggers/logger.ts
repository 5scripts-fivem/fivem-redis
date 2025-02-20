export const loggerSuffix = '^4[fivem-redis] ^5';

export function err(message: string) {
    cleanLog(loggerSuffix + '^8ERR: ^1' + message);
}

export function warn(message: string) {
    cleanLog(loggerSuffix + '^3WARN: ' + message);
}

export function info(message: string) {
    cleanLog(loggerSuffix + message);
}

export function success(message: string) {
    cleanLog(loggerSuffix + '^2' + message);
}

export function cleanLog(message: string) {
    console.log(message + '^0')
}