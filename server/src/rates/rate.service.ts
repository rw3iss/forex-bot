import {HttpService, Injectable, Logger} from '@nestjs/common';
import {Cron, Interval}                            from '@nestjs/schedule';
//import {Observable} from "rxjs";
import {JSDOM, VirtualConsole}           from 'jsdom';
import {Rate}                            from "./rate.entity";
import { Server } from 'socket.io';

const SCRAPE_URL = 'https://www1.oanda.com/currency/live-exchange-rates/';

@Injectable()
export class RateService {
	private readonly logger = new Logger(RateService.name);

	public socket: Server = null;
	public clients = [];
	
	constructor(private readonly httpService: HttpService) {
	}

    async broadcast(event, message: any) {	
		const broadCastMessage = JSON.stringify(message);
		this.socket.emit(event, broadCastMessage);
        // for (let c of this.clients) {
        //     c.send(event, broadCastMessage);
        // }
    }

	@Interval(5000)
	async updateRates() {
		this.logger.debug('Getting new rates...');
		let rates = await this.scrapeRates();
		this.broadcast('rate', rates);
		await this.storeRates(rates);
	}

	// makes web request for html of latest price data, parses, and returns rate.
	scrapeRates(): Promise<Array<Rate>> {

		return new Promise((resolve, reject) => {
			let time = new Date();
			let rates = new Array<Rate>();

			this.httpService.get(SCRAPE_URL).subscribe(r => {
				const virtualConsole = new VirtualConsole();
				const dom = new JSDOM(r.data, {virtualConsole, runScripts: "dangerously", pretendToBeVisual: true});

				// get interesting rates
				let rate = this._extractRate('EUR_USD', dom.window.lrrr_data, time);
				if (rate) rates.push(rate);

				resolve(rates);
			});

		})

	}

	private storeRates(rates: Array<Rate>) {
		// save to DB
		//console.log("Save rates to DB...");
	}

	// Returns a RateEntity object
	private _extractRate(basePair, json, time) {
		let rate = new Rate();

		if (!json[basePair]) return;

		rate.name = basePair;
		rate.time = time;
		rate.bid = json[basePair].bid;
		rate.ask = json[basePair].ask;

		return rate;
	}

}
