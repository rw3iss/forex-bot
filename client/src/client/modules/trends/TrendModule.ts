import Module from '../Module';
import { Trend } from "./Trend";
import {BufferStrategy, Direction, ForexUtils} from "src/client/utils/ForexUtils";
import {Pip} from "./Pip";

// At least this many pips in a trend before action will take place related to that trend
const MIN_TREND_SIZE_FOR_ACTION = 3;

// Minimum deviation from the previous trend low or high before evoking an action
const MIN_VOLUME_FOR_ACTION = 3;

// Number of ticks to wait before entering new actions
const MIN_ACTION_WAIT = 3;

// Strategy used to calculate margins
const DEFAULT_BUFFER_STRATEGY = BufferStrategy.Linear;

export default class TrendModule extends Module {

	public trends: Array<Trend>;

	public currentTrend: Trend;

	public bufferStrategy: BufferStrategy = DEFAULT_BUFFER_STRATEGY;

	constructor() {
		super();
		this.trends = new Array<Trend>();
	}

	onInit() {
	}

	onTick(d: number, newData: Pip, allData: Array<Pip>) {
		this.updateTrends(newData, allData);
	}

	private updateTrends(newData: Pip, allData: Array<Pip>) {
		let ct = this.currentTrend;

		let direction = ForexUtils.getPriceDirection(newData.open, newData.close);

		// if no current trend exists, start a new one...
		if (!ct) {

			this.startNewTrend(newData, direction, allData);

		} else {
			let margin = ForexUtils.calculateTrendBufferSize(ct, this.bufferStrategy);

			// if direction is same as current, or within margin, add to current
			if (ct.direction == direction || ct.isDataWithinBounds(newData, margin)) {

				this.appendToTrend(ct, newData);

			} else {

				this.startNewTrend(newData, direction, allData);

			}

		}

	}

	/*

		If starting a new trend, we should consider taking an action (ie. buy or sell)...
		-should only take action if trend has minimum number of pips (ie. it's moved from previous high/low enough)...
		-should only take action if newValue is MIN_VOLUME distance from previous high/low....
		-should only take action if we haven't taken any action in MIN_ACTION_THROTTLE

	 */

	// backtracks data a bit to high/low of the current trend, and adjusts values accordingly,
	// then starts a new trend at the high or low, up to the current value
	public startNewTrend(newValue: Pip, direction: Direction, allData: Array<Pip>) {

		console.log('startNewTrend', newValue);

		let ct = this.currentTrend;
		let nt = new Trend();

		if (ct) {
			// reverse in allData, until hitting high or low of current trend, then remove these value
			// from current trend, and put them in the new trend
			let removed;

			for (let i = allData.length-1; i > 0; i--) {
				let d = allData[i];

				// if trend is up and pip is the highest, or trend is down and pip is lowest, then stop.

				if (ct.direction == Direction.UP && d.high == ct.high) {

					// found high point
					removed = ct.pips.splice(i, allData.length-i);
					break;

				} else if (ct.direction == Direction.DOWN && d.low == ct.low) {

					// found low point
					removed = ct.pips.splice(i, allData.length-i);
					break;

				}
			}

			// recalculate stats of current trend with removed pips
			this.updateTrendStats(ct);

			// add removed pips to new trend
			nt.pips.push(...removed);

		}

		// add new value to trend, and recalculate trend stats:
		nt.pips.push(newValue);
		this.updateTrendStats(nt);

		this.trends.push(nt);
		this.currentTrend = nt;

		return this.currentTrend;
	}

	public appendToTrend(trend: Trend, value: Pip) {

		console.log('appendToTrend', trend, value);

		trend.pips.push(value);
		this.updateTrendStats(trend);
	}

	// looks at all pips and finds high, low, median, volume
	public updateTrendStats(trend: Trend) {
		let high = 0, low = 0, median = 0, volume = 0;

		trend.pips.forEach(p => {
			if (p.high > high) high = p.high;
			if (p.low < low) low = p.low;
		});

		trend.high = high;
		trend.low = low;
		trend.median = low + ((high-low) / 2);
		trend.volume = high-low;
		trend.direction = ForexUtils.getTrendDirection(trend);

		return trend;
	}


}
