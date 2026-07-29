import React from 'react';
import { CreditCard, Landmark, QrCode, Volume2, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export type ActiveTab = 'loan' | 'savings' | 'standee' | 'qrloa';

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOnline: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeTab, setActiveTab, isOnline }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('loan')}>
            <img 
              src="./LOgoQR.jpg" 
              alt="Co-opBank Logo" 
              className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-md object-cover"
            />
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide uppercase flex items-center gap-2">
                QTDND Yên Thọ
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  v13.0
                </span>
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Công Cụ Nghiệp Vụ Quỹ Tín Dụng
              </p>
            </div>
          </div>

          {/* Network Status Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Trực Tuyến Vercel</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400">Offline PWA</span>
              </>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-none">
          <button
            onClick={() => setActiveTab('loan')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'loan'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Lịch Trả Nợ Vay & QR
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'savings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Biểu Lãi Suất & QR Tiết Kiệm
          </button>

          <button
            onClick={() => setActiveTab('standee')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'standee'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Tạo Mã QR Standee
          </button>

          <button
            onClick={() => setActiveTab('qrloa')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'qrloa'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Tạo Thẻ QR Loa
          </button>
        </div>

      </div>
    </header>
  );
};
