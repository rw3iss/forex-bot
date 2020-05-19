import AppState        from './AppState';
import Module          from './modules/Module';
import TrendModule     from 'src/client/modules/trends/TrendModule';
import AppDataProvider from './AppDataProvider';
import {Pip} from "./modules/trends/Pip";

const DEFAULT_TICK_INTERNAL = 5000;

export default class App {

	appState: AppState;

	modules: Array<Module>;

	dataProvider: AppDataProvider;

	constructor() {
		this.appState = new AppState();
		this.loadModules();
		this.init();
	}

	loadModules() {
		this.modules = new Array<Module>();
		this.registerModule(new TrendModule());
	}

	init() {
		const self = this;
		console.log("App:init");

		// Todo: do this elsewhere
		this.dataProvider = new AppDataProvider();

		this.dataProvider.getData().subscribe(data => {
			// add data update to app state
			this.appState.allData.push(data);

			self.onTick(DEFAULT_TICK_INTERNAL, data, this.appState.allData);
		});
	}

	registerModule(module) {
		if (module.onInit) {
			module.onInit();
		}
		this.modules.push(module);
	}

	// passes changes to each module
	onTick(d: number, newData: Pip, allData: Array<Pip>) {
		console.log('App tick', newData, allData);
		this.modules.forEach(m => {
			m.onTick(d, newData, allData);
		});

	}

}
