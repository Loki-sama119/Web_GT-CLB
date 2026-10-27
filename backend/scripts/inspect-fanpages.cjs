const https = require('https');

const urls = [
  { name: 'CLB Tình Nguyện Xanh', url: 'https://www.facebook.com/p/CLB-T%C3%ACnh-Nguy%E1%BB%87n-Xanh-Tr%C6%B0%E1%BB%9Dng-%C4%90%E1%BA%A1i-h%E1%BB%8Dc-N%C3%B4ng-L%C3%A2m-B%E1%BA%AFc-Giang-61552769437618/' },
  { name: 'CLB Máu BAFU', url: 'https://www.facebook.com/maubafu/' },
  { name: 'CLB IT BAFU', url: 'https://www.facebook.com/Clbtinhocitbafu/' }
];

async function checkUrl(item) {
  return new Promise((resolve) => {
    https.get(item.url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ogImageMatch = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);
        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        const canonicalMatch = data.match(/rel="canonical"\s+href="([^"]+)"/i);
        resolve({
          name: item.name,
          url: item.url,
          statusCode: res.statusCode,
          title: titleMatch ? titleMatch[1] : null,
          canonical: canonicalMatch ? canonicalMatch[1] : null,
          ogImage: ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, '&') : null,
          bodySnippet: data.substring(0, 300)
        });
      });
    }).on('error', (err) => {
      resolve({ name: item.name, error: err.message });
    });
  });
}

(async () => {
  for (const item of urls) {
    const res = await checkUrl(item);
    console.log(JSON.stringify(res, null, 2));
  }
})();
