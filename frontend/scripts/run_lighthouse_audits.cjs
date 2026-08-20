const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.resolve(__dirname, '../../lighthouse-reports');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
  { name: 'homepage', url: 'http://localhost:3002/' },
  { name: 'shop-clean', url: 'http://localhost:3002/shop' },
  { name: 'shop-filtered', url: 'http://localhost:3002/shop?category=splitters-side-skirts&search=swift' },
  { name: 'product-front-lip', url: 'http://localhost:3002/products/v-style-carbon-front-lip' },
  { name: 'product-side-skirts', url: 'http://localhost:3002/products/twill-weave-side-skirt-extensions' },
  { name: 'cart', url: 'http://localhost:3002/cart' },
  { name: 'checkout', url: 'http://localhost:3002/checkout' },
  { name: 'order-confirmation', url: 'http://localhost:3002/order-confirmation/1' },
  { name: 'about', url: 'http://localhost:3002/about' },
  { name: 'contact', url: 'http://localhost:3002/contact' },
  { name: 'faq', url: 'http://localhost:3002/faq' },
  { name: 'policy', url: 'http://localhost:3002/policies/terms-of-service' },
  { name: 'not-found', url: 'http://localhost:3002/non-existent-sample-page' },
  { name: 'admin-login', url: 'http://127.0.0.1:8000/admin/login' }
];

const results = [];

for (const page of PAGES) {
  for (const formFactor of ['mobile', 'desktop']) {
    const reportBase = path.join(OUTPUT_DIR, `${page.name}-${formFactor}`);
    const flags = [
      `"${page.url}"`,
      `--output=html,json`,
      `--output-path="${reportBase}"`,
      formFactor === 'mobile' ? `--preset=perf --emulated-form-factor=mobile` : `--emulated-form-factor=desktop`,
      `--throttling-method=simulate`,
      `--only-categories=performance,accessibility,best-practices,seo`,
      `--chrome-flags="--headless --no-sandbox --disable-gpu"`
    ].join(' ');

    console.log(`\n========================================`);
    console.log(`Running Lighthouse for: ${page.name} (${formFactor})`);
    console.log(`URL: ${page.url}`);
    console.log(`========================================`);

    try {
      try {
        execSync(`npx -y lighthouse ${flags}`, { stdio: 'pipe' });
      } catch (execErr) {
        // On Windows, chrome-launcher often throws EPERM on deleting %TEMP% folder after report is already written
        // Check if report file exists
      }
      
      const jsonPath = `${reportBase}.report.json`;
      if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const cats = data.categories || {};
        const audits = data.audits || {};
        
        const perf = Math.round((cats.performance?.score || 0) * 100);
        const a11y = Math.round((cats.accessibility?.score || 0) * 100);
        const bp = Math.round((cats['best-practices']?.score || 0) * 100);
        const seo = Math.round((cats.seo?.score || 0) * 100);
        
        const lcp = audits['largest-contentful-paint']?.displayValue || audits['largest-contentful-paint']?.numericValue || 'N/A';
        const cls = audits['cumulative-layout-shift']?.displayValue || audits['cumulative-layout-shift']?.numericValue || 'N/A';
        const tbt = audits['total-blocking-time']?.displayValue || audits['total-blocking-time']?.numericValue || 'N/A';
        const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
        const speedIndex = audits['speed-index']?.displayValue || 'N/A';

        // Extract opportunities
        const opps = Object.values(audits)
          .filter(a => a.details && a.details.type === 'opportunity' && a.numericValue > 30)
          .sort((a, b) => b.numericValue - a.numericValue)
          .slice(0, 3)
          .map(a => ({
            title: a.title,
            displayValue: a.displayValue,
            savingsMs: Math.round(a.numericValue),
            wastedBytes: a.details?.overallSavingsBytes || 0
          }));

        results.push({
          name: page.name,
          url: page.url,
          device: formFactor,
          perf,
          a11y,
          bp,
          seo,
          lcp,
          cls,
          tbt,
          fcp,
          speedIndex,
          opportunities: opps
        });

        console.log(`[DONE] ${page.name} (${formFactor}) -> Perf: ${perf}, A11y: ${a11y}, BestPractices: ${bp}, SEO: ${seo}, LCP: ${lcp}, CLS: ${cls}, TBT: ${tbt}`);
      } else {
        console.error(`Failed to generate report for ${page.name} (${formFactor})`);
      }
    } catch (err) {
      console.error(`Error parsing report for ${page.name} (${formFactor}):`, err.message);
    }
  }
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'summary.json'), JSON.stringify(results, null, 2));
console.log('\nAudit complete! Summary saved to lighthouse-reports/summary.json');
