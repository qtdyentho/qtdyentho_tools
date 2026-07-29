import React, { useState, useEffect } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { LoanCalculator } from './components/LoanCalculator';
import { SavingsRates } from './components/SavingsRates';
import { StandeeQR } from './components/StandeeQR';
import { QRLoa } from './components/QRLoa';
import { QRModal } from './components/QRModal';
import { Toast } from './components/Toast';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('loan');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOpenModal = (imgSrc: string, title: string) => {
    setModalImageSrc(imgSrc);
    setModalTitle(title);
    setModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'loan' && (
          <LoanCalculator
            onOpenModal={handleOpenModal}
            onToast={showToast}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsRates
            onOpenModal={handleOpenModal}
            onToast={showToast}
          />
        )}

        {activeTab === 'standee' && (
          <StandeeQR
            onOpenModal={handleOpenModal}
            onToast={showToast}
          />
        )}

        {activeTab === 'qrloa' && (
          <QRLoa
            onOpenModal={handleOpenModal}
            onToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">
          © 2026 Quỹ Tín Dụng Nhân Dân Yên Thọ — Phiên bản Vite React v13.0
        </p>
        <p className="mt-1 text-slate-600">
          Chạy siêu mượt trên Mobile iOS, Android, Desktop & PWA Offline Ready
        </p>
      </footer>

      {/* Export QR Modal */}
      <QRModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={modalImageSrc}
        title={modalTitle}
        onToast={showToast}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMsg}
        onClose={() => setToastMsg(null)}
      />
    </div>
  );
};

export default App;
