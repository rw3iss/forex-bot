import mongoose from 'mongoose';

// Define ForexData Schema
const ForexDataSchema = new mongoose.Schema({
    time: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    volume: { type: Number, required: true },
    symbol: { type: String, required: true }
});


// Create ForexData model from schema
const ForexData = mongoose.model('ForexData', ForexDataSchema);
export default ForexData;