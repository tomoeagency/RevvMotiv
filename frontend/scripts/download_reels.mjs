import fs from "fs";
import path from "path";
import https from "https";

const dir = path.join(process.cwd(), "public", "videos", "reels");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const videos = [
  {
    name: "reel_fog_light.mp4",
    url: "https://cdn.pixabay.com/video/2024/02/09/199958-911694865_tiny.mp4"
  },
  {
    name: "reel_exhaust.mp4",
    url: "https://cdn.pixabay.com/video/2024/05/06/210874_tiny.mp4"
  },
  {
    name: "reel_track_run.mp4",
    url: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4"
  },
  {
    name: "reel_street_run.mp4",
    url: "https://raw.githubusercontent.com/Kalebu/Real-time-Vehicle-Dection-Python/master/cars.mp4"
  }
];

function download(item) {
  const dest = path.join(dir, item.name);
  console.log(`Downloading ${item.name}...`);
  const file = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Saved ${item.name} (${fs.statSync(dest).size} bytes)`);
            resolve();
          });
        }).on('error', reject);
      } else {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Saved ${item.name} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const v of videos) {
    try {
      await download(v);
    } catch (e) {
      console.error("Failed:", v.name, e);
    }
  }
}

run();
