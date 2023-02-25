const express = require('express');
const app = express();
const path = require('path');
var cors = require('cors')
import { getInnerError } from "utils";

const PORT = 3333;
const DATA_FILE = path.resolve(__dirname, '../../data/data.json');

app.use(cors())

app.get('/data', (req, res: any) => {
    try {
        console.log(`GET /data`)
        res.sendFile(DATA_FILE);
    } catch (e) {
        console.log(`Error loading data:`, e);
        res.status = 500;
        res.statusText = getInnerError(e);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}. Data at GET /data from: ${DATA_FILE}`);
});