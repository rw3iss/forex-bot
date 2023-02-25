const DATA_URL = 'http://localhost:3333/data';

class DataService {

    public loadData = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(DATA_URL);
                const data = await res.json();
                return resolve(data);
            } catch (err) {
                console.log(`Error loading data:`, err);
                return reject(err);
            }
        });
    }

}

export default new DataService();