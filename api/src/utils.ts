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