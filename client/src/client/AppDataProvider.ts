import { ReplaySubject } from 'rxjs';
import { Pip } from "./modules/trends/Pip";

// Clients can subscribe to this to receive updated/latest data when it "ticks"

export default class AppDataProvider {

    dataFeed: ReplaySubject<any> = new ReplaySubject<any>();

    getData(): ReplaySubject<any> {
        const self = this;

        let count = 0;
        // ask for current data
        setInterval(() => {

            let pip = new Pip();
            pip.low = pip.open = count;
            pip.high = pip.close = ++count;
            self.dataFeed.next(pip);

        }, 5000);

        return this.dataFeed;
    }

}
