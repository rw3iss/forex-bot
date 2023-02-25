const concurrently = require('concurrently');
const { result } = concurrently(
    [
        'npm:watch-*',
        { command: 'nodemon', name: 'server' },
        { command: 'deploy', name: 'deploy', env: { PUBLIC_KEY: '...' } },
        {
            command: 'watch',
            name: 'watch',
            cwd: path.resolve(__dirname, 'scripts/watchers'),
        },
    ],
    {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        restartTries: 3,
        cwd: path.resolve(__dirname, 'scripts'),
    }
);
result.then(success, failure);