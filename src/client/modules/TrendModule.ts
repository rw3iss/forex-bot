import Module from './Module';

export default class TrendModule extends Module {

    constructor() {
        super();
        // init trends...
    }

    onInit() {
        console.log('Trend module init...');
    }

    onTick(newData, interval: number) {
        console.log('Trend module tick...');
    }

}
