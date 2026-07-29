# 🏢 QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ — PHÂN HỆ TẠO MÃ VIETQR EMVCo 247
> **Tài Liệu Chi Tiết Kỹ Thuật & Cấu Trúc Mã VietQR (QTD_Tools)**  
> **Phiên bản:** `v2026.07.29-v21.1`  
> **Phát triển cho:** Cán bộ nghiệp vụ Quỹ Tín Dụng Nhân Dân Yên Thọ

---

## 📌 1. GIỚI THIỆU TỔNG QUAN

Phân hệ VietQR trong bộ ứng dụng `QTD_Tools` cung cấp giải pháp tạo mã QR thanh toán chuẩn **EMVCo 247 / VietQR / NAPAS** cho **Ngân hàng Hợp tác xã Việt Nam (Co-opBank)**. 

Hệ thống cho phép sinh mã QR vector 100% offline ngay trên trình duyệt mà không cần kết nối mạng hay gọi API bên ngoài, đảm bảo tính bảo mật, tốc độ tức thì và tương thích 100% với tất cả ứng dụng ngân hàng (Co-opBank Mobile, Vietcombank, BIDV, Agribank, VietinBank, MB, Techcombank,...).

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

## 🎨 4. ĐỘNG CƠ VẼ CANVAS & XUẤT ẢNH HD (OFFLINE ENGINE)

- **Thư viện vector `QRCodeLib`**: Tự động thử cấp độ sửa lỗi **Level H (30%)** giúp mã QR có khả năng khôi phục dữ liệu cao nhất, quét nhạy 100% kể cả khi có logo chèn giữa.
- **Canvas 2D Rendering**:
  - Thẻ Standee: Render kích thước HD 1087x1643px trên phôi phông nền `ASSET_BG_STANDEE`.
  - Thẻ QR LOA: Render kích thước HD 1088x1092px trên phôi phông nền `ASSET_BG_QRLOA`.
  - Thẻ Tiền vay / Tiết kiệm: Render khung HD 700x860px tối màu sang trọng.
- **Tải ảnh & Chia sẻ (Web Share API)**:
  - Xuất ảnh PNG blob chất lượng cao.
  - Tích hợp `navigator.share({ files: [file] })` cho phép chia sẻ thẳng qua Zalo, Messenger, Telegram trên điện thoại.

---
© 2026 **QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ** — Tất cả quyền được bảo lưu.
