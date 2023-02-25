import * as moment from 'moment';
import * as path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import DataService, { DATE_FORMAT_STR } from './src/lib/DataService';
import { writeFile } from "./src/utils/utils";

const DATA_URL = 'https://data.forexsb.com/data-app';
const SAVE_FILE = path.resolve('../data/dataRows.json');
const MAX_PAGES = 20;

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}


async function scrapeData(symbol) {
    try {
        await DataService.connect();

        const browser: Browser = await puppeteer.launch({
            headless: false
            //slowMo: 250, // slow down by 250ms
        });
        const page: Page = await browser.newPage();

        const ranAt = Date.now();
        await page.goto(DATA_URL, { waitUntil: 'load' });
        //await page.waitForNavigation({ waitUntil: 'load' })
        await delay(500);

        // select the 'EURUSD' symbol from the dropdown
        await page.select('#select-symbol', symbol);//, { waitUntil: 'domcontentloaded' });

        // simulate a click event to the div[data-panel-switch="data-preview"] element
        await page.click('a[data-panel-switch="data-preview"]', { delay: 100 });//, { waitUntil: 'domcontentloaded' });

        // choose the option with value 'M1' from the select element with ID #select-preview-period
        await page.select('#select-preview-period', 'M1');//, { waitUntil: 'domcontentloaded' });

        // simulate a click on the 'Load data' button
        await page.click('#btn-load-data');//, { waitUntil: 'domcontentloaded' });
        await delay(2000);

        // iterate through all pages
        const numPages = await page.evaluate(async () => {
            try {
                console.log(`Evaluating page...`);
                const numPages = parseInt(document.querySelector('#paginator-last .page-link').innerHTML);
                console.log(`Num pages::`, numPages);
                return Promise.resolve(numPages);
            } catch (e) {
                throw e;
            }
        }, this);

        console.log(`Num pages:`, numPages);

        const dataRows = [];

        try {

            let currPage = 1;
            while (currPage < numPages && currPage < MAX_PAGES) {
                const rowData = await page.evaluate(async () => {
                    try {
                        const rows = Array.from(document.querySelectorAll('#panel-data-preview table tbody tr'));
                        this.console.log(`rows`, rows)
                        return rows.map((row) => {
                            const columns = Array.from(row.querySelectorAll('td'))
                            const r = {
                                time: columns[0].textContent,
                                open: columns[1].textContent,
                                high: columns[2].textContent,
                                low: columns[3].textContent,
                                close: columns[4].textContent,
                                volume: columns[5].textContent
                            };
                            return r;
                        });
                    } catch (e) {
                        this.console.log(`Exception querying page:`, e)
                        return undefined;
                    }
                }, this);

                console.log(`rowData`, rowData)
                if (rowData) {
                    // add current symbol since we're now outside context
                    dataRows.push(...rowData.map(r => ({
                        ...r,
                        symbol,
                        time: moment(r.time, DATE_FORMAT_STR).toDate()
                    })));
                }
                console.log(`Click next page: ${currPage}`)

                try {
                    await page.click('#paginator-next .page-link', { delay: 100 });
                    await delay(100);
                } catch (e) {
                    console.log(`Exception clicking next:`, e);
                    break;
                }
                currPage++;
            }
            //return Promise.resolve(dataRows);
        } catch (e) {
            console.log(`Exception evaluating page:`, e)
            //throw e;
        }

        console.log(`Done all rows: ${dataRows.length}`);

        const r = await DataService.saveDataRowsToDB(dataRows);
        console.log(`rows saved to DB.`)

        await writeFile(SAVE_FILE, { ranAt, dataRows })
        console.log(`Saved data to file: ${SAVE_FILE}`);

        await browser.close();
    } catch (e) {
        console.log(`Exception`, e)
        //throw e;
    }
}

(async () => {
    await scrapeData("EURUSD");
})();