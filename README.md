# 🏢 QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ - DỰ ÁN QTD_TOOLS (v2026.07.30-v23.00)

> **Bộ Công Cụ Nghiệp Vụ Tín Dụng & Tiền Gửi Ngoại Tuyến (Offline PWA WebApp)**  
> **Repository chính thức:** [https://github.com/qtdyentho/qtdyentho_tools.git](https://github.com/qtdyentho/qtdyentho_tools.git)  
> **Trang WebApp (Vercel Production):** [https://qtdyentho-tools.vercel.app/](https://qtdyentho-tools.vercel.app/)  
> **Tài liệu Kỹ thuật & Bảng Rà Soát Lỗi Tận Gốc:** [SYSTEM_TECHNICAL_MEMORY.md](SYSTEM_TECHNICAL_MEMORY.md)  

---

## 📖 GIỚI THIỆU TỔNG QUAN

`QTD_Tools` là bộ ứng dụng Web Đơn (Single-file PWA) được phát triển riêng cho cán bộ nghiệp vụ **Quỹ Tín Dụng Nhân Dân Yên Thọ**. Ứng dụng hoạt động **Offline 100%** không cần kết nối Internet sau khi cài đặt, giúp tối ưu hóa tốc độ và tính chính xác trong công tác tư vấn tài chính, quy đổi lãi suất, lập lịch trả nợ, tạo mã VietQR thanh toán và quét/nắn/nén tài liệu hồ sơ tín dụng.

---

## 🌟 CÁC PHÂN HỆ VÀ TÍNH NĂNG CHÍNH (v2026.07.30-v23.00)

### 1. 📸 Phân Hệ Quét, Căn Chỉnh 4 Góc & Nén Tài Liệu Hồ Sơ PRO (Scan & ZIP PRO Engine)
* **Nắn phẳng 3D Homography Matrix (Perspective Warp)**: Tự động/thủ công kéo thả 4 chốt góc neon Emerald nắn tài liệu nghiêng thành trang A4 vuông vắn trong **55ms**.
* **Kính lúp phóng to góc x2.5 (Loupe Glass Magnifier Engine)**: Tự động soi chi tiết điểm nắn góc phóng đại 2.5 lần với tâm ngắm đỏ và viền Emerald rực rỡ.
* **Cơ chế bám dính Pointer Capture & Snap-to-click**: Loại bỏ lệch tỷ lệ CSS `object-contain`, cho phép chạm/kéo chốt góc chính xác 1:1 không tuột tay.
* **Bộ lọc hình ảnh chuyên sâu**: Scan B&W, Magic rõ chữ, Grayscale, Khử bóng râm.
* **Hiển thị dung lượng Live & Nén JPEG thông minh**: Nhảy số KB/MB thời gian thực ngay khi chỉnh slider nén (`Gốc: 135 KB ➔ Nén: 81 KB (-40%)`).
* **Quét & Nắn tự động hàng loạt 1-Click (`processAutoBatchAllDocs()`)**: Xử lý nắn phẳng 10-20 trang hồ sơ trong **<3 giây**.
* **Tạo ảnh CCCD 2-in-1 chuyên nghiệp**: Tự động ghép 2 mặt CCCD (1 người) hoặc 4 mặt CCCD (2 người Vợ/Chồng) lên 1 trang A4 chuẩn ISO scale.
* **Xuất PDF A4 & In tài liệu an toàn (`#doc-print-iframe`)**: In/xuất tệp PDF bằng iframe ẩn chống Popup Blocker.

### 2. 📊 Bảng Quy Đổi Lãi Suất Tiết Kiệm Tự Động & Thông Tư 04/2022/TT-NHNN
* Hỗ trợ 16 kỳ hạn tiền gửi (1 đến 36 tháng), quy đổi 5 phương thức nhận lãi.
* Rút tiết kiệm trước hạn 1 phần bảo vệ tối đa tiền lãi cho thành viên.

### 3. 🧮 Bộ Công Cụ Nghiệp Vụ Tín Dụng & Tiền Gửi
* Ước tính hạn mức vay tối đa dựa trên thu nhập ròng & DTI, lập lịch trả nợ 4 phương thức.

### 4. 📱 Tạo Mã VietQR Thanh Toán Chuẩn SePay & Co-opBank
* **QR Trả Lãi & Gốc vay**: `[HỌ TÊN] [CCCD] TRA LAI VA GOC HDTD SO [SO HD]`
* **QR Gửi Tiết Kiệm**: `[HỌ TÊN] [CCCD] GUITK [Kỳ hạn]T [Hình thức nhận lãi] Địa chỉ`

### 5. 🔄 Cài Đặt PWA Màn Hình Chính & Tự Động Cập Nhật
* Hằng số phiên bản duy nhất `CURRENT_APP_VERSION = 'v2026.07.30-v23.00'` kết nối đa nguồn GitHub Raw và Vercel Production.

---

## 🛠️ BẢNG RÀ SOÁT LỖI VÀ GIẢI PHÁP KHẮC PHỤC TẬN GỐC

| STT | Lỗi gặp phải | Nguyên nhân cốt lõi | Giải pháp khắc phục |
| :---: | :--- | :--- | :--- |
| **1** | **Hiển thị `0 KB` nén** | Khối script bị thiếu hàm `formatFileSize(bytes)`. | Khai báo hàm `formatFileSize(bytes)` chuẩn KB/MB; bảo vệ dung lượng gốc non-zero live. |
| **2** | **Nút Làm phẳng bị đơ** | Thiếu câu lệnh định nghĩa hàm `applyDocPerspectiveWarpSync()`. | Khai báo đầy đủ hàm nắn 3D Homography Matrix đồng bộ. |
| **3** | **Không kéo được 4 góc** | Thẻ canvas bị đệm đen do CSS `object-contain`. | Loại bỏ `object-contain`, đính `touch-action: none` và khớp scaleX = scaleY 1:1 với Pointer Capture. |
| **4** | **Kính lúp bị vỡ/đen ở góc** | Tọa độ `srcX < 0` bị âm khi kéo chốt góc sát lề. | Chặn tọa độ an toàn `Math.max(0, Math.min(imgW - srcW, pos.x - srcW / 2))`. |
| **5** | **Popup Blocker chặn in PDF** | Dùng `window.open` sau hàm `await` bất đồng bộ. | Sử dụng khung in ẩn tĩnh `<iframe id="doc-print-iframe"></iframe>`. |
| **6** | **Canvas đen xì toàn bộ** | `Image` chưa tải xong dữ liệu bitmap. | Tạo hàm `getLoadedDocImage(callback)` và tô nền trắng base `#ffffff`. |
| **7** | **Lệch phiên bản Update** | Mã nguồn tồn tại 3 chuỗi hằng số phiên bản khác nhau. | Thống nhất 1 hằng số duy nhất `CURRENT_APP_VERSION = 'v2026.07.30-v23.00'`. |
| **8** | **Nội dung Memo QR dư từ** | Template memo chứa tiền tố cứng `CCCD KH GUITK...`. | Loại bỏ từ thừa `CCCD`, `KH`. Chuẩn hóa nội dung ghi rõ ràng. |

Chi tiết xem tại tài liệu: 📄 **[SYSTEM_TECHNICAL_MEMORY.md](SYSTEM_TECHNICAL_MEMORY.md)**

---

© 2026 **QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ** — Đồng hành cùng sự phát triển bền vững của cộng đồng.
