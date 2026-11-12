# Theo dõi đảng phí, tài khoản ngân hàng, xác nhận phân bổ

Ai cũng xem được số liệu (hoặc chỉ người có mật khẩu xem). Chỉ người có **mật khẩu quản trị** mới tải được file Excel lên.
File Excel được đọc ngay trên trình duyệt của quản trị viên. Máy chủ chỉ lưu số liệu tổng hợp theo đơn vị,
không lưu file gốc, không lưu CCCD hay tên người xác nhận.

## Cách đưa lên mạng (khuyên dùng GitHub + Netlify)
1. Tạo repository **Private** trên GitHub, tải toàn bộ thư mục này lên (giữ nguyên cấu trúc `public/`, `netlify/`, `netlify.toml`, `package.json`).
2. Vào netlify.com, chọn **Add new site, Import an existing project**, chọn repo vừa tạo. Để trống ô Build command, Netlify tự đọc `netlify.toml`.
3. Sau khi tạo site: **Site configuration, Environment variables**, thêm:
   - `ADMIN_PASSWORD`: mật khẩu quản trị (bắt buộc, nên dài từ 12 ký tự).
   - `VIEW_PASSWORD`: mật khẩu xem (tùy chọn). Bỏ trống thì ai có link cũng xem được.
4. Vào **Deploys, Trigger deploy, Deploy site** để áp dụng biến môi trường.

## Sử dụng
- Mở trang, bấm **Quản trị**, nhập mật khẩu quản trị. Các ô chọn file hiện ra ở từng mục.
- Chọn file Excel gốc tải từ hệ thống (không cần đổi tên). Trang tính xong và tự lưu, mọi người mở lại là thấy số mới.
- Mục Tài khoản ngân hàng cần chọn đủ 2 file trong cùng một lần làm việc.
- Mục Xác nhận phân bổ có 4 ô theo từng cấp, chọn đúng file vào đúng ô.

## Lưu ý
- Kéo thả thư mục lên Netlify (không qua GitHub) sẽ không chạy được phần lưu dữ liệu, hãy dùng cách nối GitHub ở trên.
- Muốn đổi mật khẩu: sửa biến môi trường rồi deploy lại.

## Đổi ảnh banner (đã có sẵn hero.jpg)
Chép một ảnh vào thư mục `public/` và đặt tên `hero.jpg`. Banner đầu trang sẽ tự dùng ảnh đó, nếu không có ảnh thì dùng màu nền mặc định.

## Số người đang online và tổng lượt truy cập
Mỗi người mở trang (và đang xem tab) sẽ gửi một tín hiệu 60 giây một lần. Ai quá 150 giây không báo tín hiệu thì không còn được tính. File xử lý là `netlify/functions/online.mjs`. Muốn tắt tính năng này thì xóa file đó và xóa phần `ping` cùng ô `onb` trong `public/index.html`.
Tổng lượt truy cập tăng 1 mỗi lần có người mở trang trong một phiên trình duyệt mới (tải lại trang không tính thêm). Con số được lưu trên máy chủ.

## Tổng hợp theo đảng bộ cơ sở (mục Xác nhận phân bổ)
Để biết từng đảng bộ xã, phường có bao nhiêu đơn vị đã xác nhận, hệ thống ghép tên đơn vị trong file phân bổ với danh sách có mã đơn vị ở mục Tài khoản ngân hàng.
Làm theo thứ tự: (1) chọn 2 file tài khoản ngân hàng, (2) chọn các file phân bổ. Chi bộ trùng tên ở nhiều nơi mà trạng thái khác nhau thì số liệu là ước tính (có dấu ≈).

## Bản cập nhật: biểu đồ, cần nhắc nhở, chi tiết từng xã
- Trang Tổng quan có biểu đồ tròn, cột và thanh chồng.
- Mục **Cần nhắc nhở** tự lọc đơn vị thấp (đảng phí, thiếu tài khoản, phân bổ), chỉnh được ngưỡng và sao chép danh sách.
- Ở mỗi mục có ô chọn xã, phường để xem chi tiết, hoặc bấm vào một dòng trong bảng.
- Sau khi cập nhật code, quản trị viên chọn lại 2 file tài khoản ngân hàng một lần để có danh sách chi tiết đơn vị chưa có tài khoản.
