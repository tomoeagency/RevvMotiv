const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES = [
  {
    name: 'transformation_stock_before',
    prompt: 'Commercial automotive studio photography of a stock factory standard white Porsche 911 coupe parked in a pristine modern white automotive studio with bright overhead white LED grid lights, polished light grey floor, clean white wall background. 3/4 front side angle view. Standard factory alloy wheels, factory OEM ride height, standard OEM front bumper and side skirts, no modifications, clean showroom lighting, 8k hyperrealistic automotive photography',
    seed: 8881
  },
  {
    name: 'transformation_tuned_after',
    prompt: 'Commercial automotive studio photography of a heavily modified tuned white Porsche 911 coupe with carbon fiber front splitter, aggressive carbon side skirts, lowered track coilover suspension stance, forged black deep-dish racing wheels with bold white tire lettering stickers, carbon mirror caps, parked in the exact same pristine white automotive studio with bright overhead white LED grid lights, polished light grey floor. Exact same 3/4 front side angle view, 8k hyperrealistic automotive photography',
    seed: 8881
  }
];

function downloadImage(item, dest) {
  const encodedPrompt = encodeURIComponent(item.prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=900&nologo=true&model=flux&seed=${item.seed}`;

  return new Promise((resolve, reject) => {
    console.log(`[Generating] ${item.name}...`);
    const file = fs.createWriteStream(dest);

    const handleRes = (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, handleRes).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`✓ Saved ${item.name}.png (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
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
  const dir = path.join(__dirname, '../public/images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const item of IMAGES) {
    const dest = path.join(dir, `${item.name}.png`);
    await downloadImage(item, dest);
  }
  console.log('Before / After Transformation studio images ready!');
}

run();
