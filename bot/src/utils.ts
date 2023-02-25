
const request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");

const DATA_URL = 'https://finance.yahoo.com/currencies/';

export const pollData = () => {
    return new Promise((resolve, reject) => {
        request(DATA_URL, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const tableRows = $('table tr');
                tableRows.each((i, row) => {
                    const symbol = $(row).find('td:nth-child(2)').text();
                    const price = $(row).find('td:nth-child(3)').text();
                    if (symbol && price) {
                        const time = Date.now();
                        const r = {
                            symbol,
                            price,
                            time
                        };
                        resolve(r);
                    }
                });
            } else {
                return reject(error);
            }
        });
    });
}

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