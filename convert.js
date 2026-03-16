const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const episodesDir = path.join(__dirname, 'episodes');
const docxFiles = fs.readdirSync(episodesDir).filter(f => f.endsWith('.docx'));

async function convertDocxToMarkdown() {
  for (const file of docxFiles) {
    const filePath = path.join(episodesDir, file);
    const result = await mammoth.convertToMarkdown({ path: filePath });
    const outputPath = path.join(episodesDir, file.replace('.docx', '.md'));
    fs.writeFileSync(outputPath, result.value);
    console.log(`Converted ${file} to markdown`);
  }
}

convertDocxToMarkdown().catch(console.error);