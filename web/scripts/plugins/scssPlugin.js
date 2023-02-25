const path = require('path');

module.exports = {
    name: 'css',
    setup(build) {
        // Redirect all paths css, scss or sass
        build.onResolve({ filter: /.\.s[ac]ss$/ }, (args) => {
            const path1 = args.resolveDir.replace('/build', '');
            //console.log(`resolve:`, args.resolveDir, args, path1, path.join(path1, args.path));
            return { path: path.join(path1, args.path) };
        });
    },
};


// This plugin allows for for parsing of scss files and interpreting sourcemaps, customizations, etc.
// let scssPlugin = {
//     name: 'scss',
//     setup(build) {
//         const sass = require('node-sass');
//         //const aliasImporter = require("node-sass-alias-importer");

//         build.onLoad({ filter: /\.(scss)$/ }, async (args) => {
//             let filePath = path.resolve(args.path);
//             try {
//                 console.log(`Load scss`, filePath);
//                 let data = await fs.promises.readFile(filePath, 'utf8');
//                 let contents = '';

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
//                     contents,
//                     loader: 'css'
//                 };
//             } catch (e) {
//                 //throw e;
//                 throw new Error("\n\nError rendering SCSS file:\n  " + filePath + " => \n\n" + e.formatted);//, { path: filePath });
//             }
//         });
//     }
// };
