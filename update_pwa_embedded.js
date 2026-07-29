const fs = require('fs');
const path = require('path');

const pwaPath = path.join(__dirname, 'PWA_QTDYENTHO.html');
const assetsPath = path.join(__dirname, 'assets_b64.js');

let pwaContent = fs.readFileSync(pwaPath, 'utf8');
const assetsContent = fs.readFileSync(assetsPath, 'utf8');

console.log("PWA length:", pwaContent.length);
console.log("Assets length:", assetsContent.length);

// 1. Remove old asset declarations if any
pwaContent = pwaContent.replace(/\/\* EMBEDDED_ASSETS_START \*\/[\s\S]*?\/\* EMBEDDED_ASSETS_END \*\//g, '');

// 2. Inject embedded assets before "// ==================== 3. STANDEE QR & QR LOA GENERATOR ENGINE ===================="
const assetsBlock = `/* EMBEDDED_ASSETS_START */\n${assetsContent}\n/* EMBEDDED_ASSETS_END */\n`;

const targetAnchor = '// ==================== 3. STANDEE QR & QR LOA GENERATOR ENGINE ====================';
pwaContent = pwaContent.replace(targetAnchor, assetsBlock + '\n' + targetAnchor);

fs.writeFileSync(pwaPath, pwaContent, 'utf8');
console.log("Assets injected successfully into PWA_QTDYENTHO.html! New length:", pwaContent.length);
