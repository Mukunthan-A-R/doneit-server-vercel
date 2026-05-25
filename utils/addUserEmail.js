const nodemailer = require("nodemailer");

const addUserEmail = async (email, userName, projectName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Generate current date in readable format
  const addedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await transporter.sendMail({
    from: `"Done it Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You’ve been added to the project: ${projectName}`,
    html: `
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 24px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #1f2937; background-color: #f9fafb; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

    <div style="text-align: center; background-color: #e3e9f9; padding: 24px; border-radius: 8px 8px 0 0; margin: -32px -24px 32px;">
      <img src="cid:doneitlogo" alt="Done it Logo" style="height: 64px; object-fit: contain;" />
    </div>

    <h2 style="font-size: 22px; margin-bottom: 12px;">Hi ${userName},</h2>

    <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
      You have been added to the project <strong>${projectName}</strong> on <strong>${addedDate}</strong>.
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
      You can now access the project and collaborate with your team.
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 40px;">
      If you have any questions or need assistance, feel free to reach out to your team.
    </p>

    <p style="margin-top: 40px; font-size: 15px; color: #1f2937;"><strong>— The Done it Team</strong></p>
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

module.exports = addUserEmail;
