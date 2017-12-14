const childProcess = require('child_process');
const fs = require('fs');

const devDependencies = [
    'babel-cli',
    'babel-core',
    'babel-loader',
    'babel-preset-env',
    'chai',
    'coveralls',
    'cross-env',
    'eslint',
    'eslint-config-airbnb-base',
    'eslint-plugin-import',
    'mocha',
    'nyc',
    'webpack',
];

function rm(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const realPath = `${path}/${file}`;

            if (fs.lstatSync(realPath).isDirectory()) {
                rm(realPath);
            } else {
                fs.unlinkSync(realPath);
            }
        });

        fs.rmdirSync(path);
    }
}

rm('./.git');
fs.unlinkSync('./package.json');
fs.unlinkSync('./package-lock.json');
fs.unlinkSync('./README.md');
fs.unlinkSync('./LICENSE');

fs.writeFileSync('./README.md', '# your_library\n Here goes your library description!', 'utf8');

childProcess.spawnSync('git', ['init'], { stdio: 'inherit' });
childProcess.spawnSync('npm', ['init'], { stdio: 'inherit' });
childProcess.spawnSync('npm', (['install'].concat(devDependencies).concat['--save-dev']), { stdio: 'inherit' });
