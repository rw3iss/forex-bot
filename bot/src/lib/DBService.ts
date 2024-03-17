import mongoose from 'mongoose';
import ForexData from "./ForexData";

const DB_CONNECTION_STRING = 'mongodb://localhost/forexdata';
export const DATE_FORMAT_STR = "YYYY-MM-DD HH:mm";

/**
 * @description Simple way to persist data to Mongo DB.
 * @class DBService
 */
class DBService {

    constructor() {
    }

    public async connect() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(`Connecting to DB: ${DB_CONNECTION_STRING}`);
                await mongoose.connect(DB_CONNECTION_STRING);
                console.log(`DBService connected: ${DB_CONNECTION_STRING}`)
                return resolve(true);
            } catch (e) {
                reject(e);
            }
        });

    }

    public async saveData(data) {
        try {
            const result = await ForexData.bulkWrite(
                data.map(item => ({
                    updateOne: {
                        filter: { time: item.time, symbol: item.symbol },
                        update: item,
                        upsert: true
                    }
                }))
            );
            console.log(`Saved ${result.nModified} out of ${data.length} data points.`);
        } catch (error) {
            console.error(error);
        }
    }

    // Method to save dataRows to the mongoose ForexData table
    public async saveDataRowsToDB(dataRows) {
        try {
            // Find if there are existing data for the same time
            const existingData = await ForexData.find({ time: { $in: dataRows.map(data => data.time) } });
            const existingDataMap = existingData.reduce((map, data) => {
                map[data.time.toISOString()] = data;
                return map;
            }, {});
            const newDataRows = dataRows.filter(data => !existingDataMap[data.time.toISOString()]);
            const updatedDataRows = dataRows.map(data => {
                if (existingDataMap[data.time.toISOString()]) {
                    return { ...existingDataMap[data.time.toISOString()]._doc, ...data };
                }
                return data;
            });
            // Save new data rows and update existing data
            if (newDataRows.length) {
                await ForexData.insertMany(newDataRows);
            }
            if (updatedDataRows.length) {
                await ForexData.updateMany({ time: { $in: updatedDataRows.map(data => data.time) } }, { $set: updatedDataRows });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Method to check for missing minutes between start and end date
    public async checkMissingMinutes(symbol, startDate, endDate) {
        try {
            const forexData = await ForexData.find({
                symbol,
                time: { $gte: startDate, $lte: endDate }
            });
            const forexDataMap = forexData.reduce((map, data) => {
                map[data.time.toISOString()] = data;
                return map;
            }, {});
            let missingMinutes = [];
            for (let date = new Date(startDate.getTime()); date <= endDate; date.setMinutes(date.getMinutes() + 1)) {
                if (!forexDataMap[date.toISOString()]) {
                    missingMinutes.push(date.toISOString());
                }
            }
            return missingMinutes;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

}

export default new DBService();