const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = (() => {
  // Let's use PowerShell tar or Compress-Archive via child_process
})();

const sourceDir = path.resolve(__dirname, 'backend');
const zipFile = path.resolve(__dirname, 'revvmotiv-backend.zip');

if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

console.log('Zipping backend folder...');
// Using tar which is built into Windows 10/11
try {
  execSync(`tar -a -cf "${zipFile}" *`, { cwd: sourceDir, stdio: 'inherit' });
  console.log('Successfully created revvmotiv-backend.zip!');
  const stats = fs.statSync(zipFile);
  console.log(`Zip size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
} catch (err) {
  console.error('Error with tar, falling back to powershell compress', err);
  execSync(`powershell -command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });
}
