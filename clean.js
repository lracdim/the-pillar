const fs = require('fs');

const content = fs.readFileSync('episodes/ThePillar_Episode1_Final.md', 'utf8');
const cleaned = content.replace(/\\\\/g, '').replace(/\\ \\ /g, ' ');
console.log('Episode 1 cleaned, length:', cleaned.length);