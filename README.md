# 🏢 QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ - DỰ ÁN QTD_TOOLS (v2026.07.29-v21.1)

> **Bộ Công Cụ Nghiệp Vụ Tín Dụng & Tiền Gửi Ngoại Tuyến (Offline PWA WebApp)**  
> **Repository chính thức:** [https://github.com/qtdyentho/qtdyentho_tools.git](https://github.com/qtdyentho/qtdyentho_tools.git)  
> **Trang WebApp (GitHub Pages):** [https://qtdyentho.github.io/qtdyentho_tools/](https://qtdyentho.github.io/qtdyentho_tools/)  

---

## 📖 GIỚI THIỆU TỔNG QUAN

`QTD_Tools` là bộ ứng dụng Web Đơn (Single-file PWA) được phát triển riêng cho cán bộ nghiệp vụ **Quỹ Tín Dụng Nhân Dân Yên Thọ**. Ứng dụng hoạt động **Offline 100%** không cần kết nối Internet sau khi cài đặt, giúp tối ưu hóa tốc độ và tính chính xác trong công tác tư vấn tài chính, quy đổi lãi suất, lập lịch trả nợ và tạo mã VietQR chuyển khoản.

---

## 🌟 CÁC PHÂN HỆ VÀ TÍNH NĂNG CHÍNH

### 1. 📊 Bảng Quy Đổi Lãi Suất Tiết Kiệm Tự Động
* Hỗ trợ 16 kỳ hạn tiền gửi (1 đến 36 tháng).
* Tự động quy đổi %/năm và số tiền lãi sang các phương thức: *Lãi cuối kỳ*, *Lĩnh lãi hàng tháng*, *Lĩnh lãi trước*, *Lĩnh lãi hàng quý*, *Gửi góp định kỳ*.
* Cho phép nhập lãi suất thực tế tại quầy để tự động cập nhật toàn bộ dòng tiền.

### 2. ⚖️ Rút Tiết Kiệm Trước Hạn 1 Phần (Thông Tư 04/2022/TT-NHNN)
* Mô phỏng chính xác phần tiền rút trước hạn (hưởng Lãi suất Không kỳ hạn) và phần tiền gửi còn lại (tiếp tục hưởng lãi suất cam kết ban đầu).
* Hiển thị số tiền lãi bảo vệ được cho thành viên so với việc rút 100%.

### 3. 🧮 Bộ Công Cụ Nghiệp Vụ Tín Dụng & Tiền Gửi
* **Công cụ Tiết kiệm:** Gửi 1 lần, Gửi góp định kỳ (tháng/quý), Tiết kiệm mục tiêu (tính số tiền gửi hàng tháng để đạt mục tiêu).
* **Công cụ Tiền vay:** Ước tính hạn mức vay tối đa dựa trên thu nhập ròng & DTI, lập lịch trả nợ 4 phương thức (*Lãi hàng tháng gốc cuối kỳ*, *Dư nợ giảm dần*, *Trả đều Annuity*).

### 4. 📱 Tạo Mã VietQR Thanh Toán Chuẩn SePay
* **QR Trả Lãi & Gốc vay:** Tự động tính lãi phát sinh theo số ngày thực tế, làm tròn nghìn, loại bỏ dấu tiếng Việt chuẩn hóa nội dung `[HO TEN] TRA LAI VA GOC HDTD SO [SO HD]`.
* **QR Gửi Tiết Kiệm:** Sinh mã VietQR nạp tiền vào tài khoản Co-opBank cố định (`3800001234567899`).
* Hỗ trợ nút **Tải Mã QR** và **Chia Sẻ Mã** tức thì.

### 5. 🖨️ In Báo Cáo & Xuất Excel
* Chế độ in báo cáo chính thức có chữ ký 3 bên (*Người lập*, *Kiểm soát viên*, *Ban Giám đốc*).
* Xuất bảng dữ liệu lãi suất ra file Excel (`.xls`).

### 6. 📱 Cài Đặt PWA Màn Hình Chính & Cập Nhật Online
* Hỗ trợ Modal hướng dẫn cài đặt lối tắt màn hình chính cho iPhone/iPad (Safari) và Android/PC (Chrome, Edge).
* Tích hợp nút **"Cập Nhật"** (`checkAppUpdate()`) kết nối trực tiếp đến GitHub Raw để nâng cấp phiên bản mới khi có Internet.

---

## 🛠️ HƯỚNG DẪN SỬ DỤNG & CÀI ĐẶT

### Mở trực tiếp bằng trình duyệt:
Mở file `index.html` hoặc `PWA_QTDYENTHO.html` bằng bất kỳ trình duyệt nào trên điện thoại/máy tính.

### Cài đặt thành App màn hình chính (PWA):
1. Trên iPhone (Safari): Bấm biểu tượng **Chia sẻ** -> Chọn **"Thêm vào Màn hình chính"**.
2. Trên Android / PC (Chrome, Edge): Bấm nút **"Cài Đặt App"** trên giao diện ứng dụng.

---

## ⚙️ CẤU TRÚC THƯ MỤC

```text
QTD_Tools/
├── index.html            # File chính (GitHub Pages & PWA Offline App)
├── PWA_QTDYENTHO.html    # Bản nâng cấp v2026.07.28-v1.3 chính thức
├── PWA_QTDYENTHO2.html   # Bản dự phòng 6 tab
└── README.md             # Tài liệu giới thiệu & Hướng dẫn sử dụng
```

---

© 2026 **QUỸ TÍN DỤNG NHÂN DÂN YÊN THỌ** — Đồng hành cùng sự phát triển bền vững của cộng đồng.
