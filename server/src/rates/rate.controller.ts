import {Controller, Get} from '@nestjs/common';
import {RateService}     from './rate.service';

@Controller()
export class RateController {

	constructor(private readonly rateService: RateService) {
	}

	@Get('/rates')
	async getRates(): Promise<any[]> {
		console.log("getRates");
		let rates = await this.rateService.scrapeRates();
		return rates;
	}

}
