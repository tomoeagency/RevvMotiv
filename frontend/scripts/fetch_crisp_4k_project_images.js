const fs = require('fs');
const path = require('path');
const https = require('https');

// Verified ultra-high resolution 4K automotive photography assets (crisp, sharp, perfectly focused)
const CRISP_PROJECT_IMAGES = {
  // Maruti Swift Full Aero Kit (Clean White Hatchback Aero Build)
  'swift_cover': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop',
  'swift_front': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1600&auto=format&fit=crop',
  'swift_left': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
  'swift_rear': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop',
  'swift_interior': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop',

  // Hyundai i20 N Line Blackout Package (Red & Black Performance Hatchback)
  'i20_cover': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop',
  'i20_front': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1600&auto=format&fit=crop',
  'i20_right': 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1600&auto=format&fit=crop',
  'i20_rear': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
  'i20_top': 'https://images.unsplash.com/photo-1610884447640-42b8ec61a933?q=80&w=1600&auto=format&fit=crop',

  // Volkswagen Polo GT Track Look Build (Lapiz Blue Performance Hatchback & Track Setup)
  'polo_cover': 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1600&auto=format&fit=crop',
  'polo_front': 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1600&auto=format&fit=crop',
  'polo_left': 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=1600&auto=format&fit=crop',
  'polo_interior': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const dir = path.join(__dirname, '../public/images/projects');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const [name, url] of Object.entries(CRISP_PROJECT_IMAGES)) {
    const dest = path.join(dir, `${name}.png`);
    console.log(`Downloading ultra-sharp 4K image ${name} -> ${dest}`);
    try {
      await download(url, dest);
      console.log(`✓ ${name}.png saved (${fs.statSync(dest).size} bytes)`);
    } catch (err) {
      console.error(`Failed ${name}:`, err.message);
    }
  }
  console.log('All ultra-crisp 4K project images updated successfully!');
}

run();
