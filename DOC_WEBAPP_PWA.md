# 🏢 QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ — BỘ CÔNG CỤ NGHIỆP VỤ QTD_TOOLS
> **Tài Liệu Chi Tiết Chức Năng WebApp Offline (PWA)**  
> **Phiên bản:** `v2026.07.30-v22.00`  
> **Phát triển cho:** Cán bộ nghiệp vụ Quỹ Tín Dụng Nhân Dân Yên Thọ

---

## 📖 1. GIỚI THIỆU TỔNG QUAN

`QTD_Tools` là bộ ứng dụng Web Đơn (Single-File Progressive Web App - PWA) được thiết kế và tối ưu hóa đặc thù cho cán bộ nghiệp vụ Quỹ Tín Dụng Nhân Dân Yên Thọ. 

Ứng dụng cho phép hoạt động **Offline 100%** trên điện thoại thông minh (iOS/Android), máy tính bảng và PC mà không cần kết nối mạng Internet sau khi truy cập lần đầu. Ứng dụng hỗ trợ tối đa tốc độ xử lý, độ chính xác tính toán lãi suất, hạn mức cho vay, dòng tiền và tự động hóa tạo mã VietQR thanh toán chuyển khoản.

---

## 🏗️ 2. KIẾN TRÚC KỸ THUẬT WEBAPP (SINGLE-FILE PWA)

- **Cấu trúc Single-File Monolithic**: Toàn bộ mã HTML, CSS (Tailwind CSS CDN), JavaScript logic và tài nguyên hình ảnh (Base64 Data URIs) được tích hợp trong 1 file duy nhất (`index.html` / `PWA_QTDYENTHO.html`).
- **Cơ chế PWA (Progressive Web App)**:
  - Tích hợp Dynamic Web App Manifest và Meta Tags cho iOS Safari / Android Chrome.
  - Cho phép cài đặt ứng dụng ra Màn hình chính (Home Screen) như Native App.
  - Tích hợp hàm kiểm tra cập nhật tự động `checkAppUpdate()` kết nối trực tiếp đến GitHub Raw để nâng cấp phiên bản khi có Internet.
- **Tài nguyên Base64 nhúng sẵn**:
  - `ASSET_LOGO`: Logo Quỹ Tín Dụng Nhân Dân Yên Thọ.
  - `ASSET_BG_STANDEE`: Phôi phông nền Thẻ Standee QR (`BackgroundQR.png`, kích thước 1087x1643).
  - `ASSET_BG_QRLOA`: Phôi phông nền Thẻ QR LOA Thanh Toán (`QRLOA.png`, kích thước 1088x1092).

---

## 📊 3. DANH SÁCH CÁC PHÂN HỆ VÀ CHỨC NĂNG CHÍNH

### 3.1. 📈 Bảng Quy Đổi Lãi Suất Tiết Kiệm Tự Động
- Hỗ trợ 16 kỳ hạn gửi tiết kiệm chuẩn (từ 1 tháng đến 36 tháng).
- Cho phép nhập lãi suất thực tế tại quầy (%/năm) để hệ thống tự động quy đổi dòng tiền sang các phương thức:
  - **Lãi cuối kỳ**: Lãi nhận 1 lần khi đáo hạn.
  - **Lĩnh lãi hàng tháng**: Định kỳ nhận tiền lãi mỗi tháng.
  - **Lĩnh lãi hàng quý**: Định kỳ nhận tiền lãi mỗi 3 tháng.
  - **Lĩnh lãi trước**: Nhận toàn bộ tiền lãi ngay thời điểm gửi.
  - **Gửi góp định kỳ**: Tiết kiệm tích lũy gửi thêm hàng tháng.

### 3.2. ⚖️ Rút Tiết Kiệm Trước Hạn 1 Phần (Thông Tư 04/2022/TT-NHNN)
- Mô phỏng chính xác nghiệp vụ rút một phần tiền gửi tiết kiệm trước hạn theo quy định của NHNN:
  - **Phần tiền rút trước hạn**: Tính lãi suất Không kỳ hạn theo số ngày thực tế gửi.
  - **Phần tiền còn lại**: Tiếp tục giữ nguyên kỳ hạn và hưởng lãi suất cam kết ban đầu.
- Hiển thị so sánh trực quan số tiền lãi bảo vệ được cho thành viên so với việc rút 100% sổ tiết kiệm.

### 3.3. 🧮 Bộ Công Cụ Nghiệp Vụ Tiền Vay & Tiết Kiệm
- **Tiết kiệm mục tiêu**: Tính toán số tiền gửi định kỳ hàng tháng để đạt được số tiền mục tiêu trong tương lai.
- **Ước tính hạn mức cho vay (DTI & Thu nhập ròng)**: Tính toán hạn mức cho vay tối đa dựa trên tổng thu nhập, chi phí sinh hoạt và chỉ số DTI (Debt-to-Income).
- **Lập lịch trả nợ tín dụng (4 phương thức)**:
  1. *Lãi hàng tháng - Gốc cuối kỳ*.
  2. *Dư nợ giảm dần* (Gốc chia đều hàng tháng + Lãi theo dư nợ thực tế).
  3. *Trả đều hàng tháng (Annuity)*.
  4. *Trả gốc định kỳ theo quý/năm*.

### 3.4. 📱 Phân Hệ Tạo Mã VietQR Thanh Toán Chuẩn EMVCo 247
- Tự động sinh mã VietQR thanh toán chuẩn Co-opBank (BIN `970446`).
- Hỗ trợ 4 chế độ tạo mã QR:
  - **QR Tiền vay**: Thu nợ gốc và lãi theo hợp đồng tín dụng.
  - **QR Tiết kiệm**: Nạp tiền gửi tiết kiệm vào tài khoản Quỹ.
  - **Thẻ Standee QR**: Xuất file ảnh Thẻ Standee để bàn khổ A4.
  - **Thẻ QR LOA Thanh toán**: Xuất file ảnh Thẻ QR khổ vuông dán loa thông báo thanh toán.


### 3.6. 📸 Phân Hệ Quét, Căn Chỉnh 4 Góc & Nén Tài Liệu Hồ Sơ PRO
- **Tính năng 4-CornerPerspective Crop**: Thuật toán làm phẳng ảnh biến dạng góc chụp, kính lúp loupe soi góc chính xác từng pixel.
- **Động cơ nén & Khử nhiễu**: Cho phép chuyển đổi ảnh scan màu/B&W, nén dung lượng file ảnh xuống dưới 500KB - 2MB trực tiếp trên Client.
- **Dàn trang PDF N-Up & Ghép CCCD**: Hỗ trợ xuất file PDF A4 ghép 1-8 ảnh/trang và Modal ghép 2-4 mặt thẻ CCCD/CMND chuẩn kích thước A4 in ấn.

### 3.5. 🖨️ In Báo Cáo Chính Thức & Xuất File Excel
- **Chế độ In Báo Cáo**: Tự động ẩn các công cụ điều hướng, format trang in A4 chuẩn có khung chữ ký 3 bên (*Người lập*, *Kiểm soát viên*, *Ban Giám đốc*).
- **Xuất Excel**: Cho phép xuất dữ liệu bảng quy đổi lãi suất và lịch trả nợ ra file `.xls` tương thích Microsoft Excel.

---

## 🛠️ 4. HƯỚNG DẪN CÀI ĐẶT VÀ BẢO TRÌ

### Đẩy mã nguồn và Triển khai
1. Repository chính thức trên GitHub: [https://github.com/qtdyentho/qtdyentho_tools.git](https://github.com/qtdyentho/qtdyentho_tools.git)
2. Kênh Deploy Vercel Online: Tự động biên dịch từ nhánh `main`, điều hướng tất cả đường dẫn về `index.html`.

### Cập nhật ứng dụng khi có phiên bản mới
- Cán bộ bấm nút **"Cập Nhật"** trên thanh Header hoặc Menu cài đặt. Ứng dụng sẽ xóa Cache cũ và tải bản HTML mới nhất từ GitHub Raw.

---
© 2026 **QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ** — Tất cả quyền được bảo lưu.
