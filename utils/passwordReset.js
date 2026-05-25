const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Done it Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Instructions`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 32px 24px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #1f2937; background-color: #f9fafb; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; background-color: #e3e9f9; padding: 24px; border-radius: 8px 8px 0 0; margin: -32px -24px 32px;">
          <img src="cid:doneitlogo" alt="done it logo" style="height: 64px; object-fit: contain;" />
        </div>

        <h2 style="font-size: 22px; margin-bottom: 12px;">Hi ${name},</h2>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          You requested to reset your password on <strong>done it</strong>.
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          Click the button below to proceed. This link will expire in <strong>10 minutes</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #003e99; padding: 14px 26px; color: #ffffff; font-weight: 500; font-size: 15px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="margin-top: 40px; font-size: 15px; color: #1f2937;">
          <strong>— The done it Team</strong>
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: "https://i.postimg.cc/RFCT6bgW/cropped-circle-image.png",
        cid: "doneitlogo",
      },
    ],
  });
};

module.exports = sendPasswordResetEmail;
