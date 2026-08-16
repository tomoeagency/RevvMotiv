const fs = require('fs');
const path = require('path');
const potrace = require('potrace');

const files = [
  'C:\\Users\\Sujeet Kansal\\Downloads\\ChatGPT Image Aug 9, 2026, 12_46_38 PM.png',
  'C:\\Users\\Sujeet Kansal\\Downloads\\33a13af8-9847-4193-a825-21efc7e33fb0.png',
  'C:\\Users\\Sujeet Kansal\\Downloads\\ChatGPT Image Aug 9, 2026, 12_46_46 PM.png'
];

function getPngDimensions(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) {
    throw new Error("Invalid PNG header");
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

async function convertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const parsedPath = path.parse(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const { width, height } = getPngDimensions(fileBuffer);
  const base64Data = fileBuffer.toString('base64');
  const mimeType = 'image/png';

  // 1. High-fidelity color SVG
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" xlink:href="data:${mimeType};base64,${base64Data}"/>
</svg>`;

  const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.svg`);
  fs.writeFileSync(outputPath, svgContent, 'utf8');
  console.log(`[Full Color SVG] Created: ${outputPath} (${width}x${height})`);

  // 2. Pure Vector Path SVG via Potrace
  return new Promise((resolve) => {
    potrace.trace(filePath, { color: '#000000', threshold: 128 }, (err, vectorSvg) => {
      if (!err) {
        const vectorOutputPath = path.join(parsedPath.dir, `${parsedPath.name}.vector.svg`);
        fs.writeFileSync(vectorOutputPath, vectorSvg, 'utf8');
        console.log(`[Pure Vector SVG] Created: ${vectorOutputPath}`);
      } else {
        console.error(`Vector trace error on ${parsedPath.name}:`, err.message);
      }
      resolve();
    });
  });
}

async function main() {
  for (const f of files) {
    await convertFile(f);
  }
}

main();
