import nodemailer from "nodemailer";

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email
export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Vườn Lá Nhỏ" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  verifyEmail: (verificationLink, userName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        body { font-family: 'Be Vietnam Pro', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(108, 142, 104, 0.08); border: 1px solid #dde8db; }
        .header { background-color: #6C8E68; padding: 28px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 32px; }
        .content h2 { color: #2d3b2c; font-size: 20px; margin-top: 0; font-weight: 600; }
        .button { display: inline-block; padding: 14px 28px; background-color: #6C8E68; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 24px 0; text-align: center; transition: background-color 0.2s; }
        .link-text { word-break: break-all; color: #5a7856; font-size: 14px; }
        .footer { background-color: #f0f4ef; padding: 24px; text-align: center; color: #5a7856; font-size: 13px; border-top: 1px solid #dde8db; }
        .text-muted { color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vườn Lá Nhỏ</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${userName || "bạn"},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Vườn Lá Nhỏ. Để hoàn tất việc đăng ký và bảo mật tài khoản, vui lòng xác thực địa chỉ email của bạn bằng cách nhấn vào nút dưới đây:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Xác Thực Email</a>
          </div>
          <p>Nếu nút bấm không hoạt động, bạn có thể sao chép và dán đường dẫn sau vào trình duyệt:</p>
          <p class="link-text">${verificationLink}</p>
          <p class="text-muted">Lưu ý: Đường dẫn này chỉ có hiệu lực trong vòng 24 giờ.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Vườn Lá Nhỏ. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  resetPassword: (resetLink, userName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        body { font-family: 'Be Vietnam Pro', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(108, 142, 104, 0.08); border: 1px solid #dde8db; }
        .header { background-color: #6C8E68; padding: 28px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 32px; }
        .content h2 { color: #2d3b2c; font-size: 20px; margin-top: 0; font-weight: 600; }
        .button { display: inline-block; padding: 14px 28px; background-color: #6C8E68; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 24px 0; text-align: center; }
        .link-text { word-break: break-all; color: #5a7856; font-size: 14px; }
        .footer { background-color: #f0f4ef; padding: 24px; text-align: center; color: #5a7856; font-size: 13px; border-top: 1px solid #dde8db; }
        .warning-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 18px; margin: 24px 0; border-radius: 0 6px 6px 0; }
        .warning-text { color: #b45309; margin: 0; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vườn Lá Nhỏ</h1>
        </div>
        <div class="content">
          <h2>Yêu cầu đặt lại mật khẩu</h2>
          <p>Xin chào ${userName || "bạn"},</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Vườn Lá Nhỏ. Vui lòng nhấn vào nút dưới đây để thiết lập mật khẩu mới:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Đặt Lại Mật Khẩu</a>
          </div>
          <div class="warning-box">
            <p class="warning-text"><strong>Lưu ý quan trọng:</strong> Đường dẫn này chỉ có hiệu lực trong vòng 1 giờ vì lý do bảo mật.</p>
          </div>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
          <p>Hoặc sao chép đường dẫn sau vào trình duyệt:</p>
          <p class="link-text">${resetLink}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Vườn Lá Nhỏ. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordChanged: (userName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        body { font-family: 'Be Vietnam Pro', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(108, 142, 104, 0.08); border: 1px solid #dde8db; }
        .header { background-color: #6C8E68; padding: 28px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 32px; }
        .content h2 { color: #2d3b2c; font-size: 20px; margin-top: 0; font-weight: 600; }
        .footer { background-color: #f0f4ef; padding: 24px; text-align: center; color: #5a7856; font-size: 13px; border-top: 1px solid #dde8db; }
        .success-box { background-color: #f0f4ef; border-left: 4px solid #6C8E68; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0; }
        .success-text { color: #374a36; margin: 0; font-size: 15px; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vườn Lá Nhỏ</h1>
        </div>
        <div class="content">
          <h2>Thông báo thay đổi mật khẩu</h2>
          <p>Xin chào ${userName || "bạn"},</p>
          <div class="success-box">
            <p class="success-text">Thành công: Mật khẩu tài khoản của bạn đã được cập nhật thành công.</p>
          </div>
          <p>Bạn có thể sử dụng mật khẩu mới để đăng nhập vào hệ thống ngay bây giờ.</p>
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi ngay lập tức để bảo vệ tài khoản.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Vườn Lá Nhỏ. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
