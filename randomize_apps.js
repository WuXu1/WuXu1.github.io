const fs = require('fs');

const data = JSON.parse(fs.readFileSync('wuxu-complete.json', 'utf8'));

// Top tier - will be at the very top of the list in this exact order
const topApps = [
  "YouTube++",
  "Spotify++",
  "TikTok++",
  "Instagram++",
  "Dopamine",
];

// Second tier - will be randomly shuffled below top tier
const interestingApps = [
  "Facebook++",
  "X++",
  "MyFitnessPal++",
  "Duolingo++",
  "PPSSPP",
  "TrollInstallerX",
  "Pokemon Go (w/ SpooferPro)",
  "Null's Royale",
  "Scarlet",
  "ESign"
];

const tier1 = [];
const tier2 = [];
const tier3 = [];

data.apps.forEach(app => {
  if (topApps.includes(app.name)) {
    tier1.push(app);
  } else if (interestingApps.includes(app.name)) {
    tier2.push(app);
  } else {
    tier3.push(app);
  }
});

// Sort tier1 to match the exact order in topApps array
tier1.sort((a, b) => topApps.indexOf(a.name) - topApps.indexOf(b.name));

// Shuffle tier 2 and tier 3
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

shuffle(tier2);
shuffle(tier3);

// Combine
data.apps = [...tier1, ...tier2, ...tier3];

// Set top 5 featured apps (which matches our tier 1 list)
data.featuredApps = tier1.slice(0, 5).map(app => app.bundleIdentifier);

const jsonOutput = JSON.stringify(data, null, 2);

fs.writeFileSync('wuxu-complete.json', jsonOutput);
fs.writeFileSync('frontend/public/wuxu-complete.json', jsonOutput);
console.log('Successfully randomized apps while keeping interesting ones at the top.');
