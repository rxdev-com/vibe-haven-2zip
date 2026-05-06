import nodemailer from "nodemailer";

function createTransporter() {
  const service = process.env.EMAIL_SERVICE || "gmail";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransporter({
    service,
    auth: { user, pass },
  });
}

export async function sendOTPEmail(to, otp, name = "User") {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV] OTP for ${to}: ${otp}`);
    return { sent: false, dev: true, code: otp };
  }

  const mailOptions = {
    from: `"JugaduBazar" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your JugaduBazar Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"/></head>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316, #10b981); padding: 28px 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">JugaduBazar</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0; font-size: 13px;">Raw Materials Marketplace</p>
          </div>
          <!-- Body -->
          <div style="padding: 32px;">
            <h2 style="color: #111827; margin: 0 0 8px; font-size: 20px;">Hello, ${name}! 👋</h2>
            <p style="color: #6b7280; margin: 0 0 24px; font-size: 15px; line-height: 1.6;">
              Welcome to JugaduBazar! Use the verification code below to complete your registration.
            </p>
            <!-- OTP Box -->
            <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #374151; margin: 0 0 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <p style="color: #059669; font-size: 40px; font-weight: 800; margin: 0; letter-spacing: 10px; font-family: monospace;">${otp}</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0;">This code expires in 10 minutes</p>
            </div>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
              If you didn't create an account with JugaduBazar, please ignore this email.
            </p>
          </div>
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              &copy; 2024 JugaduBazar. Connecting vendors with suppliers across India.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { sent: true };
  } catch (err) {
    console.error("Email send error:", err.message);
    console.log(`[FALLBACK] OTP for ${to}: ${otp}`);
    return { sent: false, error: err.message, dev: true, code: otp };
  }
}

export async function sendOrderNotificationEmail(to, subject, html) {
  const transporter = createTransporter();
  if (!transporter) return { sent: false };
  try {
    await transporter.sendMail({ from: `"JugaduBazar" <${process.env.EMAIL_USER}>`, to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error("Email send error:", err.message);
    return { sent: false };
  }
}
