import {Pip} from "../modules/trends/Pip";
import {Trend} from "../modules/trends/Trend";

export enum Direction {
	UP = 0,
	DOWN = 1
}

export enum BufferStrategy {
	Linear = 0,
	Exponential = 1,
	GoldenRatio = 2
}

// Percentage/ratio of how much volume outside of a trend region before considering starting new trends
export const DEFAULT_TREND_BUFFER_FACTOR = 1.15;

// Volume amount minimum movement before considering starting new trend, regardless of the buffer
export const MIN_TREND_BUFFER_SIZE = 1;

export class ForexUtils {

	// look at close of previous, and open of new?
	static getPriceDirection(newPrice: number, prevPrice: number): Direction {

		if (newPrice < prevPrice) {
			return Direction.DOWN;
		} else {
			return Direction.UP;
		}

	}

	static getPipDirection(newData: Pip, prevData: Pip): Direction {

		if (newData.close < prevData.close) {
			return Direction.DOWN;
		} else {
			return Direction.UP;
		}

	}

	// just compares first pip with last pip in the trend
	static getTrendDirection(trend: Trend): Direction {
		console.log("get trend direction", trend, trend.pips[0], trend.pips[trend.pips.length-1].low);

		if (trend.pips[0].low < trend.pips[trend.pips.length-1].low) {
			return Direction.UP;
		} else {
			return Direction.DOWN;
		}

	}

	// Returns a modified volume amount relative to the trend volume size, based on the given BufferStategy
	static calculateTrendBufferSize(trend: Trend, strategy: BufferStrategy): number {

		// v = volume size of trend, m = multiplier
		let bsFn = function(v) { return v * DEFAULT_TREND_BUFFER_FACTOR; };

		switch(strategy) {

			// User default multiplier
			case BufferStrategy.Linear:
				// bsFn = function(v) { return v * DEFAULT_TREND_BUFFER_FACTOR; };
				break;

			// Buffer = volume raised to some exponent
			case BufferStrategy.Exponential:
				bsFn = function(v) { return Math.pow(v, DEFAULT_TREND_BUFFER_FACTOR); };
				break

			// Buffer = .618 size of trend
			case BufferStrategy.GoldenRatio:
				bsFn = function(v) { return v * .618; };
				break;
		}

		let bs = bsFn(trend.volume);
		if (bs < MIN_TREND_BUFFER_SIZE) bs = MIN_TREND_BUFFER_SIZE;

		return bs;
	}

}
