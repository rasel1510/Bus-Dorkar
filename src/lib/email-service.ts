import nodemailer from "nodemailer";

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  otpCode: string;
  recipientName?: string;
}

export async function sendVerificationEmail({
  to,
  subject,
  otpCode,
  recipientName = "Passenger",
}: EmailDispatchOptions): Promise<{ success: boolean; sentViaSmtp: boolean; messageId?: string }> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
          .logo { color: #0d9488; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-decoration: none; display: inline-block; margin-bottom: 20px; }
          .title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
          .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
          .code-box { background: #f0fdf4; border: 2px dashed #0d9488; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px; }
          .code { font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #0f766e; margin: 0; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div className="container">
          <div className="logo">🚌 Bus Dorkar</div>
          <div className="title">Verify Your Email Address</div>
          <div className="text">Hello ${recipientName},<br/>Use the 6-digit verification code below to complete your Bus Dorkar account registration. This code expires in 10 minutes.</div>
          <div className="code-box">
            <div className="code">${otpCode}</div>
          </div>
          <div className="text">If you did not request this code, please ignore this email.</div>
          <div className="footer">© ${new Date().getFullYear()} Bus Dorkar Bangladesh — Inter-District Bus Transportation Platform</div>
        </div>
      </body>
    </html>
  `;

  console.log(`\n======================================================`);
  console.log(`📧 [VERIFICATION OTP DISPATCH]`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`6-DIGIT CODE: ${otpCode}`);
  console.log(`======================================================\n`);

  // 1. Try Gmail SMTP if GMAIL_USER & GMAIL_APP_PASSWORD are provided
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || process.env.SMTP_PASS;

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Bus Dorkar" <${gmailUser}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`✅ [GMAIL SMTP DISPATCH SUCCESS] Sent email to ${to}, MessageID: ${info.messageId}`);
      return { success: true, sentViaSmtp: true, messageId: info.messageId };
    } catch (err: any) {
      console.warn(`⚠️ [GMAIL SMTP ERROR] ${err.message}`);
    }
  }

  // 2. Try Generic SMTP (Host / Port)
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"Bus Dorkar Verification" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
      });

      return { success: true, sentViaSmtp: true, messageId: info.messageId };
    } catch (err: any) {
      console.warn(`⚠️ [SMTP DISPATCH ERROR] ${err.message}`);
    }
  }

  return { success: true, sentViaSmtp: false };
}
