const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5173/Website26/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  // scroll to about
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/dellv/AppData/Local/Temp/about_scroll.png' });
  await b.close();
  process.exit(0);
})();
