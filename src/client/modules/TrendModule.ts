import Module from './Module';

export default class TrendModule extends Module {

	constructor() {
		super();
		// init trends...
	}

	onInit() {
		console.log('Trend module init...');
	}

	onTick(d: number, newData, allData) {
		console.log('Trend module tick...');
	}

}
