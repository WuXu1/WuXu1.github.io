const fs = require('fs');

const wuxu = JSON.parse(fs.readFileSync('wuxu-complete.json', 'utf8'));
const plus = JSON.parse(fs.readFileSync('wuxu-complete-plus.json', 'utf8'));

// The user requested to keep the name "WuXu's Library"
wuxu.name = "WuXu's Library";

// Merge featuredApps (deduplicate)
const featuredApps = new Set([...wuxu.featuredApps, ...(plus.featuredApps || [])]);
wuxu.featuredApps = Array.from(featuredApps);

// Merge apps (deduplicate by bundleIdentifier)
const appsMap = new Map();
for (const app of wuxu.apps) {
  appsMap.set(app.bundleIdentifier, app);
}
for (const app of (plus.apps || [])) {
  if (!appsMap.has(app.bundleIdentifier)) {
    appsMap.set(app.bundleIdentifier, app);
  }
}
wuxu.apps = Array.from(appsMap.values());

// Merge news (deduplicate by title or date maybe? Just combine and sort by date)
const newsMap = new Map();
for (const item of (wuxu.news || [])) {
  newsMap.set(item.title + item.date, item);
}
for (const item of (plus.news || [])) {
  if (!newsMap.has(item.title + item.date)) {
    newsMap.set(item.title + item.date, item);
  }
}
wuxu.news = Array.from(newsMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));

// Rename old files
fs.renameSync('wuxu-complete.json', 'wuxu-complete-old.json');
fs.renameSync('wuxu-complete-plus.json', 'wuxu-complete-plus-old.json');

if (fs.existsSync('frontend/public/wuxu-complete.json')) {
    fs.renameSync('frontend/public/wuxu-complete.json', 'frontend/public/wuxu-complete-old.json');
}
if (fs.existsSync('frontend/public/wuxu-complete-plus.json')) {
    fs.renameSync('frontend/public/wuxu-complete-plus.json', 'frontend/public/wuxu-complete-plus-old.json');
}

// Write merged
const mergedJson = JSON.stringify(wuxu, null, 2);
fs.writeFileSync('wuxu-complete.json', mergedJson);
fs.writeFileSync('frontend/public/wuxu-complete.json', mergedJson);

console.log("Merge completed successfully.");
