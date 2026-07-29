/**
 * Thư viện sinh chuỗi VietQR EMVCo chuẩn Napas
 * Ngân hàng: Co-opBank (BIN 970446)
 * Tài khoản mặc định: 3800200138221012
 */

export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

export function calcCRC16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  let hex = (crc & 0xffff).toString(16).toUpperCase();
  while (hex.length < 4) hex = '0' + hex;
  return hex;
}

export function generateVietQREMVCoPayload(
  bin: string = "970446",
  accountNumber: string = "3800200138221012",
  memo: string = "",
  amount: number = 0
): string {
  const cleanAcc = (accountNumber || "3800200138221012").trim();
  const cleanBin = (bin || "970446").trim();

  // Sub-tag 00 (GUID): A000000727
  const tag38_00 = "0010A000000727";
  // Sub-tag 01 (Beneficiary Org): 0006 + BIN (e.g. 970446) + 01 + AccLength + AccNumber
  const tag38_01_00 = "0006" + cleanBin;
  const tag38_01_01 = "01" + String(cleanAcc.length).padStart(2, '0') + cleanAcc;
  const tag38_01 = "01" + String((tag38_01_00 + tag38_01_01).length).padStart(2, '0') + tag38_01_00 + tag38_01_01;
  // Sub-tag 02 (Service Code): QRIBFTTA
  const tag38_02 = "0208QRIBFTTA";

  const tag38Content = tag38_00 + tag38_01 + tag38_02;
  const tag38 = "38" + String(tag38Content.length).padStart(2, '0') + tag38Content;

  // Tag 00 (Payload Format): 01
  const tag00 = "000201";
  // Tag 01 (Initiation Method): 12 (Dynamic with amount/memo) or 11 (Static)
  const tag01 = (amount > 0 || memo) ? "010212" : "010211";
  // Tag 53 (Currency): 704 (VND)
  const tag53 = "5303704";

  // Tag 54 (Amount if present)
  let tag54 = "";
  if (amount > 0) {
    const amtStr = String(Math.round(amount));
    tag54 = "54" + String(amtStr.length).padStart(2, '0') + amtStr;
  }

  // Tag 58 (Country Code): VN
  const tag58 = "5802VN";

  // Tag 62 (Additional Data Field: Reference / Memo)
  let tag62 = "";
  if (memo && memo.trim().length > 0) {
    const cleanMemo = removeVietnameseTones(memo.trim()).toUpperCase();
    const sub62_08 = "08" + String(cleanMemo.length).padStart(2, '0') + cleanMemo;
    tag62 = "62" + String(sub62_08.length).padStart(2, '0') + sub62_08;
  }

  const rawPayloadWithoutCRC = tag00 + tag01 + tag38 + tag53 + tag54 + tag58 + tag62 + "6304";
  const crc = calcCRC16(rawPayloadWithoutCRC);

  return rawPayloadWithoutCRC + crc;
}
