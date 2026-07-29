const https = require('https');

function checkUrl(url) {
    https.get(url, (res) => {
        console.log(`URL: ${url}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`CORS Header: ${res.headers['access-control-allow-origin']}`);
        console.log('---');
    }).on('error', (e) => {
        console.error(`Error for ${url}:`, e.message);
    });
}

checkUrl('https://img.vietqr.io/image/COOPBANK-3800200138221012-qr_only.png');
checkUrl('https://qr.sepay.vn/img?bank=COOPBANK&acc=3800200138221012&template=qr_only');
checkUrl('https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=COOPBANK');
