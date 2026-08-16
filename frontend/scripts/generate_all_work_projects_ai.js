const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECTS_AI = [
  // Project 1: Maruti Swift
  {
    name: 'swift_cover',
    prompt: 'Professional studio photography of 2023 white Maruti Swift hatchback with aggressive carbon fiber front lip splitter, carbon side skirts, lowered stance, cinematic lighting',
    seed: 201
  },
  {
    name: 'swift_front',
    prompt: 'Close up front bumper shot of 2023 white Maruti Swift with V-style carbon fiber front lip splitter, studio lighting, crisp weave detail',
    seed: 202
  },
  {
    name: 'swift_left',
    prompt: 'Side profile view of white Maruti Swift hatchback showing 2x2 twill carbon fiber side skirt extension along lower rocker panel',
    seed: 203
  },
  {
    name: 'swift_rear',
    prompt: 'Rear view of white Maruti Swift hatchback with carbon fiber quad-fin rear diffuser and dual exit chrome exhaust tips, dark background',
    seed: 204
  },
  {
    name: 'swift_interior',
    prompt: 'Modern car interior dashboard of Maruti Swift with glossy carbon fiber dash trim accents and custom leather shift knob',
    seed: 205
  },

  // Project 2: Hyundai i20 N Line
  {
    name: 'i20_cover',
    prompt: 'Red Hyundai i20 N Line hatchback with gloss black grille, black mirror caps, satin black roof wrap, studio dark background, high resolution car photography',
    seed: 301
  },
  {
    name: 'i20_front',
    prompt: 'Front angle shot of red Hyundai i20 N Line with gloss black front grille surround and blacked out car emblem, sharp lighting',
    seed: 302
  },
  {
    name: 'i20_right',
    prompt: 'Close up shot of car side mirror on red Hyundai i20 N Line featuring marble textured forged carbon fiber mirror cover cap',
    seed: 303
  },
  {
    name: 'i20_rear',
    prompt: 'Rear view of red Hyundai i20 N Line showing smoked OLED sequential tail lights lit up with bright red LED light bar pattern at night',
    seed: 304
  },
  {
    name: 'i20_top',
    prompt: 'High angle top down shot of red car showing satin black roof wrap finish contrasted against red bonnet and body pillars',
    seed: 305
  },

  // Project 3: VW Polo GT
  {
    name: 'polo_cover',
    prompt: 'Blue Volkswagen Polo GT hatchback with aggressive front lip splitter, white tyre lettering stickers, track day pit lane background',
    seed: 401
  },
  {
    name: 'polo_front',
    prompt: 'Low angle front bumper shot of blue Volkswagen Polo GT showing gloss black front chin spoiler splitter and honeycomb grille',
    seed: 402
  },
  {
    name: 'polo_left',
    prompt: 'Close up photograph of black alloy wheel on blue car with raised white rubber tyre lettering stickers on low profile tire',
    seed: 403
  },
  {
    name: 'polo_interior',
    prompt: 'Car interior door panel with high end component audio speaker driver, tweeter housing, and sound deadening material',
    seed: 404
  }
];

function downloadImage(item, dest) {
  const encodedPrompt = encodeURIComponent(item.prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&seed=${item.seed}`;
  
  return new Promise((resolve, reject) => {
    console.log(`[AI Generating] ${item.name}...`);
    const file = fs.createWriteStream(dest);

    const handleRes = (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, handleRes).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`✓ Saved ${item.name}.png (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    };

    https.get(url, handleRes).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const dir = path.join(__dirname, '../public/images/projects');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const item of PROJECTS_AI) {
    const dest = path.join(dir, `${item.name}.png`);
    try {
      await downloadImage(item, dest);
    } catch (err) {
      console.error(`Error generating ${item.name}:`, err.message);
    }
  }
  console.log('All Work Projects AI images generated successfully!');
}

run();
