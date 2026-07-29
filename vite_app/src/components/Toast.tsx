import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center bg-slate-900/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-emerald-500/30 animate-bounce">
      <span className="text-sm font-medium mr-3">{message}</span>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white font-bold ml-2 focus:outline-none"
      >
        ✕
      </button>
    </div>
  );
};
