import React from 'react';
import { Download, Share2, X, Check } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  title: string;
  onToast: (msg: string) => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  title,
  onToast
}) => {
  if (!isOpen || !imageSrc) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `VietQR_${title.replace(/\s+/g, '_')}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onToast('Đã tải ảnh về thiết bị thành công!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], `VietQR_${Date.now()}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title,
            text: 'Mã QR Thanh toán QTDND Yên Thọ',
            files: [file]
          });
          onToast('Đã mở menu chia sẻ!');
          return;
        }
      } catch (e) {
        console.error('Share error:', e);
      }
    }
    // Fallback if Web Share API not available
    handleDownload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-6 flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold text-white mb-4 text-center tracking-wide">
          {title}
        </h2>

        {/* Image Preview */}
        <div className="relative w-full max-h-[60vh] flex items-center justify-center bg-slate-950 rounded-xl p-2 border border-slate-800 overflow-hidden mb-6">
          <img
            src={imageSrc}
            alt={title}
            className="max-h-[55vh] object-contain rounded-lg shadow-md"
          />
        </div>

        <p className="text-xs text-slate-400 mb-6 text-center">
          💡 Trên điện thoại, bạn có thể **nhấn giữ vào ảnh** để lưu trực tiếp vào thư viện ảnh!
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Tải Mã QR
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
          >
            <Share2 className="w-4 h-4" />
            Chia Sẻ Mã QR
          </button>
        </div>

      </div>
    </div>
  );
};
