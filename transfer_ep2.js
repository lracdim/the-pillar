const fs = require('fs');
const path = require('path');

const inputFile = 'episodes/ThePillar_Episode2_Final.md';
const outputFile = 'src/content/en/ep2.md';

let content = fs.readFileSync(inputFile, 'utf8');

// Remove backslash escapes for standard markdown markers
// Mammoth often escapes dots, stars, parens, etc.
content = content.replace(/\\([.\-*()\\_\[\]~`])/g, '$1');

// Extract the title and episode info if we want to be fancy, 
// but we already have frontmatter in the target.
// Let's just find the start of the actual story content.
// The story usually starts after the divider ──────────────────────────── or after the title.

const divider = '────────────────────────────';
const dividerIndex = content.indexOf(divider);

let body = content;
if (dividerIndex !== -1) {
    // Keep everything after the first divider if it's the prologue/intro, 
    // or just after the title block.
    // In Ep 2, the content before the first divider is the intro quote.
    body = content.substring(content.indexOf('__THE PILLAR__')); 
}

// Actually, let's just take the whole thing after a certain point or keep it all but strip the titles that 11ty adds.
// 11ty adds the title from frontmatter.

const frontmatter = `---
episode: 2
slug: ep2
lang: en
title: "The Go Board and Its Pieces"
titleRomanized: "The Go Board and Its Pieces"
volume: 1
wordCount: 4300
published: true
date: 2024-01-22
excerpt: "Go is not a metaphor for war. War is a metaphor for Go."
---

`;

// Strip the redundant headers from the mammoth output if they exist
const cleanedBody = body
    .replace(/^__THE PILLAR__\s+/m, '')
    .replace(/^\*Volume I\s+·\s+The Hidden Strategist\*\s+/m, '')
    .replace(/^\*Episode\s+2\*\s+/m, '')
    .replace(/^__The Go Board and Its Pieces__\s+/m, '')
    .trim();

fs.writeFileSync(outputFile, frontmatter + cleanedBody);
console.log('Episode 2 English transferred and cleaned.');
