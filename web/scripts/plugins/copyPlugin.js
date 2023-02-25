const path = require('path');

// todo: integrate somehow
const OUTPUT_DIR = './build';

// Copy some stuff, anything, after build, if needed.
module.exports = {
    name: 'copy',
    setup(build) {
        const fse = require('fs-extra');

        // copy index.html
        // THIS IS HANDLED SEPARATELY NOW, for templating.
        // fs.copyFile(`${APP_BASE}/index.html`, `${OUTPUT_DIR}/index.html`, (err) => {
        //     if (err) throw err;
        // });

        // copy static folder to build.
        // and copy the adtrack library to main url suffix for brevity.
        try {
            fse.copySync(path.resolve('./static'), path.resolve(`${OUTPUT_DIR}/static`), { overwrite: true });
            fse.copySync(path.resolve('./static/favicon.ico'), path.resolve(`${OUTPUT_DIR}/favicon.ico`), { overwrite: true });
        } catch (e) {
            console.error('error: ', e);
        }
    }
};
