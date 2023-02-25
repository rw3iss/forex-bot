
var fs = require("fs");
var path = require("path");
const esbuild = require('esbuild');
const { mkDirSync } = require("./utils/fileUtils");
const { getNormalizedEnvVars } = require("./utils/envUtils");

// Config params (relative to where npm/script is called from):
const APP_BASE = './src';
const ENTRY_FILE = `index.html`;
const OUTPUT_DIR = './build';
const OUTPUT_FILE = 'app.js';
const TARGET = 'es2018';

const { define, defineNoQuotes } = getNormalizedEnvVars();

///////////////////////////////////////////////////////////////////////////////

function buildHtml(entryFile, outFile) {
    console.log('buildHtml() called:', entryFile, outFile);

    // make sure build directory existsSync
    mkDirSync(OUTPUT_DIR);

    esbuild.build({
        entryPoints: [entryFile],
        outfile: outFile,
        target: TARGET,
        logLevel: 'info',
        bundle: false,
        // loader: { // built-in loaders: js, jsx, ts, tsx, css, json, text, base64, dataurl, file, binary
        //     '.html': 'file'
        // },
        define,
        plugins: [transformHtmlTemplatePlugin]
    })
        .then(r => { console.log(`Build html ${entryFile} to ${outFile} succeeded.`); })
        .catch((e) => {
            console.log("Error building html:", e.message);
            process.exit(1);
        });
}

// This plugin just manually inserts some special strings in the main index file
// (there is no easy to use html templating plugin for esbuild)
let transformHtmlTemplatePlugin = {
    name: 'transform',
    setup(build) {
        let fs = require('fs');
        let cacheControl = '';

        if (process.env.DISABLE_CACHE == 'true') {
            cacheControl = '<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE"><META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE"><meta http-equiv="expires" content="0" />';
        }

        build.onLoad({ filter: /\.html$/ }, async (args) => {
            let text = await fs.promises.readFile(args.path, 'utf8');
            text = text.replace(/{TIMESTAMP}/g, Date.now());
            text = text.replace('{CACHE_CONTROL}', cacheControl);

            // replace environment variables
            Object.keys(defineNoQuotes).forEach(k => {
                var replace = `{${k}}`;
                var re = new RegExp(replace, "g");
                text = text.replace(re, defineNoQuotes[k]);
            });

            let outFile = path.resolve(OUTPUT_DIR, 'index.html');
            fs.writeFileSync(outFile, text, { encoding: 'utf-8' });
            console.log('wrote', outFile);

            return {
                contents: text,
                loader: 'text',
            };
        });

        // build.onEnd(result => {
        //     if (!result.metafile) {
        //         console.log('not a meta file...')
        //         return;
        //     }
        //     const outputs = result.metafile.outputs;
        //     if (!outputs) {
        //         console.log('no output...')
        //         return;
        //     }

        //     const { publicPath, outdir } = build.initialOptions;
        //     const fullOutdir = path.resolve(process.cwd(), opt.path || outdir);
        //     const relativeOutdir = path.relative(process.cwd(), fullOutdir);

        //     console.log('WRITING', result.length);

        //     writeFileSync(
        //         path.resolve(fullOutdir, 'gen_' + opt.filename),
        //         result,
        //         //JSON.stringify(groupByName(manifest), null, '  '),
        //         { encoding: 'utf-8' }
        //     );
        // });

    },
};

// run the build
// the outfile is "ignored" because the transformHtmlTemplatePlugin will generate the real index.html, but esbuild "needs" to produce something.
buildHtml(`${APP_BASE}/index.html`, `${OUTPUT_DIR}/index_ignore.html`);
