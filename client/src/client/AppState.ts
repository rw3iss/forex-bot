import {Pip} from "./modules/trends/Pip";

export default class AppState {

	allData: Array<Pip>;

	constructor() {
		this.allData = new Array<Pip>();
	}

}
