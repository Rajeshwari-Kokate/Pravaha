import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://127.0.0.1:5173';

const ROUTES = [
  { name: 'landing', path: '/', isMap: true },
  { name: 'workspace', path: '/workspace', isMap: true },
  { name: 'scenarios', path: '/scenarios', isMap: true },
  { name: 'bottleneck', path: '/bottleneck', isMap: true },
  { name: 'reports', path: '/reports/REP-2026-DEMO', isMap: false },
  { name: 'methodology', path: '/methodology', isMap: false },
  { name: 'learn', path: '/learn', isMap: false },
  { name: 'contact', path: '/contact', isMap: false },
  { name: 'privacy', path: '/privacy', isMap: false },
  { name: 'terms', path: '/terms', isMap: false },
];

const afterDir = join(process.cwd(), 'docs', 'redesign', 'after');
const lightDir = join(afterDir, 'light');
const darkDir = join(afterDir, 'dark');

mkdirSync(lightDir, { recursive: true });
mkdirSync(darkDir, { recursive: true });

function captureScreenshot(url, outPath, isMap, width = 1440, height = 900) {
  const tmpProfile = join(tmpdir(), `chrome_shot_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const webglFlags = isMap ? '--enable-webgl --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader' : '--disable-gpu';
  const cmd = `"${CHROME_PATH}" --headless --user-data-dir="${tmpProfile}" ${webglFlags} --window-size=${width},${height} --virtual-time-budget=2000 --screenshot="${outPath}" "${url}"`;
  try {
    execSync(cmd, { stdio: 'ignore', timeout: 25000 });
    console.log(`✓ Captured: ${outPath}`);
  } catch (err) {
    console.error(`✗ Error capturing ${outPath}:`, err.message);
  }
}

console.log('Capturing after screenshots in both themes...');

for (const route of ROUTES) {
  const sep = route.path.includes('?') ? '&' : '?';

  // Light
  const lightOut = join(lightDir, `${route.name}.png`);
  captureScreenshot(`${BASE_URL}${route.path}${sep}theme=light`, lightOut, route.isMap);

  // Dark
  const darkOut = join(darkDir, `${route.name}.png`);
  captureScreenshot(`${BASE_URL}${route.path}${sep}theme=dark`, darkOut, route.isMap);
}

// Mobile responsive screenshots at 390x844
console.log('Capturing responsive mobile screenshots (390px)...');
captureScreenshot(`${BASE_URL}/?theme=light`, join(afterDir, 'mobile_landing.png'), true, 390, 844);
captureScreenshot(`${BASE_URL}/workspace?theme=light`, join(afterDir, 'mobile_workspace.png'), true, 390, 844);
captureScreenshot(`${BASE_URL}/scenarios?theme=light`, join(afterDir, 'mobile_scenarios.png'), true, 390, 844);

console.log('All screenshots complete!');
