/**
 * Thư viện Xuất Canvas HD (Standee, QR Loa, Thẻ QR Thanh toán Tiền vay / Tiền gửi)
 */

import { generateVietQREMVCoPayload, removeVietnameseTones } from './vietqr';

export function renderStandeeCanvas(
  canvas: HTMLCanvasElement,
  name: string,
  alias: string,
  acc: string = "3800200138221012",
  colorName: string = "#003b7a",
  colorInfo: string = "#047857",
  onDone?: () => void
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 1087, H = 1643;
  canvas.width = W;
  canvas.height = H;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const accClean = (acc || "3800200138221012").trim();
  const nameClean = (name || "NGUYEN THI NGUYET").trim().toUpperCase();
  const aliasClean = (alias || "").trim();
  const memoClean = removeVietnameseTones(`TT STANDEE ${nameClean}`).toUpperCase();

  const bgImg = new Image();
  bgImg.onload = () => {
    ctx.drawImage(bgImg, 0, 0, W, H);

    const qrX = 135, qrY = 173, qrSize = 818;
    const vietQrUrl = `https://img.vietqr.io/image/COOPBANK-${accClean}-qr_only.png?addInfo=${encodeURIComponent(memoClean)}`;
    const sepayUrl  = `https://qr.sepay.vn/img?bank=COOPBANK&acc=${accClean}&des=${encodeURIComponent(memoClean)}&template=qr_only`;

    const qrImg = new Image();
    qrImg.crossOrigin = 'Anonymous';
    qrImg.onload = () => drawQRAndLogo(qrImg);
    qrImg.onerror = () => {
      const fallbackQR = new Image();
      fallbackQR.crossOrigin = 'Anonymous';
      fallbackQR.onload = () => drawQRAndLogo(fallbackQR);
      fallbackQR.onerror = () => drawLogo();
      fallbackQR.src = sepayUrl;
    };
    qrImg.src = vietQrUrl;

    function drawQRAndLogo(img: HTMLImageElement) {
      try { ctx.drawImage(img, qrX, qrY, qrSize, qrSize); } catch(e){}
      drawLogo();
    }

    function drawLogo() {
      const logoImg = new Image();
      logoImg.onload = () => {
        const logoSize = 164;
        const centerX = qrX + (qrSize / 2);
        const centerY = qrY + (qrSize / 2);

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, (logoSize / 2) + 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#047857';
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, centerX - (logoSize / 2), centerY - (logoSize / 2), logoSize, logoSize);
        ctx.restore();

        writeText();
      };
      logoImg.onerror = writeText;
      logoImg.src = './LOgoQR.jpg';
    }

    function writeText() {
      const fontName = '"Be Vietnam Pro", Arial, sans-serif';

      // 1. Tên Chủ Tài Khoản (60px, Y=1275px)
      ctx.save();
      ctx.fillStyle = colorName || "#003b7a";
      let nameFontSize = 60;
      ctx.font = `bold ${nameFontSize}px ${fontName}`;
      const maxNameW = 780;
      while (ctx.measureText(nameClean).width > maxNameW && nameFontSize > 24) {
        nameFontSize -= 2;
        ctx.font = `bold ${nameFontSize}px ${fontName}`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(nameClean, 544, 1275);
      ctx.restore();

      // 2. Tên Alias / Cửa hàng
      ctx.save();
      ctx.fillStyle = colorInfo || "#047857";
      let aliasFontSize = 48;
      ctx.font = `bold ${aliasFontSize}px ${fontName}`;
      const maxAliasW = 780;
      const displayAlias = aliasClean ? aliasClean.toUpperCase() : "CHUYỂN KHOẢN QUÉT MÃ QR";
      while (ctx.measureText(displayAlias).width > maxAliasW && aliasFontSize > 20) {
        aliasFontSize -= 2;
        ctx.font = `bold ${aliasFontSize}px ${fontName}`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayAlias, 544, 1348);
      ctx.restore();

      // 3. Số Tài Khoản Nguồn
      ctx.save();
      ctx.fillStyle = colorInfo || "#047857";
      ctx.font = `bold 42px ${fontName}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(accClean, 440, 1420);
      ctx.restore();

      if (onDone) onDone();
    }
  };
  bgImg.src = './BackgroundQR.png';
}

export function renderQRLoaCanvas(
  canvas: HTMLCanvasElement,
  name: string,
  acc: string = "3800200138221012",
  colorName: string = "#003b7a",
  colorInfo: string = "#047857",
  onDone?: () => void
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 1087, H = 1087;
  canvas.width = W;
  canvas.height = H;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const accClean = (acc || "3800200138221012").trim();
  const nameClean = (name || "NGUYEN THI NGUYET").trim().toUpperCase();
  const memoClean = removeVietnameseTones(`TT QRLOA ${nameClean}`).toUpperCase();

  const bgImg = new Image();
  bgImg.onload = () => {
    ctx.drawImage(bgImg, 0, 0, W, H);

    const qrSize = 710, qrX = 189, qrY = 191;
    const vietQrUrl = `https://img.vietqr.io/image/COOPBANK-${accClean}-qr_only.png?addInfo=${encodeURIComponent(memoClean)}`;
    const sepayUrl  = `https://qr.sepay.vn/img?bank=COOPBANK&acc=${accClean}&des=${encodeURIComponent(memoClean)}&template=qr_only`;

    const qrImg = new Image();
    qrImg.crossOrigin = 'Anonymous';
    qrImg.onload = () => drawQRAndLogo(qrImg);
    qrImg.onerror = () => {
      const fallbackQR = new Image();
      fallbackQR.crossOrigin = 'Anonymous';
      fallbackQR.onload = () => drawQRAndLogo(fallbackQR);
      fallbackQR.onerror = () => drawLogo();
      fallbackQR.src = sepayUrl;
    };
    qrImg.src = vietQrUrl;

    function drawQRAndLogo(img: HTMLImageElement) {
      try { ctx.drawImage(img, qrX, qrY, qrSize, qrSize); } catch(e){}
      drawLogo();
    }

    function drawLogo() {
      const logoImg = new Image();
      logoImg.onload = () => {
        const logoSize = 142;
        const centerX = qrX + (qrSize / 2);
        const centerY = qrY + (qrSize / 2);

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, (logoSize / 2) + 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#047857';
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, centerX - (logoSize / 2), centerY - (logoSize / 2), logoSize, logoSize);
        ctx.restore();

        writeText();
      };
      logoImg.onerror = writeText;
      logoImg.src = './LOgoQR.jpg';
    }

    function writeText() {
      const fontName = '"Be Vietnam Pro", Arial, sans-serif';

      ctx.save();
      ctx.fillStyle = colorName || "#003b7a";
      let nameFontSize = 57;
      ctx.font = `bold ${nameFontSize}px ${fontName}`;
      const maxW = 900;
      while (ctx.measureText(nameClean).width > maxW && nameFontSize > 22) {
        nameFontSize -= 2;
        ctx.font = `bold ${nameFontSize}px ${fontName}`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(nameClean, 544, 102);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = colorInfo || "#047857";
      ctx.font = `bold 48px ${fontName}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(accClean, 544, 960);
      ctx.restore();

      if (onDone) onDone();
    }
  };
  bgImg.src = './QRLOA.png';
}
