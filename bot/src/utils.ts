
const fs = require("fs");

// Function to calculate difference between smallest and largest price in last 5 minutes
export const calculatePriceDifference = (currencyData, duration) => {
    const currentTime = Date.now();
    const dataFromLastDuration = currencyData.filter(data => (currentTime - currencyData.time) <= (duration * 60000));
    const prices = dataFromLastDuration.map(data => currencyData.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return maxPrice - minPrice;
}


export const mkDirSync = (dir) => {
    if (fs.existsSync(dir)) return;
    try {
        fs.mkdirSync(dir);
    } catch (err) {
        console.log(`Error making dir: `, err);
        // if (err.code == 'ENOENT') {
        //     mkDirSync(path.dirname(dir))
        //     mkDirSync(dir)
        // }
    }
}

export const debug = (...args) => {
    //console.log(...args);
}

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