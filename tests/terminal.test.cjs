const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

// Exercise the command model without browser or legacy build dependencies.
const Terminal = runInNewContext(
    readFileSync(require.resolve('../terminal.js'), 'utf8') + '\nTerminal;',
    { document: { getElementById: () => ({}), addEventListener() {} } }
);
class TestTerminal extends Terminal {
    init() { this.results = []; }
    addCommandToOutput() {}
    addOutput(command, result) { this.results.push(result); }
    scrollToBottom() {}
    escapeHtml(text) {
        return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }
    run(command) {
        this.executeCommand(command);
        return this.results.at(-1);
    }
}

test('both education entries show the conferred diploma title', () => {
    const terminal = new TestTerminal();
    for (const file of ['education.txt', 'certifications.txt']) {
        const output = terminal.run(`cat ${file}`);
        assert.match(output, /Associate in Science — Specialization in Cybersecurity/);
        assert.match(output, /Conferred August 2026/);
        assert.doesNotMatch(output, /Associate of Science|CURRENT FOCUS \(2025\)/);
    }
});

test('every advertised project supports cd, ls, cat, tree and parent navigation', () => {
    const terminal = new TestTerminal();
    terminal.run('cd projects');
    for (const project of terminal.directories.projects) {
        terminal.run(`cd ${project}`);
        assert.equal(terminal.currentDirectory, `projects/${project.slice(0, -1)}`);
        assert.match(terminal.run('ls'), /info.md/);
        assert.match(terminal.run('cat info.md'), /project-title/);
        assert.match(terminal.run('pwd'), new RegExp(`/home/craig/projects/${project.slice(0, -1)}`));
        const tree = terminal.run('tree');
        assert.match(tree, /info.md/);
        assert.doesNotMatch(tree, /education.txt/);
        terminal.run('cd ..');
        assert.equal(terminal.currentDirectory, 'projects');
    }
    terminal.run('cd ..');
    assert.equal(terminal.currentDirectory, '~');
});

test('paths resolve relative to the working directory and accept home paths', () => {
    const terminal = new TestTerminal();
    terminal.run('cd ./projects/gb10-studio/');
    assert.match(terminal.run('cat ../../education.txt'), /Associate in Science/);
    assert.match(terminal.run('cat ~/education.txt'), /Associate in Science/);
    assert.match(terminal.run('cat /home/craig/education.txt'), /Associate in Science/);
    assert.match(terminal.run('cat education.txt'), /No such file/);
    terminal.run('cd ../tradefix');
    assert.equal(terminal.currentDirectory, 'projects/tradefix');
    assert.match(terminal.run('ls ../vestix'), /info.md/);
    terminal.run('cd');
    terminal.run('cd education.txt');
    assert.equal(terminal.currentDirectory, '~');
    assert.match(terminal.results.at(-1), /Not a directory/);
    assert.match(terminal.run('cat ~education.txt'), /No such file/);
});

test('commands tolerate repeated spaces and tabs', () => {
    const terminal = new TestTerminal();
    assert.match(terminal.run('cat   \t education.txt'), /Associate in Science/);
});

test('prototype property names are never treated as commands, files or directories', () => {
    const terminal = new TestTerminal();
    for (const name of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
        assert.match(terminal.run(name), /Command not found/);
        assert.match(terminal.run(`cat ${name}`), /No such file/);
        assert.match(terminal.run(`cd ${name}`), /No such file/);
        assert.match(terminal.run(`ls ${name}`), /No such directory/);
        assert.match(terminal.run(`curl ${name}`), /Could not resolve host/);
        assert.equal(terminal.currentDirectory, '~');
    }
});

test('all error paths escape user-supplied markup', () => {
    const terminal = new TestTerminal();
    for (const command of ['', 'cat ', 'cd ', 'ls ', 'curl ', 'git ']) {
        const output = terminal.run(`${command}<b>probe</b>`);
        assert.match(output, /&lt;b&gt;probe&lt;\/b&gt;/);
        assert.doesNotMatch(output, /<b>/);
    }
});

test('tab completion follows nested paths and filters cd to directories', () => {
    const terminal = new TestTerminal();
    for (const [input, expected] of [
        ['cd projects/gb', 'cd projects/gb10-studio/'],
        ['cat projects/gb10-studio/in', 'cat projects/gb10-studio/info.md'],
        ['cd edu', 'cd edu'],
        ['cat constructor/', 'cat constructor/'],
    ]) {
        terminal.input.value = input;
        terminal.autoComplete();
        assert.equal(terminal.input.value, expected);
    }
});
