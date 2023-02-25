import * as fs from 'fs';
import * as path from 'path';

// Finds the inner most error
export const getInnerError = (e) => {
    if (!e) return undefined;
    if (typeof e == 'string') return e;
    if (Array.isArray(e)) return e.map(_e => getInnerError(_e)).join(', ');
    // leave these separate so it recursesq through to each to always ensure a message can be found.
    return getInnerError(e.error) ||
        getInnerError(e.errors) ||
        getInnerError(e.data) ||
        getInnerError(e.response) ||
        getInnerError(e.message) ||
        getInnerError(e.result) ||
        getInnerError(e.reason) ||
        'Unknown error.';
}

// Return the given async fn method wrapped in a promise that will resolve with the result, or reject if an exception is caught.
// The purpose is to keep common method interface less verbose.
export const rethrowPromise = <T>(fn): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await fn());
        } catch (e) {
            return reject(e);
        }
    });
};

export const readFile = (filepath: string): Promise<{}> => {
    return rethrowPromise<{}>(() => {
        if (!fs.existsSync(filepath)) throw `File does not exist: ${filepath}`;
        console.log(`loading ${filepath}...`)
        const text = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(text);
    });
};

export const writeFile = (filename, data): Promise<string> => {
    return rethrowPromise<string>(() => {
        const filepath = path.resolve(filename);
        console.log(`writeFile: ${filepath}`)
        fs.writeFileSync(filepath, JSON.stringify(data, undefined, 4), { encoding: 'utf8', flag: 'w' });
        console.log(`Written to file: ${filepath}`)
        return filepath;
    });
};

export const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}