const fs = require('fs');
const path = require('path');

// Read the development index.html
const devIndex = fs.readFileSync('index.html', 'utf8');

// Replace development paths with production paths
const prodIndex = devIndex
    .replace('src/css/styles.css', 'css/styles.css')
    .replace('src/js/main.js', 'js/main.js');

// Write the production version to dist/
fs.writeFileSync('dist/index.html', prodIndex);

console.log('✅ Production index.html created in dist/'); 