# Admin Panel - English Learning Website with AI Videos

## Mô tả project
Trang Admin là trung tâm quản lý **video học tiếng Anh bằng video AI** trên website.  
- Admin có thể **tạo, upload, duyệt và quản lý video** cho người học.  
- Video được lưu **trực tiếp trong folder `resources/static/videos`** để frontend có thể truy cập trực tiếp.  
- Admin cũng có thể **quản lý chủ đề học từ vựng**.  
- Frontend sử dụng **HTML/CSS + JavaScript thuần**, backend sử dụng **Spring Boot + MySQL**.  
- Đây là MVP quan trọng để demo Hackathon: nhanh chóng upload video, duyệt và quản lý nội dung.

---

## Chức năng chính

### 1. Upload video
- Upload file video vào folder `resources/static/videos`  
- Nhập metadata: **từ vựng** và **chủ đề**  
- Video mặc định trạng thái `DRAFT`  

### 2. Danh sách video
- Hiển thị tất cả video với thông tin: từ vựng | chủ đề | trạng thái  
- Xem preview video trực tiếp trên trang  
- Duyệt video từ trạng thái `DRAFT` sang `APPROVED`  

### 3. Quản lý chủ đề
- Thêm chủ đề mới  
- Sửa hoặc xóa chủ đề  
- Chọn chủ đề khi upload video  

---

## Kiến trúc project

### Backend
- **Spring Boot**  
- **MySQL** cho lưu trữ dữ liệu  
- **JPA/Hibernate** cho ORM  

**Bảng chính:**
1. `videos`
   - `id` (PK)
   - `word` (từ vựng)
   - `topic` (chủ đề)
   - `videoPath` (tên file video lưu trong `resources/static/videos`)  
   - `status` (DRAFT / APPROVED / PUBLISHED)
   - `createdAt` (ngày tạo)  
2. `topics`
   - `id` (PK)
   - `name` (tên chủ đề)  

**Controller chính:**
- `POST /admin/videos/upload` → upload video và lưu metadata  
- `GET /admin/videos/all` → danh sách video  
- `PUT /admin/videos/{id}/approve` → duyệt video  
- `GET/POST/PUT/DELETE /admin/topics` → quản lý chủ đề  

### Frontend
- **HTML + CSS + JavaScript**  
- Form upload video  
- Danh sách video với nút Approve và preview video  
- Form quản lý chủ đề  

---

## Hướng dẫn cài đặt và chạy

### Bước 1: Cài đặt MySQL
```sql
CREATE DATABASE english_learning;
