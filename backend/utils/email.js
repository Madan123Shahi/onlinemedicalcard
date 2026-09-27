import nodemailer from "nodemailer";

// A single reusable transporter. Any SMTP provider works here.
// Only the .env values change, not the rest of this file.
// If SMTP isn't configured, we log instead of throwing so the rest of the app never breaks.
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null; // 💡 Cleans up your conditional logic explicitly

const send = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(
      `[email skipped — SMTP not configured] to=${to} subject="${subject}"`,
    );
    return;
  }

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      "OnlineMedicalCard <no-reply@onlinemedicalcard.com>",
    to,
    subject,
    html,
  });
};

export const sendWelcomeEmail = (to, fullName) =>
  send({
    to,
    subject: "Welcome to OnlineMedicalCard",
    html: `<p>Hi ${fullName},</p><p>Your account is ready. Start your evaluation whenever you're ready.</p>`,
  });

export const sendCardReadyEmail = (to, fullName) =>
  send({
    to,
    subject: "Your medical card is ready",
    html: `<p>Hi ${fullName},</p><p>Great news — your medical marijuana card has been approved and is ready to view in your dashboard.</p>`,
  });

export const sendDeniedEmail = (to, fullName, notes) =>
  send({
    to,
    subject: "Update on your OnlineMedicalCard evaluation",
    html: `<p>Hi ${fullName},</p><p>A physician reviewed your submission and was unable to approve a recommendation at this time.${
      notes ? ` Notes: \${notes}` : ""
    }</p>`,
  });
