
const fs = require("fs");
const path = require("path");
const esbuild = require('esbuild');
const { getNormalizedEnvVars } = require("./utils/envUtils");
const { mkDirSync } = require("./utils/fileUtils");

const PORT = 3000;

// Config params (relative to where npm/script is called from):
const APP_BASE = './src';
const ENTRY_FILE = `index.tsx`;
const OUTPUT_DIR = './build';
const OUTPUT_FILE = 'app.js';
const TARGET = 'es2018';
/*
[
    'es2018',
    'chrome100',
    'firefox100',
    'safari14',
    'ios12'
]
*/

const { define, defineNoQuotes } = getNormalizedEnvVars();

///////////////////////////////////////////////////////////////////////////////

// Main bundling function.
async function build(entryFile, outFile) {
    console.log('build() called:', entryFile, outFile);

    // make sure build directory existsSync
    mkDirSync(OUTPUT_DIR);

    const ctx = await esbuild.context({
        entryPoints: [entryFile],
        outfile: outFile,
        bundle: true,
        minify: true,
        target: TARGET,
        format: 'iife',
        logLevel: 'info',
        loader: { // built-in loaders: js, jsx, ts, tsx, css, json, text, base64, dataurl, file, binary
            '.ttf': 'file',
            '.otf': 'file',
            '.png': 'file',
            '.svg': 'file',
            '.js': 'js',
            '.jsx': 'jsx',
            '.ts': 'ts',
            '.tsx': 'tsx',
            '.scss': 'css'
        },
        //jsx: 'transform', // wait for new esbuild version
        assetNames: 'static/[name].[hash]',
        tsconfig: "tsconfig.json",
        mainFields: ["browser", "module", "main"],
        plugins: [
            // scssPlugin,
            // postCssPlugin({ plugins: [autoprefixer, postcssPresetEnv()] }),
            // copyPlugin
        ],
        sourcemap: true,
        define
    });

    await ctx.watch();

    const { host, port } = await ctx.serve({
        port: PORT,
        servedir: OUTPUT_DIR,
    })

    console.log(`Build served at ${host}:${PORT}`);
    // .catch((e) => {
    //     console.log("Error building:", e.message);
    //     process.exit(1);
    // });
}

// This plugin allows for for parsing of scss files and interpreting sourcemaps, customizations, etc.
// let scssPlugin = {
//     name: 'scss',
//     setup(build) {
//         const fs = require('fs');
//         const sass = require('node-sass');
//         const path = require('path');
//         //const aliasImporter = require("node-sass-alias-importer");

//         build.onLoad({ filter: /\.(scss)$/ }, async (args) => {
//             let filePath = path.resolve(args.path);
//             let data = await fs.promises.readFile(filePath, 'utf8');
//             let contents = '';
//             try {
//                 if (data) {
//                     let result = sass.renderSync({
//                         data,
//                         //includePaths: [], // todo: dynamically add global imports??
//                         sourceComments: true,
//                         sourceMap: true,
//                         // importer: [
//                         //     aliasImporter({
//                         //       app: "./src",
//                         //       styles: "./src/styles"
//                         //     })
//                         // ]
//                     });
//                     contents = result.css;
//                 }
//                 return {
//                     contents: contents,
//                     loader: 'css'
//                 };
//             } catch (e) {
//                 //throw e;
//                 throw new Error("\n\nError rendering SCSS file:\n  " + filePath + " => \n\n" + e.formatted);//, { path: filePath });
//             }
//         });
//     }
// };

// Copy some stuff, anything, after build, if needed.
// let copyPlugin = {
//     name: 'copy',
//     setup(build) {
//         const fse = require('fs-extra');

//         // copy index.html
//         // THIS IS HANDLED SEPARATELY NOW, for templating.
//         // fs.copyFile(`${APP_BASE}/index.html`, `${OUTPUT_DIR}/index.html`, (err) => {
//         //     if (err) throw err;
//         // });

//         // copy static folder to build.
//         // and copy the adtrack library to main url suffix for brevity.
//         try {
//             fse.copySync(path.resolve('./static'), path.resolve(`${OUTPUT_DIR}/static`), { overwrite: true });
//             fse.copySync(path.resolve('./static/favicon.png'), path.resolve(`${OUTPUT_DIR}/favicon.png`), { overwrite: true });
//             //fse.copySync(path.resolve(`${APP_BASE}/adtrack.js`), path.resolve(`${OUTPUT_DIR}/adtrack.js`), { overwrite: true });
//         } catch (e) {
//             console.error('error: ', e);
//         }
//     }
// };

// copies any imports or paths that start with /static to the build folder.
// todo: also needs to parse file contents for references to /static?
// let copyStaticPlugin = {
//     name: 'copy-static',
//     setup(build) {

//         function _findEnvFile(dir) {
//             if (!fs.existsSync(dir))
//                 return false;
//             let filePath = `${dir}/.env`;
//             if ((fs.existsSync(filePath))) {
//                 return filePath;
//             } else {
//                 return _findEnvFile(path.resolve(dir, '../'));
//             }
//         }

//         build.onResolve({ filter: /^static$/ }, async (args) => {
//             // find a .env file in current directory or any parent:
//             return ({
//                 path: _findEnvFile(args.resolveDir),
//                 namespace: 'env-ns',
//             })
//         })

//         build.onLoad({ filter: /.*/, namespace: 'env-ns' }, async (args) => {
//             // read in .env file contents and combine with regular .env:
//             let data = await fs.promises.readFile(args.path, 'utf8')
//             const buf = Buffer.from(data)
//             const config = require('dotenv').parse(buf);

//             return ({
//                 contents: JSON.stringify({ ...process.env, ...config }),
//                 loader: 'json'
//             });
//         })
//     }
// }

// call build for main app bundle
build(`${APP_BASE}/${ENTRY_FILE}`, `${OUTPUT_DIR}/${OUTPUT_FILE}`);