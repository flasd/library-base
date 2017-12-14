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

fs.rmdirSync('./.git');
fs.unlinkSync('./package.json');
fs.unlinkSync('./package-lock.json');
fs.unlinkSync('./README.md');
fs.unlinkSync('./LICENSE');

fs.writeFileSync('./README.md', '# your_library\n Here goes your library description!', './README.md');

childProcess.execSync('git init');
childProcess.execSync('npm init');
childProcess.execSync(`npm install ${devDependencies.join(' ')}`);
