#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projects = [
  'public/website',
  ...discoverLeadGenerators()
];

function discoverLeadGenerators() {
  const baseDir = path.resolve('public/lead_generators');
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join('public/lead_generators', entry.name));
}

function buildProject(projectPath) {
  const result = spawnSync(
    'node',
    ['scripts/build.js', projectPath],
    {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

projects.forEach((project) => {
  const srcCss = path.resolve(project, 'src.css');
  const srcJs = path.resolve(project, 'src.js');

  if (!fs.existsSync(srcCss) || !fs.existsSync(srcJs)) {
    console.warn(`Skipping ${project} (missing src.css or src.js)`);
    return;
  }

  console.log(`\n=== Building ${project} ===`);
  buildProject(project);
});

console.log('\nAll eligible projects built successfully.');
