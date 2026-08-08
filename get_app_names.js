const fs = require('fs');
const data = JSON.parse(fs.readFileSync('wuxu-complete.json', 'utf8'));
const names = data.apps.map(a => a.name);
console.log(names.join(', '));
