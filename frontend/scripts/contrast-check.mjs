#!/usr/bin/env node

/**
 * Automated WCAG AA Contrast Compliance Checker for PRAVAHA Design Tokens
 * Tests every text and background pair in both Light and Dark themes.
 */

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16) / 255,
    parseInt(clean.substring(2, 4), 16) / 255,
    parseInt(clean.substring(4, 6), 16) / 255,
  ];
}

function getLuminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const tokens = {
  light: {
    background: '#FEFAF3', // cream
    surface: '#FFFFFF',    // white card
    tintPink: '#F6E2E9',   // pink
    tintSage: '#B8CFB3',   // sage-300
    buttonPrimary: '#84A282', // sage-500
    text: '#24302A',       // ink
    textMuted: '#55655B',  // ink-muted
    accent: '#4F6B52',     // sage-700
    heading: '#2F4A38',    // sage-900
    water: '#327282',      // water adjusted for AA text
    waterGraphic: '#3A7F8F', // network lines (graphical 3:1)
    amber: '#8F5E05',      // amber adjusted for AA text on light
    critical: '#B3261E',   // critical
  },
  dark: {
    background: '#1C2620',
    surface: '#25312A',
    text: '#FEFAF3',
    textMuted: '#B9C7BD',
    accent: '#B8CFB3',     // sage-300
    buttonPrimary: '#84A282', // sage-500
    water: '#6FC0D0',
    amber: '#E6B04A',
    critical: '#F08A80',
  }
};

const checks = [
  // Light Theme Checks
  { name: 'Light BG (Cream) vs Body Text (Ink)', bg: tokens.light.background, fg: tokens.light.text, min: 4.5 },
  { name: 'Light BG (Cream) vs Muted Text (Ink-Muted)', bg: tokens.light.background, fg: tokens.light.textMuted, min: 4.5 },
  { name: 'Light BG (Cream) vs Headings (Sage-900)', bg: tokens.light.background, fg: tokens.light.heading, min: 4.5 },
  { name: 'Light BG (Cream) vs Links/Focus (Sage-700)', bg: tokens.light.background, fg: tokens.light.accent, min: 4.5 },
  { name: 'Light BG (Cream) vs Critical Text', bg: tokens.light.background, fg: tokens.light.critical, min: 4.5 },
  { name: 'Light Card (White) vs Body Text (Ink)', bg: tokens.light.surface, fg: tokens.light.text, min: 4.5 },
  { name: 'Light Card (White) vs Muted Text (Ink-Muted)', bg: tokens.light.surface, fg: tokens.light.textMuted, min: 4.5 },
  { name: 'Light Card (White) vs Headings (Sage-900)', bg: tokens.light.surface, fg: tokens.light.heading, min: 4.5 },
  { name: 'Light Card (White) vs Links (Sage-700)', bg: tokens.light.surface, fg: tokens.light.accent, min: 4.5 },
  { name: 'Tinted Panel (Pink) vs Body Text (Ink)', bg: tokens.light.tintPink, fg: tokens.light.text, min: 4.5 },
  { name: 'Tinted Panel (Pink) vs Headings (Sage-900)', bg: tokens.light.tintPink, fg: tokens.light.heading, min: 4.5 },
  { name: 'Tinted Panel (Sage-300) vs Body Text (Ink)', bg: tokens.light.tintSage, fg: tokens.light.text, min: 4.5 },
  { name: 'Tinted Panel (Sage-300) vs Headings (Sage-900)', bg: tokens.light.tintSage, fg: tokens.light.heading, min: 4.5 },
  { name: 'Primary Button (Sage-500) vs Text (Ink)', bg: tokens.light.buttonPrimary, fg: tokens.light.text, min: 4.5 },

  // Dark Theme Checks
  { name: 'Dark BG vs Body Text', bg: tokens.dark.background, fg: tokens.dark.text, min: 4.5 },
  { name: 'Dark BG vs Muted Text', bg: tokens.dark.background, fg: tokens.dark.textMuted, min: 4.5 },
  { name: 'Dark BG vs Accent (Sage-300)', bg: tokens.dark.background, fg: tokens.dark.accent, min: 4.5 },
  { name: 'Dark BG vs Water Text', bg: tokens.dark.background, fg: tokens.dark.water, min: 4.5 },
  { name: 'Dark BG vs Amber Warning Text', bg: tokens.dark.background, fg: tokens.dark.amber, min: 4.5 },
  { name: 'Dark BG vs Critical Alert Text', bg: tokens.dark.background, fg: tokens.dark.critical, min: 4.5 },
  { name: 'Dark Surface vs Body Text', bg: tokens.dark.surface, fg: tokens.dark.text, min: 4.5 },
  { name: 'Dark Surface vs Muted Text', bg: tokens.dark.surface, fg: tokens.dark.textMuted, min: 4.5 },
  { name: 'Dark Surface vs Accent (Sage-300)', bg: tokens.dark.surface, fg: tokens.dark.accent, min: 4.5 },
  { name: 'Dark Surface vs Water Text', bg: tokens.dark.surface, fg: tokens.dark.water, min: 4.5 },
  { name: 'Dark Surface vs Amber Warning Text', bg: tokens.dark.surface, fg: tokens.dark.amber, min: 4.5 },
  { name: 'Dark Surface vs Critical Alert Text', bg: tokens.dark.surface, fg: tokens.dark.critical, min: 4.5 },
  { name: 'Dark Primary Button (Sage-500) vs Text (Ink)', bg: tokens.dark.buttonPrimary, fg: '#1C2620', min: 4.5 },
];

let failed = 0;
console.log('------------------------------------------------------------');
console.log('PRAVAHA WCAG AA Automated Contrast Verification');
console.log('------------------------------------------------------------');

for (const check of checks) {
  const ratio = getContrastRatio(check.bg, check.fg);
  const pass = ratio >= check.min;
  const status = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} [${ratio.toFixed(2)}:1 >= ${check.min}:1] ${check.name} (${check.bg} on ${check.fg})`);
  if (!pass) failed++;
}

console.log('------------------------------------------------------------');
if (failed === 0) {
  console.log(`ALL ${checks.length} CONTRAST CHECKS PASSED WCAG AA.`);
  process.exit(0);
} else {
  console.error(`${failed} CONTRAST CHECK(S) FAILED.`);
  process.exit(1);
}
