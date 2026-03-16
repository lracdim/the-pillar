const fs = require('fs');
const path = require('path');

const inputFile = 'episodes/ThePillar_Episode3_Final.md';
const outputFile = 'src/content/en/ep3.md';

let content = fs.readFileSync(inputFile, 'utf8');

content = content.replace(/\\([.\-*()\\_\[\]~`])/g, '$1');

const frontmatter = `---
episode: 3
slug: ep3
lang: en
title: "The Great Piece of Sacrifice"
titleRomanized: "The Great Piece of Sacrifice"
volume: 1
wordCount: 4800
published: true
date: 2024-01-29
excerpt: "In every game, there is a piece that must be lost so that the game itself can be won."
---

`;

// Strip redundant headers
// Ep 3 usually follows same pattern
const body = content.substring(content.indexOf('__THE PILLAR__') !== -1 ? content.indexOf('__THE PILLAR__') : 0);

const cleanedBody = body
    .replace(/^__THE PILLAR__\s+/m, '')
    .replace(/^\*Volume I\s+·\s+The Hidden Strategist\*\s+/m, '')
    .replace(/^\*Episode\s+3\*\s+/m, '')
    .replace(/^__The Great Piece of Sacrifice__\s+/m, '')
    .trim();

fs.writeFileSync(outputFile, frontmatter + cleanedBody);
console.log('Episode 3 English transferred and cleaned.');
