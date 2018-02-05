const deepMerge = require('deepmerge');
const { existsSync } = require('fs');

const helpers = require('./helpers');

// ////////////////////////////////////////
// Build Steps

const pkgPath = helpers.resolve('./package.json');
const bkpPath = helpers.resolve('./setup/backup.json');
const READMEPath = helpers.resolve('./README.md');
const READMETemplatePath = helpers.resolve('./setup/README.md');

/**
 * @description Creates ./setup/backup.json in case op fails
 * and package json ends up corrupted.
 * @returns {object} Original Package.json
 */
function doBackup() {
    const spinner = helpers.displaySpinner('Backing up package.json just in case.');
    const pkg = helpers.readFile(pkgPath, 'string', spinner);
    helpers.writeFile(bkpPath, pkg, spinner);

    return JSON.parse(pkg);
}

/**
 * @description Checks if ./setup/backup.json exits
 * @returns {object} Original Package.json
 */
function checkForBackup() {
    const spinner = helpers.displaySpinner('Hello! Starting setup now!');
    const hasBackup = existsSync(bkpPath);

    if (hasBackup) {
        return helpers.readFile(bkpPath, 'json', spinner);
    }

    spinner.succeed();
    return doBackup();
}

/**
 * @description Remove unneeded files
 */
function removeRepositoryFiles() {
    const spinner = helpers.displaySpinner('Removing files you wont need.');

    const files = [
        './.git',
        './LICENCE',
        './package-lock.json',
        './package.json',
        './README.md',
    ];

    helpers.spawn('rimraf', files, {}, spinner);

    spinner.succeed();
}

function initializeGit() {
    const spinner = helpers.displaySpinner('Initializing a new Git repository just for you.');

    helpers.spawn('git', ['init'], {}, spinner);
    spinner.succeed();
}

function initializeNPM() {
    const spinner = helpers.displaySpinner('Initializing a new package.json.');

    helpers.spawn('npm', ['init'], { detached: true, stdio: 'inherit' }, spinner);
    const userPkg = helpers.readFile(pkgPath, 'json', spinner);

    spinner.succeed();
    return userPkg;
}

function patchFiles(templatePkg, userPkg) {
    const spinner = helpers.displaySpinner('Preparing coffee.');

    const finalPkg = deepMerge(templatePkg, userPkg);
    helpers.writeFile(pkgPath, JSON.stringify(finalPkg, null, 4), spinner);

    const templateReadme = helpers.readFile(READMETemplatePath, 'string', spinner);
    const finalReadme = templateReadme
        .replace(/\[repo\]/g, userPkg.name)
        .replace(/\[date\]/g, new Date().getFullYear().toString(10));

    helpers.writeFile(READMEPath, finalReadme, spinner);

    spinner.succeed();
}

function makeFirstCommit() {
    const spinner = helpers.displaySpinner('Staging and Commiting initial project state.');

    helpers.spawn('git', ['add', '.'], {}, spinner);
    helpers.spawn('git', ['commit', '-m', '"This is where it all started."'], {}, spinner);

    spinner.succeed();
}

function removeSetupFiles() {
    const spinner = helpers.displaySpinner('Cleaning up ./setup/ files.');

    helpers.spawn('rimraf', ['./setup/'], {}, spinner);

    spinner.succeed();
}

function done() {
    helpers.displaySpinner('Done babyy!').succeed();
}

// //////////////////////////////

(() => {
    // Create a package.json backup
    const templatePkg = checkForBackup();

    // Remove .git folder and a few files
    removeRepositoryFiles();

    // Initializes git repository
    initializeGit();

    // Intializes npm project
    const userPkg = initializeNPM();

    // Patch Package.json scripts and dependencies
    patchFiles(templatePkg, userPkg);

    // Make the first commit to clear git working tree
    makeFirstCommit();

    // Remove the setup folder to prevent re-setuping
    removeSetupFiles();

    // Done!
    done();
})();
