const path = require('path');

// This plugin just manually inserts some special strings in the main index file
// (there is no easy to use html templating plugin for esbuild)
module.exports = {
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
            text = text.replace('{NODE_ENV_COMMENT}', `<!-- environment: ${NODE_ENV} -->`);

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