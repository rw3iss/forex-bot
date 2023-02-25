module.exports = {
    getNormalizedEnvVars: () => {
        const define = {};
        const defineNoQuotes = {};

        for (let k in process.env) {
            k = k.replace(/ /g, '');

            // Bypass windows errors
            if (k === 'CommonProgramFiles(x86)' || k === 'ProgramFiles(x86)') {
                continue;
            }

            define[`process.env.${k}`] = JSON.stringify(process.env[k]);
            defineNoQuotes[`process.env.${k}`] = process.env[k];
        }

        return { define, defineNoQuotes };
    }
}