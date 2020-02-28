import { ReplaySubject } from 'rxjs';

// Clients can subscribe to this to receive updated/latest data when it "ticks"

export default class AppDataProvider {

    dataFeed: ReplaySubject<any> = new ReplaySubject<any>();

    getData(): ReplaySubject<any> {
        const self = this;
        let count = 0;
        // ask for current data
        setInterval(() => {
            self.dataFeed.next(count++);
        }, 5000);

        return this.dataFeed;
    }

  }
