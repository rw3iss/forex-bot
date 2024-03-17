
const request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");
const path = require('path');

const DATA_URL = 'https://finance.yahoo.com/currencies/';
const DATA_FILE = path.resolve('../data/data.json');

export default class DataService {

    private data;

    constructor() {
        let folder = path.dirname(DATA_FILE);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    public pollData = () => {
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

    public saveData = async (d) => {
        console.log(`save.`)
        fs.writeFileSync(DATA_FILE, JSON.stringify(d), { encoding: 'utf8', flag: 'w' }, (err) => {
            console.log(`Error saving data:`, err);
        });
    }

    public loadData = () => {
        try {
            console.log(`loadData`)
            if (fs.existsSync(DATA_FILE)) {
                console.log(`loading...`)
                const data = JSON.parse(fs.readFileSync(DATA_FILE));
                console.log(`data`, data)
                // if (data.currencyData) currencyData = data.currencyData;
                // if (data.slopeTrends) slopeTrends = data.slopeTrends;
                // if (data.supportRegions) supportRegions = data.supportRegions;
                this.data = data;
                return data;
            } else {
                console.log(`File doesn't exist: ${DATA_FILE}`);
            }
        } catch (err) {
            console.log(`Error loading previous data:`, err)
        }
    }
}