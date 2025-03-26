import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  name: string;
  orderId: string;
  status: string;
  location: string;
}

export async function sendEmail({ to, name, orderId, status, location }: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"FlexiStock" <no-reply@flexistock.com>',
    to,
    subject: `Your Order Tracking Update: ${orderId}`,
    html: `
      <h2>Hello ${name},</h2>
      <p>Your order <strong>${orderId}</strong> has been updated.</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Current Location:</strong> ${location}</p>
      <br />
      <p>Thank you for using FlexiStock!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}