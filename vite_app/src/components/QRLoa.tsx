import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2 } from 'lucide-react';
import { renderQRLoaCanvas } from '../utils/canvasExporter';

interface QRLoaProps {
  onOpenModal: (imgSrc: string, title: string) => void;
  onToast: (msg: string) => void;
}

export const QRLoa: React.FC<QRLoaProps> = ({ onOpenModal, onToast }) => {
  const [name, setName] = useState('NGUYỄN THỊ NGUYỆT');
  const [acc, setAcc] = useState('3800200138221012');
  const [colorName, setColorName] = useState('#003b7a');
  const [colorInfo, setColorInfo] = useState('#047857');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const updatePreview = () => {
    if (canvasRef.current) {
      renderQRLoaCanvas(
        canvasRef.current,
        name,
        acc,
        colorName,
        colorInfo
      );
    }
  };

  useEffect(() => {
    updatePreview();
  }, [name, acc, colorName, colorInfo]);

  const handleExport = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onOpenModal(dataUrl, `Thẻ QR Loa - ${name}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls Form */}
      <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          Tùy Chỉnh Thẻ QR Loa
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Tên Chủ Tài Khoản (In Hoa / Tiếng Việt)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            placeholder="VD: NGUYỄN THỊ NGUYỆT"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Số Tài Khoản Nguồn (Co-opBank)
          </label>
          <input
            type="text"
            value={acc}
            onChange={(e) => setAcc(e.target.value)}
            className="w-full bg-slate-950 text-emerald-400 font-bold px-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            placeholder="3800200138221012"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Màu Tên Chủ TK
            </label>
            <input
              type="color"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Màu Chữ Số TK
            </label>
            <input
              type="color"
              value={colorInfo}
              onChange={(e) => setColorInfo(e.target.value)}
              className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-600/30 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Tải Mã QR
          </button>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm"
          >
            <Share2 className="w-4 h-4" />
            Chia Sẻ Mã QR
          </button>
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-400 mb-4 tracking-wide uppercase">
          Xem Trước Thẻ QR Loa Trực Tiếp HD
        </h3>
        <div className="w-full max-w-[420px] bg-slate-950 rounded-xl border border-slate-800 p-2 shadow-2xl overflow-hidden flex justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
