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

const scripts = {
    lint: 'cross-env NODE_ENV=test eslint src/**/*.js',
    test: 'cross-env NODE_ENV=test nyc -x src/**/*.test.js mocha src/**/*.test.js --require babel-core/register',
    build: 'npm test && npm run lint && cross-env NODE_ENV=production webpack',
    coverage: 'nyc report --reporter=text-lcov | coveralls',
};

/**
 *
 * @param {string} path the path of the file/directory to be removed.
 */
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

// ##### Removes old files
rm('./.git');
rm('./package.json');
rm('./package-lock.json');
rm('./README.md');
rm('./LICENSE');

// ##### Create new README
fs.writeFileSync('./README.md', '# your_library\n Here goes your library description!\n\0', 'utf8');

// ##### Init new git repository
childProcess.spawnSync('git', ['init'], { stdio: 'inherit' });
process.stdout.write('\n');

// ##### Init new npm repository
childProcess.spawnSync('npm', ['init'], { stdio: 'inherit', detached: true });
process.stdout.write('\n');

// ##### Install devDependencies
const installArgs = ['install'].concat(devDependencies).concat(['--save-dev']);
childProcess.spawnSync('npm', installArgs, { stdio: 'inherit', detached: true });

// ##### Update scripts
const pkg = JSON.parse(fs.readFileSync('./package.json'));
fs.unlinkSync('./package.json');
pkg.scripts = scripts;
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 4));

// ##### Unlink setup script
rm('./setup.js');
