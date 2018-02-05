const clear = require('clear-console');
const deepMerge = require('deepmerge');
const sleep = require('sleep-sync');
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
    sleep(1000);

    spinner.succeed('Successfully done safety backup.');
    return JSON.parse(pkg);
}

/**
 * @description Checks if ./setup/backup.json exits
 * @returns {object} Original Package.json
 */
function checkForBackup() {
    const spinner = helpers.displaySpinner('Hello! Starting setup now!');
    const hasBackup = existsSync(bkpPath);

    sleep(1400);

    if (hasBackup) {
        spinner.succeed();
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
    sleep(700);
    spinner.succeed('No more junk files');
}

function initializeGit() {
    const spinner = helpers.displaySpinner('Initializing a new Git repository just for you.');

    helpers.spawn('git', ['init'], {}, spinner);
    
    sleep(850);
    spinner.succeed('Successfully initlized new git repo!');
}

function initializeNPM() {
    const spinner = helpers.displaySpinner('Initializing a new package.json.');
    console.log('\n\n');
    sleep(800);

    helpers.spawn('npm', ['init'], { detached: true, stdio: 'inherit' }, spinner);
    const userPkg = helpers.readFile(pkgPath, 'json', spinner);

    clear();
    spinner.succeed('Successfully initialized new package.json');
    return userPkg;
}

function patchFiles(templatePkg, userPkg) {
    const spinner = helpers.displaySpinner('Adding sugar.');

    const finalPkg = deepMerge(templatePkg, userPkg);
    helpers.writeFile(pkgPath, JSON.stringify(finalPkg, null, 4), spinner);

    const templateReadme = helpers.readFile(READMETemplatePath, 'string', spinner);
    const finalReadme = templateReadme
        .replace(/\[repo\]/g, userPkg.name)
        .replace(/\[date\]/g, new Date().getFullYear().toString(10));

    helpers.writeFile(READMEPath, finalReadme, spinner);
    sleep(900);
    spinner.succeed('Be aware of diabetes..');
}

function makeFirstCommit() {
    const spinner = helpers.displaySpinner('Staging and Commiting initial project state.');

    helpers.spawn('git', ['add', '.'], {}, spinner);
    helpers.spawn('git', ['commit', '-m', '"This is where it all started."'], {}, spinner);

    sleep(500);
    spinner.succeed('Commited');
}

function removeSetupFiles() {
    const spinner = helpers.displaySpinner('Cleaning up ./setup/ files.');

    helpers.spawn('rimraf', ['./setup/'], {}, spinner);

    sleep(600);
    spinner.succeed('No more accidental re-setups.');
}

function done() {
    helpers.displaySpinner('Done babyy!').succeed();
}

// //////////////////////////////

(() => {
    // Clears terminal/cmd window
    clear();

    console.log('\n\n');

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

    // Remove the setup folder to prevent re-setuping
    removeSetupFiles();

    // Make the first commit to clear git working tree
    makeFirstCommit();

    // Done!
    done();
})();
