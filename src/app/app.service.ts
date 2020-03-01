import { Injectable } from '@angular/core';
import App            from 'src/client/App';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	app: App | undefined;

	constructor() {
		console.log('construct app.service');
	}

	getAppInstance() {
		if (this.app === undefined) {
			this.app = new App();
			this.app.init();
		}
		return this.app;
	}

}
