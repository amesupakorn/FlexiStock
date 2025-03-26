import nodemailer from "nodemailer";

type LowStockData = {
  productName: string;
  warehouseName: string;
  stock: number;
  minStock: number;
};

export async function sendLowStockEmail(data: LowStockData) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"FlexiStock" <no-reply@flexistock.com>',
    to: process.env.ALERT_EMAIL,
    subject: `🚨 Low Stock Alert: ${data.productName}`,
    html: `
      <h3>Stock Alert</h3>
      <p><strong>Product:</strong> ${data.productName}</p>
      <p><strong>Warehouse:</strong> ${data.warehouseName}</p>
      <p><strong>Current Stock:</strong> ${data.stock}</p>
      <p><strong>Min Stock:</strong> ${data.minStock}</p>
    `,
  });
}