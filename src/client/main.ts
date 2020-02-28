import App from './App';

const TICK_INTERVAL = 5000;

const app = new App();


setInterval(() => {
    // get new price data
    const newData = {};
    app.onTick(newData, TICK_INTERVAL); // todo: calculate actual time change
}, 5000);
