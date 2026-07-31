# 🏢 QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ - DỰ ÁN QTD_TOOLS (v2026.07.30-v23.00)

> **Bộ Công Cụ Nghiệp Vụ Tín Dụng & Tiền Gửi Ngoại Tuyến (Offline PWA WebApp)**  
> **Repository chính thức:** [https://github.com/qtdyentho/qtdyentho_tools.git](https://github.com/qtdyentho/qtdyentho_tools.git)  
> **Trang WebApp (Vercel Production):** [https://qtdyentho-tools.vercel.app/](https://qtdyentho-tools.vercel.app/)  
> **Tài liệu Kỹ thuật & Bảng Rà Soát Lỗi Tận Gốc:** [SYSTEM_TECHNICAL_MEMORY.md](SYSTEM_TECHNICAL_MEMORY.md)  
> **Cẩm Nang Chỉ Dẫn Kỹ Thuật & Quy Tắc Tránh Lặp Lỗi:** [DEVELOPMENT_GUIDELINES_AND_BEST_PRACTICES.md](DEVELOPMENT_GUIDELINES_AND_BEST_PRACTICES.md)  

---

## 📖 GIỚI THIỆU TỔNG QUAN

`QTD_Tools` là bộ ứng dụng Web Đơn (Single-file PWA) được phát triển riêng cho cán bộ nghiệp vụ **Quỹ Tín Dụng Nhân Dân Yên Thọ**. Ứng dụng hoạt động **Offline 100%** không cần kết nối Internet sau khi cài đặt, giúp tối ưu hóa tốc độ và tính chính xác trong công tác tư vấn tài chính, quy đổi lãi suất, lập lịch trả nợ, tạo mã VietQR thanh toán và quét/nắn/nén tài liệu hồ sơ tín dụng.

---

## 🌟 CÁC PHÂN HỆ VÀ TÍNH NĂNG CHÍNH (v2026.07.30-v23.00)

### 1. 📸 Phân Hệ Quét, Căn Chỉnh 4 Góc & Nén Tài Liệu Hồ Sơ PRO (Scan & ZIP PRO Engine)
* **Nắn phẳng 3D Homography Matrix (Perspective Warp)**: Tự động/thủ công kéo thả 4 chốt góc neon Emerald nắn tài liệu nghiêng thành trang A4 vuông vắn trong **55ms**.
* **Cân vuông góc 3D & Xoay thẳng dòng chữ (Orthogonal Rectification & Auto-Straighten)**: Ép góc vuông $90^\circ$ tuyệt đối và tự động xoay lề văn bản nằm ngang song song mép màn hình.
* **Thanh trượt vi chỉnh nghiêng & Xóa nền đen 4 góc**: Thanh trượt vi chỉnh $-15.0^\circ \dots +15.0^\circ$ (bước $0.1^\circ$), tích hợp thuật toán Pure White Base Fill & Auto-Zoom Inscribed Crop xóa sạch $100\%$ vệt đen ở 4 góc khi xoay.
* **Kính lúp phóng to góc x2.5 (Loupe Glass Magnifier Engine)**: Tự động soi chi tiết điểm nắn góc phóng đại 2.5 lần với tâm ngắm đỏ và viền Emerald rực rỡ, chặn tọa độ âm an toàn.
* **Cơ chế bám dính Pointer Capture & Snap-to-click**: Loại bỏ lệch tỷ lệ CSS `object-contain`, gán CSS `aspect-ratio` tự nhiên cho phép chạm/kéo chốt góc chính xác 1:1 không tuột tay.
* **Bộ lọc hình ảnh chuyên sâu & USM Sharpening**: Scan B&W, Magic rõ chữ kết hợp ma trận Unsharp Masking (USM) làm nổi bật nét bút bi và con dấu đỏ.
* **Hiển thị dung lượng Live & Nén JPEG thông minh**: Nhảy số KB/MB thời gian thực ngay khi chỉnh slider nén (`Gốc: 135 KB ➔ Nén: 81 KB (-40%)`).
* **Quét & Nắn tự động hàng loạt 1-Click (`processAutoBatchAllDocs()`)**: Xử lý nắn phẳng 10-20 trang hồ sơ trong **<3 giây**.
* **Tạo ảnh CCCD 2-in-1 chuyên nghiệp**: Tự động ghép 2 mặt CCCD (1 người) hoặc 4 mặt CCCD (2 người Vợ/Chồng) lên 1 trang A4 chuẩn ISO scale.
* **Xuất PDF A4 & In tài liệu an toàn (`#doc-print-iframe`)**: In/xuất tệp PDF bằng iframe ẩn chống Popup Blocker.
* **Khóa Containment chống tràn giao diện**: Khóa `w-full max-w-full overflow-x-hidden` giữ giao diện gọn gàng $100\%$.

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

## 🛠️ BẢNG TÀI LIỆU QUẢN LÝ VÀ CHỈ DẪN KỸ THUẬT

1. 📄 **[DEVELOPMENT_GUIDELINES_AND_BEST_PRACTICES.md](DEVELOPMENT_GUIDELINES_AND_BEST_PRACTICES.md)**: Cẩm nang chỉ dẫn kỹ thuật, quy tắc kiến trúc và quy trình 4 bước kiểm thử trước khi release để tuyệt đối không tái diễn lại các lỗi đã khắc phục.
2. 📄 **[SYSTEM_TECHNICAL_MEMORY.md](SYSTEM_TECHNICAL_MEMORY.md)**: Bộ tài liệu ghi nhớ kỹ thuật hệ thống và bảng rà soát chi tiết 8 lỗi đã khắc phục tận gốc.

---

© 2026 **QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ** — Đồng hành cùng sự phát triển bền vững của cộng đồng.
