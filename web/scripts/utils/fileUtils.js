var fs = require("fs");

module.exports = {
    mkDirSync: (dir) => {
        if (fs.existsSync(dir)) {
            return;
        }

        try {
            fs.mkdirSync(dir);
        } catch (err) {
            if (err.code == 'ENOENT') {
                mkdirSync(path.dirname(dir))
                mkdirSync(dir)
            }
        }
    }
}