const fs = require('fs');
const path = require('path');

// Simple script to prepare fixture data for Sanity import
// This converts our JSON files to NDJSON format that Sanity can import

const fixturesDir = path.join(__dirname, '../fixtures');
const outputDir = path.join(__dirname, '../import');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Convert JSON files to NDJSON (newline-delimited JSON)
function convertToNDJSON(filename) {
  const inputPath = path.join(fixturesDir, filename);
  const outputPath = path.join(outputDir, filename.replace('.json', '.ndjson'));
  
  if (fs.existsSync(inputPath)) {
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const ndjsonContent = data.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(outputPath, ndjsonContent);
    console.log(`✓ Converted ${filename} to ${filename.replace('.json', '.ndjson')}`);
  }
}

// Convert all fixture files
convertToNDJSON('services.json');
convertToNDJSON('neighborhoods.json');
convertToNDJSON('faqs.json');

console.log('\n📁 Import files created in:', outputDir);
console.log('\nTo import into Sanity:');
console.log('1. Install Sanity CLI: npm install -g @sanity/cli');
console.log('2. Login: sanity login');
console.log('3. Import each file:');
console.log('   sanity dataset import import/services.ndjson production');
console.log('   sanity dataset import import/neighborhoods.ndjson production');
console.log('   sanity dataset import import/faqs.ndjson production');