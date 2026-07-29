import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'LOgoQR.jpg', 'BackgroundQR.png', 'QRLOA.png'],
      manifest: {
        name: 'Công Cụ Nghiệp Vụ - QTDND Yên Thọ',
        short_name: 'QTD Tools',
        description: 'Bộ công cụ tính lãi tiết kiệm, lịch trả nợ & tạo mã VietQR Standee/QR Loa Quỹ Tín Dụng Nhân Dân Yên Thọ',
        theme_color: '#047857',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'LOgoQR.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'LOgoQR.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
