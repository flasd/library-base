const childProcess = require('child_process');
const fs = require('fs');

const rm = require('./.rimraf');

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

rm('.git package.json package-lock.json README.md LICENSE');
fs.unlinkSync('./.glob.js');
fs.unlinkSync('./.rimraf.js');

fs.writeFileSync('./README.md', '# your_library\n Here goes your library description!', './README.md');

childProcess.execSync('git init');
childProcess.execSync('npm init');
childProcess.execSync(`npm install ${devDependencies.join(' ')}`);
