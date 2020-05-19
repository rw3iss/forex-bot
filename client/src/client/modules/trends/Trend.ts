import {buffer} from "rxjs/operators";
import { Direction } from "src/client/utils/ForexUtils";
import {Pip} from "./Pip";

export class Trend {

	public high: number;
	public low: number;
	public median: number;
	public direction: Direction;
	public volume: number;
	public pips: Array<Pip>;

	constructor() {
		this.pips = new Array<Pip>();
	}

	public isDataWithinBounds(data, bufferSize=0) {

		if ( (data < (this.high+bufferSize)) && (data > (this.low+bufferSize)) ) {
			return true;
		}

		return false;

	}

}
