import nodemailer from "nodemailer";

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn("SMTP config missing in .env — emails will fail until configured");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendApprovalEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Human Approvals" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent:", info.messageId, "to", to);
    return { ok: true, info };
  } catch (err) {
    console.error("Email failed to", to, ":", err.message || err);
    return { ok: false, error: err };
  }
};
