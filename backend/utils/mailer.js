// utils/mailer.js
// Sets up Nodemailer using Gmail, and exports a function to send confirmation emails.

const nodemailer = require('nodemailer');

// This transporter uses your Gmail account to send emails.
// You need an "App Password" (not your normal Gmail password) — instructions below.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendApplicationEmail(toEmail, userName, application) {
  const mailOptions = {
    from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `You applied to ${application.company} 🎯`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2b6cb0;">Hey ${userName}, thanks for logging this!</h2>
        <p>We've recorded your interest in the following opportunity:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 6px 0;"><strong>Company</strong></td>
            <td style="padding: 6px 0;">${application.company}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>Role</strong></td>
            <td style="padding: 6px 0;">${application.role}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>Status</strong></td>
            <td style="padding: 6px 0;">${application.status}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>Applied On</strong></td>
            <td style="padding: 6px 0;">${new Date(application.appliedDate).toLocaleDateString()}</td>
          </tr>
        </table>

        <p>We'll be rooting for you as this one moves forward. Keep going, one application at a time! 🚀</p>

        <p style="color: #888; font-size: 13px; margin-top: 24px;">— Your Job Tracker</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${toEmail}`);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

module.exports = sendApplicationEmail;