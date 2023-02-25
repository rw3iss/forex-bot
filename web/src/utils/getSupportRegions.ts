import { orZero } from "./numUtils";

const getMin = (data: Array<any>, startIndex, endIndex) => Math.min(...data.slice(startIndex, endIndex).map(d => d.price));
const getMax = (data: Array<any>, startIndex, endIndex) => Math.max(...data.slice(startIndex, endIndex).map(d => d.price));

const getMinMaxVolAvg = (data: Array<any>, startIndex, endIndex) => {
    const ds: Array<any> = data.slice(startIndex, endIndex + 1).map(d => parseFloat(d.price));
    //console.log(`getMinMaxVolAvg`, startIndex, endIndex, ds)
    const avg = orZero(ds.reduce((p, c) => p + c, 0) / ds.length);
    const min = Math.min(...ds);
    const max = Math.max(...ds);
    return { min, max, avg, vol: max - min }
}

/**
 * @description Go through data and find when the current price fluctuates outside
 * the margin of the previous data values, of at least minTicks length, since the last region, or the beginning.
 * tickResolution = ms of tick
 * @return {*}
 */
const getSupportRegions = (data, tickResolution, margin = .2, minTicks = 4, minVolume = .0001, maxVolume = .001) => {
    console.log(`getSupportRegions`)
    const regions: any = [];
    if (data.length < minTicks) return regions; // need at least two new ticks
    /*

    Start at startIndex+minTicks, and go backwards:
    -for each tick, keep:

    and count back to minTicks, taking the average, min, max, and volume.

    Keep going
    If the diff is > minVolume, and < maxVolume, consider it for support region:

    */

    let startIndexRegion = 0;
    let endIndexRegion = 1;
    let endIndex = data.length - 1;
    let regionTicks = endIndexRegion - startIndexRegion;

    let currRegion: any = undefined;
    // {
    //     startIndex: startIndex,
    //     endIndex: endIndex,
    //     startTime: regionStartTime,
    //     endTime: regionEndTime,
    //     startPrice: data[startIndex].price,
    //     endPrice: data[endIndex].price,
    //     minPrice,
    //     maxPrice
    // }

    for (let i = endIndexRegion + 1; i < endIndex && endIndexRegion < endIndex; i++) {
        // current region stats
        const { min, max, vol, avg } = getMinMaxVolAvg(data, startIndexRegion, endIndexRegion);
        const curr = data[i];
        const start = data[startIndexRegion];
        const end = data[endIndexRegion];
        let considerRegion = false;

        // if (min != max) {
        //     console.log(`R`, { min, max, vol, avg })
        // }

        if (vol > minVolume && vol < maxVolume) {
            console.log(`CONSIDER`);
            considerRegion = true;
            // if it is valid (within margin), increment end of window:
            //endIndexRegion++;
            //console.log(`move end of window: [${startIndexRegion}, ${endIndexRegion}]`)
        }

        if (considerRegion) {
            if (curr.price < max && curr.price > min) {
                console.log(`Tick within previous volume.`)
                endIndexRegion++;
            } else if (
                // if within margin outside the current region
                (curr.price > max && (curr.price < (max + (max * margin)))) ||
                (curr.price < min && (curr.price > (min - (min * margin))))) {
                console.log(`Tick within ${margin * 100}% outside previous volume.`);
                if (
                    (curr.price > max && (vol + curr.price < maxVolume)) ||
                    (curr.price > max && (vol + curr.price < maxVolume))) {
                    endIndexRegion++;
                    // continue...
                } else {
                    console.log(`Tick is outside max volume`);
                    // move whichever end has smallest volume difference
                    const startDiff = Math.abs(start.price - data[startIndexRegion + 1].price);
                    const endDiff = Math.abs(end.price - data[endIndexRegion - 1].price);
                    if (startDiff > endDiff) {
                        // remove start from window:
                        startIndexRegion++;
                    } else {
                        // TODO: cut a new region up until the endIndexRegion-1 if > maxTicks
                        endIndexRegion++;
                    }
                }
            } else {

            }

            // make a new region if none, and min ticks
            if (regionTicks >= minTicks) {
                if (!currRegion) {
                    console.log(`START NEW REGION`, startIndexRegion, endIndexRegion)
                    currRegion = {};
                } else {
                    console.log(`INCREASE REGION`, startIndexRegion, endIndexRegion)
                    currRegion.startIndex = startIndexRegion;
                    currRegion.endIndex = endIndexRegion;
                    currRegion.startTime = start.time;
                    currRegion.endTime = end.time;
                    currRegion.startPrice = start.price;
                    currRegion.endPrice = end.price;
                    currRegion.minPrice = min;
                    currRegion.maxPrice = max;
                    currRegion.volume = vol;
                    currRegion.average = avg;
                }

            }

        }

        regionTicks = endIndexRegion - startIndexRegion;

        // if the current to previous tick change was WITHIN our previous min/max values, or otherwise within 20% OUTSIDE of it, and the volume is still within maxVolume, then add it to to the current region.

        // if the region breaks these rules:
        //    -analyze if the previous area is worth making/finalizing a new region (todo)
        //    -move the front of the region and continue

        if (considerRegion && regionTicks >= minTicks) {
            // if the region is more than min ticks, start a new region:
            if (!currRegion) {
                console.log(`START NEW REGION`, startIndexRegion, endIndexRegion)
                currRegion = {};
            } else {
                console.log(`Update region `)
            }
            currRegion.startIndex = startIndexRegion;
            currRegion.endIndex = endIndexRegion;
            currRegion.startTime = start.time;
            currRegion.endTime = end.time;
            currRegion.startPrice = start.price;
            currRegion.endPrice = end.price;
            currRegion.minPrice = min;
            currRegion.maxPrice = max;
            currRegion.volume = vol;
            currRegion.average = avg;
        }

    }

    console.log(`REGIONS`, regions)

    // // if the last tick change is outside the margin of the entire region, consider the region to have ended and store it
    // const priceDiffLast = endIndex > 0 ? Math.abs(data[endIndex].price - data[endIndex - 1].price) : 0; //maxPrice - minPrice;
    // if (priceDiffLast && priceDiffLast / priceDiffTotal <= margin) {
    //     console.log(`Stable region found: Start Time - ${regionStartTime} | Start Price - ${data[startIndex].price} | End Time - ${regionEndTime} | End Price - ${data[endIndex].price}`);
    //     regions.push({
    //         startIndex: startIndex,
    //         endIndex: endIndex,
    //         startTime: regionStartTime,
    //         endTime: regionEndTime,
    //         startPrice: data[startIndex].price,
    //         endPrice: data[endIndex].price,
    //         minPrice,
    //         maxPrice
    //     });
    // }

    return regions;
}

export default getSupportRegions;