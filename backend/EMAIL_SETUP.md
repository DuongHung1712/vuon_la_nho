# Email Configuration Guide

## Cấu hình Email cho Verify Email & Forgot Password

Module email đã được tích hợp sẵn để hỗ trợ:
- ✉️ Xác thực email khi đăng ký
- 🔒 Đặt lại mật khẩu qua email
- 📧 Thông báo thay đổi mật khẩu

---

## 🔧 Cấu hình Backend

### 1. Thêm biến môi trường vào `.env`

Thêm các biến sau vào file `.env` trong thư mục `backend`:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# URLs (đã có sẵn)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

### 2. Cấu hình Gmail App Password

Nếu bạn sử dụng Gmail:

1. Truy cập: https://myaccount.google.com/security
2. Bật **2-Step Verification** (xác thực 2 bước)
3. Vào **App passwords** (Mật khẩu ứng dụng)
4. Chọn **Mail** và **Other (Custom name)**
5. Copy mật khẩu 16 ký tự và paste vào `EMAIL_PASSWORD`

⚠️ **Lưu ý:** Không sử dụng mật khẩu Gmail thông thường, phải dùng App Password!

### 3. Sử dụng Email Service khác

Nếu không dùng Gmail, bạn có thể sử dụng:

#### Outlook/Hotmail:
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Custom SMTP:
Sửa file `backend/config/email.js`:
```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};
```

---

## 🚀 API Endpoints

### Backend Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/user/send-verification` | ✅ Yes | Gửi email xác thực |
| POST | `/api/user/verify-email` | ❌ No | Xác thực email với token |
| POST | `/api/user/forgot-password` | ❌ No | Gửi email đặt lại mật khẩu |
| POST | `/api/user/reset-password` | ❌ No | Đặt lại mật khẩu với token |

### Request Examples

#### 1. Gửi email xác thực
```javascript
POST /api/user/send-verification
Headers: { token: "jwt-token" }
```

#### 2. Xác thực email
```javascript
POST /api/user/verify-email
Body: { token: "verification-token" }
```

#### 3. Quên mật khẩu
```javascript
POST /api/user/forgot-password
Body: { email: "user@example.com" }
```

#### 4. Đặt lại mật khẩu
```javascript
POST /api/user/reset-password
Body: { 
  token: "reset-token",
  password: "new-password" 
}
```

---

## 🎨 Frontend Pages

### Đã tạo sẵn các pages:

1. **ForgotPassword** (`/forgot-password`)
   - Form nhập email để nhận link reset
   - Hiển thị thông báo khi email đã gửi

2. **ResetPassword** (`/reset-password?token=xxx`)
   - Form nhập mật khẩu mới
   - Xác nhận mật khẩu
   - Auto redirect về login sau khi thành công

3. **VerifyEmail** (`/verify-email?token=xxx`)
   - Tự động verify khi mở link
   - Hiển thị trạng thái: verifying, success, error

### Frontend Hooks Available

```javascript
import { 
  useSendVerificationEmail,
  useVerifyEmail,
  useForgotPassword,
  useResetPassword 
} from '../hooks/useApi';
```

---

## 📝 User Model Updates

Các trường mới đã được thêm vào User model:

```javascript
{
  isVerified: Boolean,              // Email đã verify chưa
  verificationToken: String,        // Token verify email
  verificationTokenExpiry: Date,    // Hết hạn sau 24h
  resetPasswordToken: String,       // Token reset password
  resetPasswordExpiry: Date         // Hết hạn sau 1h
}
```

---

## 🎯 Flow Diagram

### Verify Email Flow:
```
User Register → Send Verification Email → User clicks link 
→ Verify token → Update isVerified = true
```

### Forgot Password Flow:
```
User clicks "Forgot Password" → Enter email → Receive reset link
→ Click link → Enter new password → Password updated → Confirmation email sent
```

---

## 🧪 Testing

### Test Email Locally

1. Khởi động backend:
```bash
cd backend
npm run server
```

2. Test gửi email verify (cần token):
```bash
curl -X POST http://localhost:4000/api/user/send-verification \
  -H "Content-Type: application/json" \
  -H "token: your-jwt-token"
```

3. Test forgot password:
```bash
curl -X POST http://localhost:4000/api/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## ⚠️ Troubleshooting

### Email không gửi được?

1. **Kiểm tra .env**: Đảm bảo `EMAIL_USER` và `EMAIL_PASSWORD` đúng
2. **App Password**: Phải dùng App Password, không dùng mật khẩu thường
3. **2FA Gmail**: Phải bật 2-Step Verification trước
4. **Check console**: Xem log lỗi từ nodemailer
5. **Firewall**: Đảm bảo port 587/465 không bị block

### Token hết hạn?

- Verification token: 24 giờ
- Reset password token: 1 giờ
- Yêu cầu gửi lại email nếu hết hạn

---

## 📦 Dependencies

Đã cài đặt:
- `nodemailer` - Gửi email
- Built-in `crypto` - Generate tokens

---

## 🎨 Email Templates

Đã có sẵn 3 templates HTML đẹp:
1. **verifyEmail** - Email xác thực (màu tím)
2. **resetPassword** - Email đặt lại mật khẩu (màu đỏ hồng)
3. **passwordChanged** - Email xác nhận đổi mật khẩu (màu xanh)

Tất cả templates đều responsive và có branding Vườn Lá Nhỏ 🌿

---

## ✅ Checklist

- [x] Cài đặt nodemailer
- [x] Tạo email config & templates
- [x] Thêm fields vào User model
- [x] Tạo controllers (verify, forgot, reset)
- [x] Thêm routes
- [x] Tạo frontend pages
- [x] Thêm API hooks
- [x] Update routing
- [ ] Cấu hình .env
- [ ] Test gửi email

---

## 🚀 Next Steps

1. Cấu hình `.env` với email credentials
2. Test gửi email
3. (Optional) Thêm verification reminder trong Profile page
4. (Optional) Thêm email notification cho các actions khác

---

Made with 💚 by Vườn Lá Nhỏ Team
