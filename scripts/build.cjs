const { cp, mkdir, rm, writeFile } = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const destination = path.join(root, '_site');

// Explicit public files keep tests, tooling and local artifacts out of deployments.
const publicFiles = [
    'index.html',
    'styles.css',
    'terminal.js',
    'google61a011b4b87fc9f8.html',
    'assets',
    'MicrosoftServer2016-Security.png',
    'screenshot.png',
];

async function build() {
    await rm(destination, { recursive: true, force: true });
    await mkdir(destination, { recursive: true });
    await Promise.all(publicFiles.map(file => cp(
        path.join(root, file), path.join(destination, file), { recursive: true }
    )));
    await writeFile(path.join(destination, '.nojekyll'), '');
    console.log('Built static CV in _site/');
}

build().catch(error => {
    console.error('Build failed:', error.message);
    process.exitCode = 1;
});
