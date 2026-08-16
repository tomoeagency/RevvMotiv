const fs = require('fs');
const path = require('path');
const https = require('https');

// All 14 view angles across the 3 Work projects with consistent pure white studio background prompts
const WHITE_STUDIO_IMAGES = [
  // 1. Maruti Swift (White Studio Background)
  {
    name: 'swift_cover',
    prompt: 'Professional commercial automotive photography of a white 2023 Maruti Swift hatchback with carbon fiber front lip splitter and side skirts, parked inside a seamless pure white studio backdrop, bright soft studio lighting, soft floor shadow, high resolution crisp focus',
    seed: 501
  },
  {
    name: 'swift_front',
    prompt: 'Close up front view bumper shot of a white 2023 Maruti Swift hatchback showing V-style carbon fiber front lip splitter, isolated on a seamless pure white studio background, bright studio lighting',
    seed: 502
  },
  {
    name: 'swift_left',
    prompt: 'Side profile photograph of a white 2023 Maruti Swift hatchback showing custom carbon fiber side skirt extension along lower rocker panel, isolated on a seamless pure white studio background',
    seed: 503
  },
  {
    name: 'swift_rear',
    prompt: 'Rear bumper photograph of a white 2023 Maruti Swift hatchback with carbon fiber quad-fin rear diffuser and dual chrome exhaust tips, isolated on a seamless pure white studio background',
    seed: 504
  },
  {
    name: 'swift_interior',
    prompt: 'Clean car interior dashboard of Maruti Swift with glossy carbon fiber dash trim accents, sport gear shift knob, bright studio lighting',
    seed: 505
  },

  // 2. Hyundai i20 N Line (White Studio Background)
  {
    name: 'i20_cover',
    prompt: 'Commercial automotive photography of a Fiery Red Hyundai i20 N Line hatchback with gloss black grille and satin black roof wrap, parked inside a seamless pure white studio background, bright soft studio lighting',
    seed: 601
  },
  {
    name: 'i20_front',
    prompt: 'Front angle shot of a red Hyundai i20 N Line hatchback featuring gloss black front grille surround and blacked out car badge, isolated on a seamless pure white studio background',
    seed: 602
  },
  {
    name: 'i20_right',
    prompt: 'Close up shot of side mirror housing on a red Hyundai i20 N Line featuring forged carbon fiber mirror cap cover, isolated on a seamless pure white studio background',
    seed: 603
  },
  {
    name: 'i20_rear',
    prompt: 'Rear view photograph of a red Hyundai i20 N Line showing smoked OLED sequential tail lights lit up with red light bar, isolated on a seamless pure white studio background',
    seed: 604
  },
  {
    name: 'i20_top',
    prompt: 'High angle top down photograph of a red Hyundai i20 N Line showing satin black roof wrap contrast against red body, isolated on a seamless pure white studio background',
    seed: 605
  },

  // 3. Volkswagen Polo GT (White Studio Background)
  {
    name: 'polo_cover',
    prompt: 'Commercial automotive photography of a Lapiz Blue Volkswagen Polo GT hatchback with front splitter and white tyre lettering stickers, parked inside a seamless pure white studio background, bright studio lighting',
    seed: 701
  },
  {
    name: 'polo_front',
    prompt: 'Low angle front bumper shot of a blue Volkswagen Polo GT hatchback showing gloss black chin spoiler splitter, isolated on a seamless pure white studio background',
    seed: 702
  },
  {
    name: 'polo_left',
    prompt: 'Close up photograph of black alloy wheel rim on a blue car with white permanent rubber tyre lettering stickers, isolated on a seamless pure white studio background',
    seed: 703
  },
  {
    name: 'polo_interior',
    prompt: 'Car interior door panel with high end component audio speaker driver, tweeter housing, bright interior studio lighting',
    seed: 704
  }
];

function downloadImage(item, dest) {
  const encodedPrompt = encodeURIComponent(item.prompt);
  // Flux model with pure white background prompt
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&model=flux&seed=${item.seed}`;
  
  return new Promise((resolve, reject) => {
    console.log(`[White Studio BG Generation] ${item.name}...`);
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

  for (const item of WHITE_STUDIO_IMAGES) {
    const dest = path.join(dir, `${item.name}.png`);
    try {
      await downloadImage(item, dest);
    } catch (err) {
      console.error(`Error generating ${item.name}:`, err.message);
    }
  }
  console.log('All 14 White Studio Background AI images generated successfully!');
}

run();
