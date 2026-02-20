import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Vườn Lá Nhỏ" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 Vườn Lá Nhỏ</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${userName || 'bạn'}!</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Vườn Lá Nhỏ.</p>
          <p>Vui lòng nhấn vào nút bên dưới để xác thực email của bạn:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Xác Thực Email</a>
          </div>
          <p>Hoặc copy link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
          <p style="color: #999; font-size: 14px;">Link này sẽ hết hiệu lực sau 24 giờ.</p>
        </div>
        <div class="footer">
          <p>© 2026 Vườn Lá Nhỏ. All rights reserved.</p>
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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Đặt Lại Mật Khẩu</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${userName || 'bạn'}!</h2>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Đặt Lại Mật Khẩu</a>
          </div>
          <p>Hoặc copy link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #f5576c;">${resetLink}</p>
          <div class="warning">
            <strong>⚠️ Lưu ý:</strong> Link này chỉ có hiệu lực trong 1 giờ.
          </div>
          <p style="color: #999; font-size: 14px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          <p>© 2026 Vườn Lá Nhỏ. All rights reserved.</p>
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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Mật Khẩu Đã Được Thay Đổi</h1>
        </div>
        <div class="content">
          <h2>Xin chào ${userName || 'bạn'}!</h2>
          <div class="success">
            <strong>✓ Thành công!</strong> Mật khẩu của bạn đã được thay đổi.
          </div>
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
          <p>Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.</p>
        </div>
        <div class="footer">
          <p>© 2026 Vườn Lá Nhỏ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};
