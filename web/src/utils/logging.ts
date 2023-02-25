/* Usage:
    import { getLogger } from 'lib/utils/logging';
    const { log, warn } = getLogger('somename');
    log('something', ...); // will log/show if enabled
    warn('something', ...); // will always log/show
*/
export const DEFAULT_LOG_COLOR = 'yellow';

export const Colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    BGblack: "\x1b[40m",
    BGred: "\x1b[41m",
    BGgreen: "\x1b[42m",
    BGyellow: "\x1b[43m",
    BGblue: "\x1b[44m",
    BGmagenta: "\x1b[45m",
    BGcyan: "\x1b[46m",
    BGwhite: "\x1b[47m",
};

export function color(color, str) {
    let cs = color.indexOf('\x1b') >= 0 ? color : Colors[color];
    return `${cs}${str}${Colors['reset']}`;
}

let loggers = {};
/**
 * @description Retrieve a logger by name.
 * @param {string} [namespace='']
 * @param {*} [opts={}]
 * @return {*}
 */
export const getLogger = function (namespace = '', opts: any = {}) {
    let l = loggers[namespace];
    if (!l) {
        l = new Logger(
            namespace,
            opts.color || DEFAULT_LOG_COLOR,
            (typeof opts.enabled != 'undefined' ? opts.enabled : true)
        );
        loggers[namespace] = l;
    }
    return l;
}

///////////////////////////////////////////
// this is is sort of a browser-only feature atm.
let windowParams;
let isLogAllMode = false;
let logOnly = undefined;
if (typeof window != 'undefined' && typeof URLSearchParams != 'undefined') {
    windowParams = new URLSearchParams(window.location.search);
    if (windowParams.get('logAll')) {
        let logWhat = windowParams.get('logAll');
        if (logWhat == 'true') {
            isLogAllMode = true;
        } else if (logWhat && logWhat != 'true') {
            isLogAllMode = true;
            logOnly = logWhat.split(',');
        }
    }
}

/**
 * @description Debugs logs/arguments to a specific namespace (first parameter), or default/global.
 * @param {*} args
 */
export const log = function (...args) {
    const namespace = args.length > 1 ? args[0] : '';
    args = args.length > 1 ? args.slice(1, args.length) : [];
    let l = getLogger(namespace);
    if (l) {
        // log if normal mode, and logger is enabled, or log if it is globally-enabled
        if ((!isLogAllMode && l.enabled) ||
            (isLogAllMode && (!logOnly || logOnly.includes(namespace)))) {
            let la = [...args];
            if (namespace) {
                la.unshift(`${Colors[l.color] || Colors[l.black]}${namespace || '(no namespace)'}:${Colors["reset"]}`);
            }
            console.log.apply(console, la);
        }
    } else {
        console.log(`Log:`, args);
    }
}

/**
 * @description Debugs logs/arguments to a specific namespace (first parameter), or default/global.
 * @param {*} args
 */
export const warn = function (...args) {
    const namespace = args.length > 1 ? args[0] : '';
    args = args.length > 1 ? args.slice(1, args.length) : [];
    let l = getLogger(namespace);
    if (l) {
        let la = [...args];
        if (namespace) {
            la.unshift(`${Colors[l.color] || Colors[l.black]}${namespace || '(no namespace)'}:${Colors["reset"]} ⚠️ Warning:`);
        }
        console.log.apply(console, la);
    } else {
        console.log(`Warning:`, args);
    }
}

/**
 * @description Shortcut to determine if we're okay to dev.
 * @return {*}
 */
export const IS_DEV = () => {
    return process.env.NODE_ENV != 'production';
}


/**
 * @description A Logger that utilizes the global log() method, and adds fancy stuff like colors, namespacing, and configuration.
 * @export
 * @class Logger
 */
export class Logger {
    namespace = '';
    color = 'yellow';
    enabled = true;

    public constructor(namespace, color = DEFAULT_LOG_COLOR, enabled = true) {
        this.namespace = namespace;
        this.color = color;
        this.enabled = enabled;
    }

    // todo: should pass itself or use .call?
    public log = (...args) => {
        log(this.namespace, ...args);
        return this;
    }

    // this is like log, but it will show it always
    public warn = (...args) => {
        warn(this.namespace, ...args);
        return this;
    }

    public setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }
}