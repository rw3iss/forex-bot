const fs = require('fs');
const path = require('path');
import { pollData } from "./utils";

const DATA_FILE = path.resolve('../data/data.json');
const TICK_INTERVAL = 5000; // 5 seconds

let currencyData: any = [];
let supportRegions: any = [];
let slopeTrends: any = [];

const processData = (t) => {
    console.log(`TICK`, t);
    currencyData.push(t);
    //checkForSupportRegions();
    //checkForSlopeChanges();
}

////////////////////////////////////////

// ensure init stuff
const init = () => {
    let folder = path.dirname(DATA_FILE);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    loadData();
}

const loadData = () => {
    try {
        console.log(`loadData`)
        if (fs.existsSync(DATA_FILE)) {
            console.log(`loading...`)
            const data = JSON.parse(fs.readFileSync(DATA_FILE));
            console.log(`data`, data)
            if (data.currencyData) currencyData = data.currencyData;
            if (data.slopeTrends) slopeTrends = data.slopeTrends;
            if (data.supportRegions) supportRegions = data.supportRegions;
        } else {
            console.log(`File doesn't exist: ${DATA_FILE}`);
        }
    } catch (err) {
        console.log(`Error loading previous data:`, err)
    }
}

const saveData = () => {
    const data = {
        currencyData,
        slopeTrends,
        supportRegions
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data), { encoding: 'utf8', flag: 'w' }, (err) => {
        console.log(`Error saving data:`, err);
    });
}

// Infinite loop to fetch stock data every 5 seconds
const mainLoop = async () => {
    console.log(`mainLoop`)
    while (true) {
        const r = await pollData();

        processData(r);

        saveData();

        await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
    }
}

init();
mainLoop();