
const nodemailer = require('nodemailer');


require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("Starting email test v2...");
  
  // Try explicit SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false 
    },
    debug: true,
    logger: true 
  });


  try {
    const info = await transporter.sendMail({
      from: `"Test v2" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, 
      subject: "Test Email v2",
      text: "Testing with explicit SMTP settings.",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  }
}

main();
