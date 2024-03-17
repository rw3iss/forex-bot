import DataService from "./DataService";


/**
 * @description Bot manager, controls to load and poll data, start and stop bot.
 * @export
 * @class Bot
 */
export default class Bot {

    private isEnabled = false;
    private dataService: DataService;
    private pollFreqMs = 1000;

    constructor() {
        console.log(`new Bot()`)
        this.dataService = new DataService();
    }

    public async start() {
        this.isEnabled = true;

        while (this.isEnabled) {
            try {
                await this._tickBot();
                await this._checkFlags();
            } catch (e) {
                console.error(`Exception in bot loop: `, e);
            }
        }
    }


    public stop() {
        this.isEnabled = false;
    }

    // run routines and gather data, process...
    private async _tickBot() {
        console.log(`tick.`)
        const r = await this.dataService.pollData();

        // save to db, and store

        await this.dataService.saveData(r);

        await new Promise(resolve => setTimeout(resolve, this.pollFreqMs));
    }

    private _checkFlags() {
        //if (true) { this.isEnabled = false; }
    }

}