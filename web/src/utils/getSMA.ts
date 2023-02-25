

/**
 * @description calculateSMA = get standard moving average of price in period
 * @export
 * @param {*} data = currency data
 * @param {*} period = # of ticks
 * @return {*}
 */
export default function getSMA(data, period) {
    var sum = 0;
    for (var i = 0; i < period; i++) {
        sum += data[i].price;
    }
    var sma = sum / period;

    var smaData = [sma];
    for (let i = period; i < data.length; i++) {
        sma = (sma * (period - 1) + data[i]) / period;
        smaData.push(sma);
    }
    return smaData;
}