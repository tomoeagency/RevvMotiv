const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES = {
  // Products - Splitters & Side Skirts
  'v_style_carbon_front_lip': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop',
  'twill_side_skirts': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
  'abs_chin_spoiler': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  'front_splitter_winglets': 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop',
  'gloss_black_side_skirts': 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=800&auto=format&fit=crop',

  // Products - Spoilers
  'gt_style_rear_wing': 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=800&auto=format&fit=crop',
  'carbon_trunk_spoiler': 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=800&auto=format&fit=crop',
  'ducktail_spoiler': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop',
  'roof_spoiler_extension': 'https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=800&auto=format&fit=crop',
  'adjustable_rear_wing': 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=800&auto=format&fit=crop',

  // Products - Mirror Caps & Batman Cover
  'forged_carbon_mirror_caps': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop',
  'bat_wing_hood_vents': 'https://images.unsplash.com/photo-1610884447640-42b8ec61a933?q=80&w=800&auto=format&fit=crop',
  'batman_mirror_covers': 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop',
  'bat_window_louver': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',

  // Products - Tyre Stickers
  'tyre_stickers_white': 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=800&auto=format&fit=crop',
  'tyre_stickers_red': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop',
  'tyre_stickers_yellow': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop',

  // Products - Diffusers
  'quad_fin_diffuser': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop',
  'carbon_rear_diffuser': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
  'gloss_black_diffuser': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800&auto=format&fit=crop',

  // Products - Lights & Flashers
  'oled_sequential_tails': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop',
  'led_drl_fog_lamps': 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=800&auto=format&fit=crop',
  'sequential_mirror_indicators': 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?q=80&w=800&auto=format&fit=crop',
  'led_halo_rings': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop',

  // Products - Car Audio & Utilities
  'high_flow_downpipe': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop',
  'component_speaker_kit': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
  'subwoofer_amp_combo': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
  'carplay_head_unit': 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
  'dash_cam_night_vision': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format&fit=crop',

  // Projects - Car Builds
  'swift_aero_cover': 'https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1200&auto=format&fit=crop',
  'swift_aero_front': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop',
  'swift_aero_side': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop',
  'swift_aero_rear': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop',
  
  'i20_blackout_cover': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
  'i20_blackout_front': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1000&auto=format&fit=crop',
  'i20_blackout_side': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop',
  'i20_blackout_rear': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1000&auto=format&fit=crop',

  'polo_track_cover': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  'polo_track_front': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop',
  'polo_track_side': 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=1000&auto=format&fit=crop',
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
  const baseDir = path.join(__dirname, '../public/images');
  const prodDir = path.join(baseDir, 'products');
  const projDir = path.join(baseDir, 'projects');

  if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });
  if (!fs.existsSync(projDir)) fs.mkdirSync(projDir, { recursive: true });

  for (const [name, url] of Object.entries(IMAGES)) {
    const isProj = name.startsWith('swift_') || name.startsWith('i20_') || name.startsWith('polo_');
    const folder = isProj ? projDir : prodDir;
    const dest = path.join(folder, `${name}.png`);

    console.log(`Downloading ${name} -> ${dest}`);
    try {
      await download(url, dest);
    } catch (err) {
      console.error(`Failed ${name}:`, err.message);
    }
  }
  console.log('All images downloaded successfully.');
}

run();
