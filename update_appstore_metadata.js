const fs = require('fs');
const https = require('https');

const getBaseName = (name) => {
  return name
    .replace(/\+\+/g, '')
    .replace(/\(No Ads\)/ig, '')
    .replace(/\(w\/ SpooferPro\)/ig, '')
    .replace(/\(Old\)/ig, '')
    .replace(/\(NEW\)/ig, '')
    .replace(/\(MDC\)/ig, '')
    .trim();
};

const searchItunes = (term) => {
  return new Promise((resolve, reject) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=1`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results[0] || null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
};

const processFile = async (filepath) => {
  console.log(`Processing ${filepath}...`);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  
  for (let i = 0; i < data.apps.length; i++) {
    const app = data.apps[i];
    const baseName = getBaseName(app.name);
    
    // Skip well known 3rd party apps that definitely aren't on AppStore to save time
    const skipList = ['TrollInstallerX', 'PostBox', 'emuThreeDS', 'PPSSPP', 'Scarlet', 'Odyssey', 'Taurine', 'unc0ver', 'Dopamine', 'Cowabunga', 'ESign', "Null's Royale", 'Atrasis', 'Santander', 'Filza', 'iTorrent', 'Angry Birds Space', 'Angry Birds Star Wars', 'HD Flix'];
    if (skipList.includes(baseName)) {
      console.log(`Skipping 3rd party app: ${baseName}`);
      continue;
    }

    console.log(`Searching iTunes for: ${baseName} (Original: ${app.name})`);
    const result = await searchItunes(baseName);
    
    if (result) {
      console.log(`  -> Found: ${result.trackName}`);
      app.iconURL = result.artworkUrl512 || result.artworkUrl100 || app.iconURL;
      
      if (result.screenshotUrls && result.screenshotUrls.length > 0) {
        app.screenshotURLs = result.screenshotUrls;
      }
      
      // Update the first version in versions array to match the new icon/screenshots if needed, 
      // but altstore mostly reads from the root app object.
    } else {
      console.log(`  -> Not found on iTunes.`);
    }
    
    // Be nice to the API
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`Done updating ${filepath}`);
};

const run = async () => {
  await processFile('wuxu-complete-plus.json');
  await processFile('wuxu-complete.json');
};

run();
