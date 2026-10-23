# 🏢 QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ — PHÂN HỆ TẠO MÃ VIETQR EMVCo 247
> **Tài Liệu Chi Tiết Kỹ Thuật & Cấu Trúc Mã VietQR (QTD_Tools)**  
> **Phiên bản:** `v2026.08.02-v34.00`  
> **Phát triển cho:** Cán bộ nghiệp vụ Quỹ Tín Dụng Nhân Dân Yên Thọ

---

## 📌 1. GIỚI THIỆU TỔNG QUAN

Phân hệ VietQR trong bộ ứng dụng `QTD_Tools` cung cấp giải pháp tạo mã QR thanh toán chuẩn **EMVCo 247 / VietQR / NAPAS** cho **Ngân hàng Hợp tác xã Việt Nam (Co-opBank)**. 

Hệ thống hoạt động theo cơ chế **Đa tầng bền vững (Multi-tier Resilient Engine)**:
1. **Tầng 1 (Ưu tiên chuẩn mực số 1)**: Gọi trực tiếp **VietQR API chính thức (`img.vietqr.io`)** — đảm bảo 100% chuẩn định dạng EMVCo, tỷ lệ khung hình, khoảng viền an toàn (Quiet Zone) và kích thước chuẩn xác từng pixel trên phôi Standee, QR Loa và QR Card, tương thích hoàn hảo với tất cả ứng dụng ngân hàng (Co-opBank Mobile, Vietcombank, BIDV, Agribank, VietinBank, MB, Techcombank,...).
2. **Tầng 2 (Dự phòng đối tác)**: Tự động chuyển tiếp sang **Sepay API (`qr.sepay.vn`)** nếu kết nối tới cổng VietQR bị chậm hoặc gián đoạn.
3. **Tầng 3 (Dự phòng Offline thuần túy)**: Tự động chuyển đổi sang bộ sinh vector QR nội bộ (`QRCodeLib.drawQR`) khi thiết bị hoàn toàn không có kết nối Internet, đảm bảo ứng dụng không bao giờ bị gián đoạn hoạt động.

---

## ⚙️ 2. THÔNG SỐ VÀ CẤU TRÚC CHUỖI EMVCo 247 CO-OPBANK

Mã VietQR tuân thủ chuẩn EMVCo QRCode Specification. Chuỗi payload được xây dựng bằng hàm `generateVietQREMVCoPayload(bin, accountNo, memo, amount)` có cấu trúc như sau:

| Tag | Tên trường | Chi tiết thông số & Giá trị mẫu |
| :--- | :--- | :--- |
| **00** | Payload Format Indicator | `000201` (Phiên bản EMVCo 01) |
| **01** | Point of Initiation Method | `010212` (QR Động - Có số tiền) hoặc `010211` (QR Tĩnh - Không số tiền) |
| **38** | Merchant Account Information | Định danh Ngân hàng & Tài khoản thụ hưởng:<br>- Sub-00 (AID): `0010A000000727` (VietQR / NAPAS 247)<br>- Sub-01 (Org Info): `013000069704460116[SO_TAI_KHOAN]`<br>  + BIN Co-opBank: `970446` (Sub-sub-00: `0006970446`)<br>  + Số TK / Alias Co-opBank: `01[LEN][STK_HOAC_ALIAS]`<br>- Sub-02 (Service Code): `0208QRIBFTTA` (Chuyển khoản đến STK) |
| **53** | Transaction Currency | `5303704` (Đồng Việt Nam - VND ISO 4217 code `704`) |
| **54** | Transaction Amount | `54[LEN][SO_TIEN]` (Số tiền làm tròn đơn vị VNĐ, ví dụ `5406740000`) |
| **58** | Country Code | `5802VN` (Việt Nam) |
| **62** | Additional Data Field | `62[LEN]08[LEN][NOI_DUNG]` (Nội dung chuyển khoản chuẩn hóa không dấu, tối đa 50 ký tự ASCII) |
| **63** | CRC16 Checksum | `6304[CHECKSUM]` (Mã kiểm lỗi 4 ký tự Hexadecimal tính theo ISO/IEC 13239) |

---

## 📱 3. CÁC PHÂN HỆ TẠO MÃ QR VÀ QUY TẮC NGHIỆP VỤ

### 3.1. 🏦 QR Tiền Vay (`qr-loan`)
- **Tối ưu hóa Nội dung chuyển tiền NAPAS 247**: Chuẩn hóa cú pháp nội dung ngắn gọn dưới 50 ký tự ASCII không dấu, tích hợp bộ đếm số ký tự thời gian thực (`X/50 ký tự`) và hỗ trợ chỉnh sửa trực tiếp ô nội dung.

- **Tài khoản thụ hưởng cố định**: `3800001234567899`
- **Tên đơn vị thụ hưởng**: `QUY TIN DUNG NHAN DAN YEN THO`
- **Ngân hàng**: `Co-opBank` (BIN `970446`)
- **Quy tắc tính tiền & Nội dung**:
  - Tiền lãi = $\text{Dư nợ} \times \frac{\text{Lãi suất}}{100} \times \frac{\text{Số ngày}}{365}$ (Làm tròn nghìn).
  - Tổng số tiền = Tiền lãi + Tiền gốc trả kỳ này.
  - Nội dung chuẩn hóa: `TRA LAI (VA GOC) HDTD SO [SO_HD] KH [TEN_KH] [DIA_CHI]`.

### 3.2. 💰 QR Tiết Kiệm (`qr-sav`)
- **Tài khoản thụ hưởng cố định**: `3800001234567899`
- **Tên đơn vị thụ hưởng**: `QUY TIN DUNG NHAN DAN YEN THO`
- **Ngân hàng**: `Co-opBank` (BIN `970446`)
- **Nội dung chuẩn hóa**: `[TEN_MEMBER] CCCD [SO_CCCD] [DIA_CHI] GUI TK KY HAN [KY_HAN] THANG SO TIEN [SO_TIEN] [HINH_THUC_LAI]`.

### 3.3. 🎴 Thẻ Standee QR & 🔊 Thẻ QR LOA Thanh Toán (`qr-standee`)
- **Ngân hàng thụ hưởng**: `Co-opBank` (BIN `970446`)
- **Trường nhập Số tài khoản**:
  - Mặc định tiền tố: `380020` (6 chữ số).
  - Cán bộ nhập tiếp 10 số đuôi (hoặc xóa đi để nhập số tài khoản 16 số mới).
  - **Cảnh báo định dạng trực quan**:
    - Nếu $\neq 16$ số: Hiển thị dòng thông báo đỏ `❌ Sai định dạng số tài khoản, kiểm tra lại` và ô nhập viền đỏ.
    - Nếu $= 16$ số: Hiển thị dòng thông báo xanh `✅ Đúng định dạng số tài khoản (16 số)` và ô nhập viền xanh.
- **Tính năng chọn Checkbox: `Tài khoản Alias`**:
  - Thêm ô checkbox: `☑️ Tài khoản Alias`.
  - Khi **tích chọn**: Mã QR được mã hóa theo **Số Alias** (Số điện thoại / biệt danh) của khách hàng tại Co-opBank. Tuy nhiên, trên mặt bảng phôi Standee / QR LOA vẫn in hiển thị đầy đủ **Số TK Nguồn**.
  - Khi **bỏ tích**: Mã QR mã hóa theo **Số tài khoản 16 số**.
- **Tùy chọn Số tiền & Nội dung chuyển khoản trên Standee**:
  - Hỗ trợ thêm 2 ô nhập tùy chọn **Số tiền** và **Nội dung chuyển khoản** (mặc định để trống để người quét tự nhập khi thanh toán).

---

## 🖨️ 4. CƠ CHẾ XUẤT BẢN IN KHỔ A4 CHUẨN & NÉN ẢNH TẢI VỀ

### 4.1. Cơ Chế In Ấn Khổ A4 Chuẩn (1, 2, 4 Thẻ / Trang A4)
- **Tùy chọn dàn trang linh hoạt**:
  - **1 Ảnh / Tờ A4**: Cỡ lớn tối đa chuẩn đặt bàn tại quầy giao dịch (`max-width: 190mm`, `max-height: 275mm`).
  - **2 Ảnh / Tờ A4**: Cỡ vừa tiết kiệm giấy, xếp dọc (Portrait) hoặc xếp ngang (Landscape) (`height: 136mm` mỗi thẻ).
  - **4 Ảnh / Tờ A4 (Chuẩn Standee & QR Loa)**:
    + **Lề trang (Page Margin)**: Chuẩn **7mm** cả 4 cạnh (`@page { size: A4; margin: 7mm; }`). Vùng in khả dụng đạt kích thước tối ưu **196mm x 283mm**.
    + **Kích thước chiều ngang ảnh**: Cố định chính xác **90mm** (`width: 90mm; max-width: 90mm;`).
    + **Bảo toàn tỷ lệ ảnh (Aspect Ratio)**: Thẻ Standee (1087x1643) tự động có chiều cao tương ứng ~136mm. Hai hàng ảnh (2 x 136mm = 272mm) hoàn toàn nằm gọn trong chiều cao 283mm mà không tràn trang.
    + **Bố cục 4 góc (2x2)**: Phân bố thành 4 góc phần tư đối xứng (mỗi phần tư 98mm x 141.5mm), tạo thành 4 thẻ A6 hoàn chỉnh sau khi cắt dọc đường chữ thập trung tâm.
- **Giữ nguyên 100% tỷ lệ ảnh (Aspect Ratio)**:
  - Khắc phục triệt để hiện tượng co giãn, méo hình khi in nhờ thuộc tính `object-fit: contain` và dynamic CSS sizing.
  - Phôi Standee (1087x1643) và Phôi QR Loa (1088x1092) hiển thị cân đối hoàn hảo trong từng ô khung in.
- **Tuỳ chọn in ấn thông minh**:
  - Tùy chọn bật/tắt **Đường nét đứt hướng dẫn cắt kéo (✂)** (gồm viền ảnh và đường cắt chữ thập phân đôi trang) giúp cắt thẻ chuẩn xác sau khi in.
  - Tùy chọn **Thông tin chân trang**: Nhãn Quỹ Tín Dụng Nhân Dân Yên Thọ và thời gian in tự động.
  - Hướng giấy **Khổ dọc (Portrait)** hoặc **Khổ ngang (Landscape)**.
  - Cửa sổ mô phỏng trang in A4 trực quan thời gian thực (Live Miniature A4 Preview).
- **Kỹ thuật in cách ly (Isolated Hidden Iframe)**:
  - Sử dụng `#doc-print-iframe` để xuất bản in trực tiếp mà không bị trình duyệt chặn Popup (Popup Blocker).
  - Hoạt động 100% Offline, hỗ trợ in ra máy in vật lý hoặc chọn **"Lưu dưới dạng PDF" (Save as PDF)**.

### 4.2. Tùy Chọn Nén Ảnh Tải Về & Chia Sẻ Zalo
- **4 mức nén tối ưu hóa**:
  1. **PNG Gốc HD (Không nén)**: Giữ nguyên chất lượng đồ họa tối đa (`~1.6 - 2.1 MB`), thích hợp in ấn quảng cáo khổ lớn.
  2. **JPEG Chất lượng cao (90%)**: Hình ảnh sắc nét cao, dung lượng giảm mạnh (`~320 - 450 KB`).
  3. **JPEG Tiết kiệm - Gửi Zalo (75%)** *(Mặc định khuyên dùng)*: Tối ưu dung lượng siêu nhẹ (`~180 - 250 KB`), gửi qua Zalo / Messenger tức thì mà mã QR vẫn quét cực nhạy.
  4. **JPEG Nén cao (60%)**: Dung lượng tối thiểu (`~95 - 140 KB`), tiết kiệm tối đa bộ nhớ điện thoại.
- **Ước tính dung lượng thời gian thực**: Huy hiệu hiển thị dung lượng file dự kiến ngay cạnh nút tải về.

---

## 🎨 5. ĐỘNG CƠ VẼ CANVAS & XUẤT ẢNH HD (OFFLINE ENGINE)

- **Thư viện vector `QRCodeLib`**: Tự động thử cấp độ sửa lỗi **Level H (30%)** giúp mã QR có khả năng khôi phục dữ liệu cao nhất, quét nhạy 100% kể cả khi có logo chèn giữa.
- **Canvas 2D Rendering 0ms Offline**:
  - Loại bỏ hoàn toàn sự phụ thuộc vào các API mạng bên ngoài (`img.vietqr.io`, `qr.sepay.vn`), tạo mã QR hoàn toàn nội bộ trong bộ nhớ RAM trình duyệt.
  - Thẻ Standee: Render kích thước HD 1087x1643px trên phôi phông nền `ASSET_BG_STANDEE`.
  - Thẻ QR LOA: Render kích thước HD 1088x1092px trên phôi phông nền `ASSET_BG_QRLOA`.
  - Thẻ Tiền vay / Tiết kiệm: Render khung HD 700x860px tối màu sang trọng.
- **Tải ảnh & Chia sẻ (Web Share API)**:
  - Xuất ảnh Blob theo định dạng và độ nén đã chọn (`image/png` hoặc `image/jpeg`).
  - Tích hợp `navigator.share({ files: [file] })` cho phép chia sẻ thẳng qua Zalo, Messenger, Telegram trên điện thoại di động.

---
© 2026 **QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ** — Tất cả quyền được bảo lưu.
