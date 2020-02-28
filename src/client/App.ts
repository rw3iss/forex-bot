import AppState from './AppState';
import Module from './modules/Module';
import TrendModule from 'src/client/modules/TrendModule';
import AppDataProvider from './AppDataProvider';

// Encapsulates entire application state and functionality
const DEFAULT_TICK = 5000;

export default class App {

    appState: AppState;

    modules: Array<Module>;

    dataProvider: AppDataProvider;

    constructor() {
        console.log('new App');
        this.appState = new AppState();
        this.modules = new Array<Module>();
        this.dataProvider = new AppDataProvider();
    }

    init() {
        const self = this;
        // Todo: do this elsewhere
        this.registerModule(new TrendModule());

        this.dataProvider.getData().subscribe(data => {
            console.log('DATA UPDATE', data);
            self.onTick(data, DEFAULT_TICK);
        });
    }

    registerModule(module) {
        this.modules.push(module);
    }

    // passes changes to each module
    onTick(newData, interval: number) {
        console.log('App tick', newData);

        this.modules.forEach(m => {
            m.onTick(newData, interval);
        });

    }

}
