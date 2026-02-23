import fs from 'fs';

const path = 'src/app/(frontend)/globals.css';
const lines = fs.readFileSync(path, 'utf8').split('\n');

const newLines = lines.filter((line, index) => {
    const lineNum = index + 1;
    if (lineNum >= 798 && lineNum <= 1039) return false;
    if (lineNum >= 5855 && lineNum <= 6348) return false;
    return true;
});

fs.writeFileSync(path, newLines.join('\n'));
console.log('CSS lines removed successfully.');
