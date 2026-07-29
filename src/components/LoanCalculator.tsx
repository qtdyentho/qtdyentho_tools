import React, { useState, useMemo, useRef } from 'react';
import { Calculator, Download, Share2, Calendar, FileText, QrCode } from 'lucide-react';
import { calculateLoanSchedule, formatVND, parseVND, LoanScheduleRow } from '../utils/financialMath';
import { generateVietQREMVCoPayload, removeVietnameseTones } from '../utils/vietqr';

interface LoanCalculatorProps {
  onOpenModal: (imgSrc: string, title: string) => void;
  onToast: (msg: string) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onOpenModal, onToast }) => {
  const [customerName, setCustomerName] = useState('NGUYỄN VĂN A');
  const [contractNo, setContractNo] = useState('HD-2026/088');
  const [loanAmountInput, setLoanAmountInput] = useState('50.000.000');
  const [loanMonths, setLoanMonths] = useState(12);
  const [annualRate, setAnnualRate] = useState(10.5);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Payment Selection
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(1);

  const loanAmount = useMemo(() => parseVND(loanAmountInput), [loanAmountInput]);
  const scheduleRows = useMemo(() => {
    return calculateLoanSchedule(loanAmount, loanMonths, annualRate, startDate);
  }, [loanAmount, loanMonths, annualRate, startDate]);

  const selectedRow = useMemo(() => {
    if (!selectedPeriod) return null;
    return scheduleRows.find(r => r.period === selectedPeriod) || null;
  }, [selectedPeriod, scheduleRows]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseVND(e.target.value);
    setLoanAmountInput(raw > 0 ? raw.toLocaleString('vi-VN') : '');
  };

  const memoText = useMemo(() => {
    const cleanName = removeVietnameseTones(customerName).toUpperCase();
    const pStr = selectedPeriod ? ` KY ${selectedPeriod}` : '';
    return `TT TIEN VAY ${contractNo} ${cleanName}${pStr}`.trim();
  }, [customerName, contractNo, selectedPeriod]);

  const qrAmount = useMemo(() => {
    return selectedRow ? selectedRow.totalPay : loanAmount;
  }, [selectedRow, loanAmount]);

  const vietQrUrl = useMemo(() => {
    return `https://img.vietqr.io/image/COOPBANK-3800200138221012-qr_only.png?amount=${qrAmount}&addInfo=${encodeURIComponent(memoText)}`;
  }, [qrAmount, memoText]);

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
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, W, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Be Vietnam Pro", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ', W / 2, 30);
    ctx.font = 'bold 18px "Be Vietnam Pro", Arial, sans-serif';
    ctx.fillText('MÃ QR THANH TOÁN TIỀN VAY', W / 2, 60);

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
      ctx.fillText('Khách hàng:', 60, infoY + 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText(customerName.toUpperCase(), 180, infoY + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('Số tiền trả:', 60, infoY + 60);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 22px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText(formatVND(qrAmount), 180, infoY + 56);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText('Nội dung:', 60, infoY + 105);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 14px "Be Vietnam Pro", Arial, sans-serif';
      ctx.fillText(memoText, 180, infoY + 105);

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
      onOpenModal(dataUrl, `Mã QR Tiền Vay - ${customerName}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form & QR Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-emerald-400" />
            Thông Tin Hợp Đồng Nợ Vay
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tên Khách Hàng Vay</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Số Hợp Đồng Vay</label>
              <input
                type="text"
                value={contractNo}
                onChange={(e) => setContractNo(e.target.value)}
                className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Số Tiền Vay (VNĐ)</label>
              <input
                type="text"
                value={loanAmountInput}
                onChange={handleAmountChange}
                className="w-full bg-slate-950 text-emerald-400 font-bold px-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Thời Hạn Vay (Tháng)</label>
              <input
                type="number"
                value={loanMonths}
                onChange={(e) => setLoanMonths(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Lãi Suất (%/năm)</label>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Ngày Bắt Đầu Giải Ngân</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Payment VietQR Card */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 tracking-wide uppercase flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-400" />
            Mã QR Thanh Toán Tiền Vay
          </h3>

          <div className="w-full max-w-[320px] bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl flex flex-col items-center mb-5">
            <div className="relative w-full aspect-square bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden mb-3">
              <img
                src={vietQrUrl}
                alt="VietQR Tiền vay"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border-2 border-emerald-600">
                <img src="./LOgoQR.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>

            <div className="w-full text-center space-y-1">
              <p className="text-xs text-slate-400">Số tiền cần thanh toán:</p>
              <p className="text-xl font-bold text-emerald-400">{formatVND(qrAmount)}</p>
              <p className="text-xs text-slate-300 font-mono bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-800 truncate">
                {memoText}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCard}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Tải Thẻ QR HD Của Khách Hàng
          </button>
        </div>
      </div>

      {/* Loan Schedule Table */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          Bảng Lịch Trả Nợ Vay (Số dư giảm dần)
        </h3>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Kỳ</th>
                <th className="py-3 px-4">Ngày Trả</th>
                <th className="py-3 px-4 text-right">Gốc Trả</th>
                <th className="py-3 px-4 text-right">Lãi Trả</th>
                <th className="py-3 px-4 text-right">Tổng Cộng</th>
                <th className="py-3 px-4 text-right">Gốc Còn Lại</th>
                <th className="py-3 px-4 text-center">Tạo QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {scheduleRows.map((row) => (
                <tr
                  key={row.period}
                  className={`hover:bg-slate-800/50 transition-colors ${
                    selectedPeriod === row.period ? 'bg-emerald-950/40 border-l-4 border-emerald-500' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-white">{row.period}</td>
                  <td className="py-3 px-4">{row.dateStr}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-200">{formatVND(row.principalPay)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-400">{formatVND(row.interestPay)}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">{formatVND(row.totalPay)}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">{formatVND(row.remainingPrincipal)}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedPeriod(row.period)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        selectedPeriod === row.period
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {selectedPeriod === row.period ? 'Đã Chọn' : 'Chọn QR'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
