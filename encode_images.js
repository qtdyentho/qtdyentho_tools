const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const logoData = fs.readFileSync(path.join(dir, 'LOgoQR.jpg'));
const qrloaData = fs.readFileSync(path.join(dir, 'QRLOA.png'));

const logoB64 = logoData.toString('base64');
const qrloaB64 = qrloaData.toString('base64');

console.log('LOGO_LEN=' + logoB64.length);
console.log('QRLOA_LEN=' + qrloaB64.length);

fs.writeFileSync(path.join(dir, 'logo_b64.txt'), logoB64, 'utf8');
fs.writeFileSync(path.join(dir, 'qrloa_b64.txt'), qrloaB64, 'utf8');
console.log('Done');
