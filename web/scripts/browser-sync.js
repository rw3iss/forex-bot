const bs = require('browser-sync').create();
const url = require('url');
const fs = require('fs');
const path = require('path');

// load port from env
const PORT = 3000;

const defaultFile = "index.html";
const folder = path.resolve(__dirname, "../");

bs.init({
    port: PORT,
    // host: "localhost.adcloud.ai",

    https: {
        key: path.join(__dirname, './certs/localhost-key.pem'),
        cert: path.join(__dirname, './certs/localhost.pem')
    },

    server: "./build",
    files: ['./build'],

    browser: "google chrome",
    open: "local",
    // cors: true

    reloadOnRestart: false,
    injectChanges: true,

    ui: false,
    notify: false,

    watch: true,
    watchEvents: ['change', 'add'],
    watchOptions: {
        files: ['./build/app.js', './build/index.html'],
        ignoreInitial: true,
        // awaitWriteFinish: {
        //     stabilityThreshold: 1000,
        //     pollInterval: 100
        // },
        ignored: ['./build/index_ignore.html'],
    },
    ignore: ['./build/index_ignore.html'],
    reloadDelay: 1000,
    localOnly: true,

    middleware: function(req, res, next) {
        // this redirects all non-asset urls to the root index.html file, for development purposes
        if (req.url.match(/^(.*)(.css|.js|.ttf|.png|.jpg)/)) {
            return next();
        }

        var fileName = url.parse(req.url);
        fileName = fileName.href.split(fileName.search).join("");
        var fileExists = fs.existsSync(folder + fileName);
        if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
            req.url = "/" + defaultFile;
        }

        return next();
    }
});

//bs.watch(['./build/*.css', './build/*.js', './build/index.html'], {ignored: '**/index_ignore.html'});

console.log(`Browser-sync client started on port ${PORT}`);