const nodemailer = require("nodemailer");

const confirmEmail = async (email, name, activationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Done It Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Done It Account Activation for user ${name}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 32px 24px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #333; background-color: #f9fafb; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="cid:doneitlogo" alt="done it logo" style="height: 64px; object-fit: contain;" />
        </div>

        <h2 style="color: #1f2937; font-size: 22px;">Hi ${name},</h2>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          Welcome to a space where work moves with intention.
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          Your journey with <strong style="color: #111827;">done it</strong> — Done It’s minimalist work management platform — begins here. 
          Before we unlock the full experience, please take a moment to verify your account.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" style="background-color: #0052cc; padding: 14px 26px; color: #fff; font-weight: 500; font-size: 15px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Activate My Account
          </a>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          This small step opens the door to a more connected, thoughtful, and efficient way to manage what matters most.
        </p>

        <p style="font-size: 15px; color: #4b5563;">If you didn’t request this, you can safely ignore this email.</p>

        <p style="margin-top: 40px; font-size: 15px; color: #1f2937;">
          <strong>Warm regards,</strong><br/><strong>The Done It Team</strong>
        </p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;" />

        <small style="display: block; text-align: center; margin-top: 16px; color: #9ca3af;">
          This email was sent by Done It. If you received it in error, no further action is required.
        </small>
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

module.exports = confirmEmail;
