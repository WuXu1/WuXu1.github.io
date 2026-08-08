const fs = require('fs');

const data = JSON.parse(fs.readFileSync('wuxu-complete.json', 'utf8'));

// Popular keywords to identify top apps
const popularKeywords = ['youtube', 'spotify', 'instagram', 'tiktok', 'dopamine', 'trollinstallerx', 'whatsapp', 'twitter', 'reddit', 'twitch', 'discord', 'delta', 'ppsspp', 'uyou', 'facebook', 'snapchat'];

const isPopular = (app) => {
    const name = app.name.toLowerCase();
    return popularKeywords.some(kw => name.includes(kw));
};

const popularApps = [];
const otherApps = [];

data.apps.forEach(app => {
    if (isPopular(app)) {
        popularApps.push(app);
    } else {
        otherApps.push(app);
    }
});

// Shuffle an array (Fisher-Yates)
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

// Shuffle both lists for randomness, but keep popular on top
shuffle(popularApps);
shuffle(otherApps);

// Sort popular apps slightly by putting absolute essentials first (e.g., YouTube++, Spotify++)
const absoluteEssentials = ['youtube', 'spotify', 'instagram', 'tiktok'];
popularApps.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aEssential = absoluteEssentials.findIndex(kw => aName.includes(kw));
    const bEssential = absoluteEssentials.findIndex(kw => bName.includes(kw));
    
    const aScore = aEssential !== -1 ? aEssential : 999;
    const bScore = bEssential !== -1 ? bEssential : 999;
    return aScore - bScore;
});

const finalApps = [...popularApps, ...otherApps];

// Update the apps array
data.apps = finalApps;

// Update featuredApps (top 5 from the sorted popular list)
data.featuredApps = finalApps.slice(0, 5).map(app => app.bundleIdentifier);

const mergedJson = JSON.stringify(data, null, 2);
fs.writeFileSync('wuxu-complete.json', mergedJson);
if (fs.existsSync('frontend/public/wuxu-complete.json')) {
    fs.writeFileSync('frontend/public/wuxu-complete.json', mergedJson);
}

console.log(`Shuffled ${data.apps.length} apps.`);
console.log(`Featured apps: ${data.featuredApps.join(', ')}`);
console.log(`Top 10 apps: ${finalApps.slice(0,10).map(a => a.name).join(', ')}`);

