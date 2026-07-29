import React, { useState, useMemo } from 'react';
import { Landmark, Download, QrCode, Percent, ArrowUpRight } from 'lucide-react';
import { parseVND, formatVND, calculateSavingsConvertedInterest, SavingsRateConfig } from '../utils/financialMath';
import { removeVietnameseTones } from '../utils/vietqr';

interface SavingsRatesProps {
  onOpenModal: (imgSrc: string, title: string) => void;
  onToast: (msg: string) => void;
}

const DEFAULT_RATES: SavingsRateConfig[] = [
  { term: '1 Tháng', ratePct: 3.5 },
  { term: '3 Tháng', ratePct: 4.0 },
  { term: '6 Tháng', ratePct: 5.2 },
  { term: '9 Tháng', ratePct: 5.5 },
  { term: '12 Tháng', ratePct: 6.0 },
  { term: '18 Tháng', ratePct: 6.3 },
  { term: '24 Tháng', ratePct: 6.5 },
];

export const SavingsRates: React.FC<SavingsRatesProps> = ({ onOpenModal, onToast }) => {
  const [customerName, setCustomerName] = useState('NGUYỄN THỊ B');
  const [depositAmountInput, setDepositAmountInput] = useState('100.000.000');
  const [selectedTermIndex, setSelectedTermIndex] = useState(4); // Default 12 tháng

  const depositAmount = useMemo(() => parseVND(depositAmountInput), [depositAmountInput]);
  const selectedConfig = DEFAULT_RATES[selectedTermIndex];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseVND(e.target.value);
    setDepositAmountInput(raw > 0 ? raw.toLocaleString('vi-VN') : '');
  };

  const calculatedInfo = useMemo(() => {
    const termMonths = parseInt(selectedConfig.term, 10) || 12;
    return calculateSavingsConvertedInterest(depositAmount, termMonths, selectedConfig.ratePct);
  }, [depositAmount, selectedConfig]);

  const memoText = useMemo(() => {
    const cleanName = removeVietnameseTones(customerName).toUpperCase();
    return `GUITIETKIEM KYHAN ${selectedConfig.term.replace(/\s+/g, '')} ${cleanName}`.trim();
  }, [customerName, selectedConfig]);

  const vietQrUrl = useMemo(() => {
    return `https://img.vietqr.io/image/COOPBANK-3800200138221012-qr_only.png?amount=${depositAmount}&addInfo=${encodeURIComponent(memoText)}`;
  }, [depositAmount, memoText]);

  const handleExportCard = () => {
    const W = 700, H = 860;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, W, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Be Vietnam Pro", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ', W / 2, 30);
    ctx.font = 'bold 18px "Be Vietnam Pro", Arial, sans-serif';
    ctx.fillText('MÃ QR GỬI TIẾT KIỆM', W / 2, 60);

    // QR Box
    const qrBox = { x: W / 2 - 210, y: 100, w: 420, h: 420 };
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrBox.x - 12, qrBox.y - 12, qrBox.w + 24, qrBox.h + 24, 16);
    ctx.fill();

    const qrImg = new Image();
    qrImg.crossOrigin = 'Anonymous';
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrBox.x, qrBox.y, qrBox.w, qrBox.h);
      drawLogo();
    };
    qrImg.onerror = () => drawLogo();
    qrImg.src = vietQrUrl;

    function drawLogo() {
      const logo = new Image();
      logo.onload = () => {
        const logoSz = 68;
        const cx = qrBox.x + qrBox.w / 2;
        const cy = qrBox.y + qrBox.h / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, logoSz / 2 + 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, logoSz / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, cx - logoSz / 2, cy - logoSz / 2, logoSz, logoSz);
        ctx.restore();
        drawInfo();
      };
      logo.onerror = drawInfo;
      logo.src = './LOgoQR.jpg';
    }

    function drawInfo() {
      const infoY = qrBox.y + qrBox.h + 40;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(40, infoY, W - 80, 210, 16);
      ctx.fill();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('Khách gửi:', 60, infoY + 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText(customerName.toUpperCase(), 180, infoY + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('Số tiền gửi:', 60, infoY + 60);
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 22px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText(formatVND(depositAmount), 180, infoY + 56);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('Kỳ hạn gửi:', 60, infoY + 105);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 16px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText(`${selectedConfig.term} (Lãi suất: ${selectedConfig.ratePct}%/năm)`, 180, infoY + 105);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('TK Nhận:', 60, infoY + 145);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('3800200138221012 (Co-opBank)', 180, infoY + 145);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px "Be Vietnam Pro", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ — Powered by QTD Tools', W / 2, H - 24);

      const dataUrl = canvas.toDataURL('image/png');
      onOpenModal(dataUrl, `Mã QR Gửi Tiết Kiệm - ${customerName}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rate Table & Deposit QR Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs & Theoretical Calculation */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Landmark className="w-5 h-5 text-blue-400" />
            Tính Lãi Tiết Kiệm Quy Đổi Lý Thuyết
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tên Khách Hàng Gửi</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Số Tiền Gửi (VNĐ)</label>
              <input
                type="text"
                value={depositAmountInput}
                onChange={handleAmountChange}
                className="w-full bg-slate-950 text-blue-400 font-bold px-4 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Select Term */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Chọn Kỳ Han Gửi Tiết Kiệm</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEFAULT_RATES.map((item, idx) => (
                <button
                  key={item.term}
                  onClick={() => setSelectedTermIndex(idx)}
                  className={`p-3 rounded-xl border font-semibold text-xs flex flex-col items-center gap-1 transition-all ${
                    selectedTermIndex === idx
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.term}</span>
                  <span className="text-amber-300 font-bold">{item.ratePct}%/năm</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theoretical Yield Result Box */}
          <div className="bg-slate-950 rounded-xl p-4 border border-blue-500/20 space-y-3">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <Percent className="w-4 h-4" />
              Kết Quả Tính Lãi Dự Kiến (Kỳ hạn {selectedConfig.term})
            </h4>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-xs text-slate-400">Tiền Lãi Đơn Nhận Được:</p>
                <p className="text-lg font-bold text-emerald-400">{formatVND(calculatedInfo.nominalInterest)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  Lãi Quy Đổi Lý Thuyết:
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </p>
                <p className="text-lg font-bold text-blue-400">{formatVND(calculatedInfo.convertedInterest)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Deposit VietQR Card */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 tracking-wide uppercase flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-blue-400" />
            Mã QR Nạp Tiền Gửi Tiết Kiệm
          </h3>

          <div className="w-full max-w-[320px] bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl flex flex-col items-center mb-5">
            <div className="relative w-full aspect-square bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden mb-3">
              <img
                src={vietQrUrl}
                alt="VietQR Tiết kiệm"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border-2 border-blue-600">
                <img src="./LOgoQR.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>

            <div className="w-full text-center space-y-1">
              <p className="text-xs text-slate-400">Số tiền chuyển gửi:</p>
              <p className="text-xl font-bold text-blue-400">{formatVND(depositAmount)}</p>
              <p className="text-xs text-slate-300 font-mono bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-800 truncate">
                {memoText}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCard}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Tải Thẻ QR HD Của Khách Hàng
          </button>
        </div>
      </div>
    </div>
  );
};
