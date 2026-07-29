// Read QRCodeLib from PWA_QTDYENTHO.html and test Level H
const fs = require('fs');
const path = require('path');

const pwa = fs.readFileSync(path.join(__dirname, 'PWA_QTDYENTHO.html'), 'utf8');

// Extract QRCodeLib definition
const match = pwa.match(/var QRCodeLib = \([\s\S]*?\)\(\);/);
if (!match) {
    console.error("Could not find QRCodeLib!");
    process.exit(1);
}

eval(match[0]); // Define QRCodeLib

const testString = "00020101021238600010A00000072701300006970446011638002001382210120208QRIBFTTA530370454061000005802VN62320828TT STANDEE NGUYEN THI NGUYET6304CAC6";

console.log("Test string length:", testString.length);

// Test drawing with Error Correction Levels: 1 (L), 0 (M), 3 (Q), 2 (H)
[1, 0, 3, 2].forEach(eLevel => {
    let success = false;
    for (let t = 1; t <= 14; t++) {
        try {
            // Re-create QRCode instance inside QRCodeLib
            // Let's test howQRCode handles level
            const qr = new QRCode(t, eLevel);
            qr.addData(testString);
            qr.make();
            console.log(`Level ${eLevel}: Success at Type ${t}, module count = ${qr.getModuleCount()}`);
            success = true;
            break;
        } catch(e) {}
    }
    if (!success) console.log(`Level ${eLevel}: Failed for all types 1..14`);
});
