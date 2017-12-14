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
        if (fs.lstatSync(path).isDirectory()) {
            fs.readdirSync(path).forEach((file) => {
                const realPath = `${path}/${file}`;

                if (fs.lstatSync(realPath).isDirectory()) {
                    rm(realPath);
                } else {
                    fs.unlinkSync(realPath);
                }
            });

            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }
}

rm('./.git');
rm('./package.json');
rm('./package-lock.json');
rm('./README.md');
rm('./LICENSE');

fs.writeFileSync('./README.md', '# your_library\n Here goes your library description!\n\0', 'utf8');

childProcess.spawnSync('git', ['init'], { stdio: 'inherit' });
process.stdout.write('\n');
childProcess.spawnSync('npm', ['init'], { stdio: 'inherit' });
process.stdout.write('\n');
childProcess.spawnSync('npm', (['install'].concat(devDependencies).concat['--save-dev']), { stdio: 'inherit' });
