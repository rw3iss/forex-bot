export const orZero = (n, def = 0) => {
    if (typeof n == 'string') {
        n = parseFloat(n);
    }

    if (Number.isNaN(n)) {
        return typeof def != 'undefined' ? def : 0;
    } else if (!Number.isFinite(n)) {
        return typeof def != 'undefined' ? def : 0;
    }

    return n;
}