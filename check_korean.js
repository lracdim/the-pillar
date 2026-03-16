const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const episodesDir = 'episodes';
const docxFiles = fs.readdirSync(episodesDir).filter(f => f.endsWith('.docx'));

async function checkKorean() {
    for (const file of docxFiles) {
        const filePath = path.join(episodesDir, file);
        const result = await mammoth.extractRawText({ path: filePath });
        const text = result.value;
        const hasKorean = /[\uac00-\ud7af]/.test(text);
        console.log(`${file}: ${hasKorean ? 'HAS KOREAN' : 'No Korean'}`);
        if (hasKorean) {
            console.log('Sample Korean:', text.match(/[\uac00-\ud7af]+/g).slice(0, 5).join(' '));
        }
    }
}

checkKorean().catch(console.error);
