function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function calcCRC16(str) {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            else crc = (crc << 1) & 0xFFFF;
        }
    }
    let hex = crc.toString(16).toUpperCase();
    while (hex.length < 4) hex = '0' + hex;
    return hex;
}

function generateVietQREMVCoPayload(bin, accountNo, memo, amount) {
    const tag00_bank = "0006" + bin;
    const tag01_acc = "01" + pad2(accountNo.length) + accountNo;
    const subTag01 = tag00_bank + tag01_acc;
    const tag01_full = "01" + pad2(subTag01.length) + subTag01;
    const tag02_service = "0208QRIBFTTA";
    const tag38_content = "0010A000000727" + tag01_full + tag02_service;
    const tag38 = "38" + pad2(tag38_content.length) + tag38_content;
    const tag53_curr = "5303704";

    let tag54 = "";
    if (amount && Number(amount) > 0) {
        const amtStr = Math.round(Number(amount)).toString();
        tag54 = "54" + pad2(amtStr.length) + amtStr;
    }

    const tag58_country = "5802VN";

    let tag62 = "";
    if (memo && memo.trim()) {
        const memoClean = memo.trim();
        const tag08_memo = "08" + pad2(memoClean.length) + memoClean;
        tag62 = "62" + pad2(tag08_memo.length) + tag08_memo;
    }

    const payload = "000201" + "010212" + tag38 + tag53_curr + tag54 + tag58_country + tag62 + "6304";
    return payload + calcCRC16(payload);
}

const generated = generateVietQREMVCoPayload("970446", "3800200138221012", "TT STANDEE NGUYEN THI NGUYET", 100000);
const official = "00020101021238600010A00000072701300006970446011638002001382210120208QRIBFTTA530370454061000005802VN62320828TT STANDEE NGUYEN THI NGUYET6304CAC6";

console.log("GENERATED:", generated);
console.log("OFFICIAL :", official);
console.log("EXACT MATCH?", generated === official);
