const https = require('https');
const fs = require('fs');
const path = require('path');

const targets = [
  {
    name: 'tinh-nguyen-xanh',
    url: 'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=61552769437618',
    file: 'tinh-nguyen-xanh-logo.png'
  },
  {
    name: 'mau-bafu',
    url: 'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=100067907626019',
    file: 'mau-bafu-logo.png'
  },
  {
    name: 'it-bafu',
    url: 'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=61583259722488',
    file: 'it-bafu-logo.png'
  }
];

const destDir = path.join(__dirname, '../../frontend/public/images/clubs');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const contentType = res.headers['content-type'];
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stat = fs.statSync(destPath);
        resolve({ contentType, size: stat.size });
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const t of targets) {
    const dest = path.join(destDir, t.file);
    try {
      const res = await downloadImage(t.url, dest);
      console.log(`Downloaded ${t.file}: ${res.contentType}, ${res.size} bytes`);
    } catch (err) {
      console.error(`Failed ${t.file}: ${err.message}`);
    }
  }
})();
