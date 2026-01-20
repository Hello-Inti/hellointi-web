#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const projectPath = process.argv.slice(2).find((arg) => !arg.startsWith('-'));

if (!projectPath) {
  console.error('Usage: npm run build:project -- <project-path>');
  process.exit(1);
}

const resolvedPath = path.resolve(projectPath);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: resolvedPath,
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Building ${resolvedPath}`);

run('pnpm', ['exec', 'postcss', 'src.css', '-o', 'style.css']);
run('pnpm', ['exec', 'esbuild', 'src.js', '--bundle', '--minify', '--outfile=script.js']);

console.log('Done.');
