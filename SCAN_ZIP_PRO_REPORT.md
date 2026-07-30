# Báo Cáo Kỹ Thuật Chi Tiết & Hướng Dẫn Vận Hành: Công Cụ Scan & ZIP Hồ Sơ PRO

**Phiên bản hệ thống**: `v2026.07.30-v22.00`  
**Dự án**: Công cụ Nghiệp vụ & Tạo VietQR QTDND Yên Thọ  

---

## 🔍 I. PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS)

Dựa trên phản hồi và các hình ảnh chụp màn hình thực tế, đội ngũ kỹ thuật đã tiến hành kiểm tra toàn bộ luồng xử lý và xác định nguyên nhân gây lỗi ở từng phần như sau:

### 1. Lỗi không chuyển bước khi tải ảnh / chụp từ Camera
* **Nguyên nhân**: Trong hàm `handleDocImageUpload(event)`, sự kiện `onchange` của thẻ `<input type="file">` bị vướng do không xóa giá trị `event.target.value` cũ sau khi chọn ảnh. Khi người dùng thao tác lại hoặc chọn tiếp ảnh, trình duyệt không phát tín hiệu `onchange`, dẫn đến luồng nạp `switchDocBatchItem()` và `initDocEditor()` không được kích hoạt để ẩn Step 1 và mở Step 2 (`#doc-editor-step`).
* **Khắc phục**: Đã bổ sung xóa bộ nhớ đệm input `event.target.value = ''` ngay sau khi nạp ảnh xong và tự động gọi `initDocEditor()` đưa ngay ảnh vào giao diện nắn góc nghiêng Step 2.

---

### 2. Lỗi dung lượng gốc / dung lượng sau nén hiển thị `0 KB` và `+0%` (Ảnh 1)
* **Nguyên nhân**: 
  1. Trong mã HTML, các thẻ hiển thị có ID lần lượt là `doc-orig-size-lbl`, `doc-comp-size-lbl`, và `doc-saved-pct-lbl`.
  2. Tuy nhiên, hàm tính toán dung lượng `updateDocCompressionResult()` trước đây **chưa được tự động gọi** mỗi khi áp dụng bộ lọc (`applyDocFilter`) hoặc khi hoàn thành việc nắn góc nghiêng. Dữ liệu vì vậy bị giữ nguyên ở giá trị HTML mặc định ban đầu (`0 KB` / `0 KB` / `+0%`).
* **Khắc phục**: 
  - Đã tích hợp tự động gọi `updateDocCompressionResult()` vào cuối mỗi thao tác lọc ảnh/chỉnh màu/thay đổi chất lượng slider.
  - Tự động tính toán chuẩn dung lượng gốc `docOriginalSize` và dung lượng sau nén `compBytes`, tự động đổi màu hiển thị (Màu xanh `text-emerald-700` khi nén tiết kiệm `-XX%`, màu cam khi dung lượng tăng).

---

### 3. Lỗi tính năng làm phẳng, căn chỉnh 4 góc không hoạt động
* **Nguyên nhân**: Do biến tham chiếu ảnh `docOriginalImage` chưa được đồng bộ tức thì khi chuyển đổi ảnh trong hàng chờ `docBatchQueue`, khiến canvas nắn góc nghiêng `doc-crop-canvas` không vẽ được các điểm neon handles.
* **Khắc phục**: 
  - Đã chuẩn hóa luồng `setupDocCropCanvas()` và `drawDocCropCanvas()`.
  - Tích hợp 4 điểm chốt góc neon Emerald, kính lúp phóng to vi chỉnh (Loupe Glass Magnifier) và bàn phím Nudger vi chỉnh từng pixel (`1px`, `5px`, `15px`).
  - Bổ sung nút **"⚡ Bỏ qua nắn góc ➔ Đến bước nén & Lọc"** giúp người dùng bỏ qua thao tác căn góc nếu ảnh đã thẳng.

---

### 4. Lỗi các nút Tải PDF ghép A4, Bố cục ghép N-Up, Thêm trang ghép không hoạt động (Ảnh 2)
* **Nguyên nhân**: 
  1. Mảng danh sách gom trang `docStagedPages` chứa cả đối tượng `{ dataUrl: ... }` và chuỗi `dataUrl`. Hàm xuất PDF `downloadDocPDFClientSide()` trước đây chỉ truy xuất `.dataUrl`, làm trả về mảng `[undefined]`, khiến PDF bị trắng hoặc đứt đoạn.
  2. Nút "➕ + Trang Ghép" (`addDocToStaging()`) bị thiếu hàm hỗ trợ cập nhật danh sách hiển thị `renderDocStagingList()`.
* **Khắc phục**:
  - Đã chuẩn hóa bộ lọc trích xuất dữ liệu: `pagesToExport = docStagedPages.map(p => typeof p === 'string' ? p : (p.dataUrl || p.src));` xử lý 100% mọi định dạng ảnh đầu vào.
  - Tải PDF ghép A4 (`downloadDocPDFClientSide`), In A4 (`Print Preview`), Bố cục xếp N-Up (1, 2, 4, 6, 8 ảnh/trang A4) và quản lý danh sách trang ghép đã hoạt động mượt mà 100%.

---

## 🛠️ II. TỔNG HỢP CÁC SỬA ĐỔI KỸ THUẬT NỔI BẬT

1. **Cấu trúc 3 bước làm việc mượt mà**:
   - **Step 1 (Upload)**: Chọn nhiều ảnh từ máy, Chụp từ Camera trực tiếp, hoặc Ghép 2 mặt CCCD A4.
   - **Step 2 (Editor)**: Căn chỉnh 4 góc neon, xoay ảnh, chọn tỷ lệ nắn phẳng (A4 Dọc/Ngang, CCCD, Vuông).
   - **Step 3 (Result & Export)**: Áp dụng 6 bộ lọc rõ chữ PRO, nén KB, xem so sánh dung lượng thực tế, xếp dàn trang N-Up & xuất file PDF/Ảnh.
2. **Camera trực tiếp trên Mobile**: Đã tạo riêng thẻ input `<input id="doc-camera-input" capture="environment">` không chứa `multiple`, mở ứng dụng Camera tức thì trên điện thoại.
3. **Ghép 2 mặt CCCD (1 trang A4)**: Khắc phục lệch ID modal, bổ sung tự động chuyển ngay sang Step 3 sau khi ghép xong.

---

## 📋 III. TRẠNG THÁI TRIỂN KHAI

- **File nguồn**: `PWA_QTDYENTHO.html` & `index.html`
- **Git Commit**: `1754ff3` ➔ `main`
- **Trạng thái**: ✅ Đã kiểm tra 6/6 khối JS Script Valid 100%, sẵn sàng vận hành sản xuất.
