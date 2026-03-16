const fs = require('fs');
const path = require('path');

function transfer(slug, episodeNum, title, excerpt, inputFile) {
    const outputPath = `src/content/en/${slug}.md`;
    if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        return;
    }

    let content = fs.readFileSync(inputFile, 'utf8');

    // Clean up escaped characters which mammoth sometimes adds
    content = content.replace(/\\([.\-*()\\_\[\]~`])/g, '$1');

    const frontmatter = `---
episode: ${episodeNum}
slug: ${slug}
lang: en
title: "${title}"
titleRomanized: "${title}"
volume: 1
wordCount: ${content.split(/\s+/).length}
published: true
date: 2024-02-${15 + episodeNum}
excerpt: "${excerpt}"
---

`;

    // Strategy: find the first horizontal line and take everything after it
    const separator = '────────────────────────────';
    const separatorIndex = content.indexOf(separator);
    
    let body = content;
    if (separatorIndex !== -1) {
        body = content.substring(separatorIndex + separator.length).trim();
    } else {
        // Fallback: strip the standard header if separator not found
        body = content
            .replace(/^__THE PILLAR__\s+/m, '')
            .replace(/^\*Volume I\s+·\s+The Hidden Strategist\*\s+/m, '')
            .replace(/^\*Episode\s+\d+\*\s+/m, '')
            .replace(/^__.*?__\s+/m, '')
            .trim();
    }

    fs.writeFileSync(outputPath, frontmatter + body);
    console.log(`Episode ${episodeNum} English transferred and cleaned to ${outputPath}`);
}

// Episode 4
transfer('ep4', 4, "Lightning Strikes the Same Place Twice", "They say lightning never strikes the same place twice. They are wrong.", 'episodes/ThePillar_Episode4.md');

// Episode 5
transfer('ep5', 5, "The Royal Blood Slave", "There is a kind of love that spends itself completely on something that is already gone.", 'episodes/ThePillar_Episode5.md');
