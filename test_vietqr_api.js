const https = require('https');

// Sample parameters
const bin = "970446"; // Co-opBank
const acc = "3800200138221012";
const memo = "TT STANDEE NGUYEN THI NGUYET";

const postData = JSON.stringify({
    accountNo: acc,
    accountName: "NGUYEN THI NGUYET",
    acqId: bin,
    amount: 100000,
    addInfo: memo,
    template: "qr_only"
});

const options = {
    hostname: 'api.vietqr.io',
    port: 443,
    path: '/v2/generate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("RESPONSE:", JSON.stringify(json, null, 2));
        } catch(e) {
            console.log("RAW RESPONSE:", data);
        }
    });
});

req.on('error', (e) => {
    console.error("REQUEST ERROR:", e.message);
});

req.write(postData);
req.end();
