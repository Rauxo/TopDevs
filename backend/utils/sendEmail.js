const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const logoPath = path.join(__dirname, "../../frontend/public/logo.png");

    const mailOptions = {
      from: `"TopDevs" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo" alt="TopDevs Logo" style="max-width: 150px;" />
          </div>
          <div style="color: #333; line-height: 1.6;">
            <p>Dear Developer,</p>
            <p>${options.message}</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f4f4f4; border-radius: 4px; letter-spacing: 2px;">
                ${options.otp}
              </span>
            </div>
            <p>This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
            <br />
            <p>Best regards,</p>
            <p><strong>The TopDevs Team</strong></p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo", // same cid value as in the html img src
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

module.exports = sendEmail;
