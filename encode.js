const fs = require('fs');
const content = fs.readFileSync('design.md', 'utf8');
const base64 = Buffer.from(content).toString('base64');
fs.writeFileSync('b64.txt', base64);
