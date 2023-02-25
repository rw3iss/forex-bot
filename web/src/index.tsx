import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import initHotReload from './initHotReload';

let app = document.getElementById('app');
if (app) ReactDOM.render(<App />, app);

// if (NODE_ENV == 'development') {
initHotReload();
// }