import { orZero } from "./numUtils";

const calculateSlope = (start, end) => orZero((end.price - start.price) / ((end.time - start.time) / 1000)); // divide by 1000 to convert time to seconds

/**
 * @description Analyzes data, from the last slope end time, to current tick.
 * If the current tick and two previous are both the same direction, nothing happens.
 * If the current tick is in a different direction than the last two, a new slope trend is established.
 * @return {*}
 */
const getSlopeChanges = (data) => {
    //console.log(`getSlopeChanges`)
    const slopes: any = [];
    if (data.length <= 1) return slopes; // need at least two new ticks

    let startIndex = 0;
    let endIndex = data.length - 1;

    // if (slopes.length > 0) {
    //     const lastTrend = slopes[slopes.length - 1];
    //     startTime = lastTrend.endTime;
    //     startIndex = data.findIndex(d => d.time === lastTrend.endTime);
    //     direction = lastTrend.direction;
    // }
    //if (startIndex > endIndex - 2) return slopes; // need at least two new ticks
    console.log(`END`, data[endIndex])

    for (let s = startIndex, e = startIndex + 1; s <= endIndex && e <= endIndex; e++) {
        //console.log(`calculateSlope`, s, e - 1, data[s], data[e - 1])
        const prevSlope = calculateSlope(data[s], data[e - 1]);
        const prevDir = prevSlope == 0 ? 'flat' : prevSlope > 0 ? 'positive' : 'negative';
        //console.log(`calculateSlope`, e - 1, e, data[e - 1], data[e])
        const currSlope = calculateSlope(data[e - 1], data[e]);
        const currDir = currSlope == 0 ? 'flat' : currSlope > 0 ? 'positive' : 'negative';
        if (currDir == 'flat') continue;
        if (currDir != prevDir) {
            const slope = {
                startTime: data[s].time,
                startPrice: data[s].price,
                endTime: data[e - 1].time,
                endPrice: data[e - 1].price,
                direction: prevDir
            }
            slopes.push(slope);
            // move to new area
            s = e - 1;
        }
    }

    //console.log(`SLOPES:`, slopes);
    return slopes;

    // for (let i = startIndex; i < data.length - 1; i++) {
    //     const currentSlope = calculateSlope(data.slice(i));
    //     if (direction === undefined) {
    //         direction = currentSlope > 0 ? 'positive' : 'negative';
    //     } else if (direction === 'positive' && currentSlope < 0) {
    //         const newTrend = {
    //             startTime: data[i].time,
    //             startPrice: data[i].price,
    //             endTime: data[data.length - 1].time,
    //             endPrice: data[data.length - 1].price,
    //             direction: 'negative'
    //         }
    //         console.log(`ADD TREND:`, newTrend)
    //         slopes.push(newTrend);
    //         direction = 'negative';
    //     } else if (direction === 'negative' && currentSlope > 0) {
    //         const newTrend = {
    //             startTime: data[i].time,
    //             startPrice: data[i].price,
    //             endTime: data[data.length - 1].time,
    //             endPrice: data[data.length - 1].price,
    //             direction: 'positive'
    //         }
    //         console.log(`ADD TREND:`, newTrend)
    //         slopes.push(newTrend);
    //         direction = 'positive';
    //     }
    // }
}

export default getSlopeChanges;